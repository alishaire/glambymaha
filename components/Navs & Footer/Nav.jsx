import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import OutsideClickHandler from "react-outside-click-handler";

const navLinks = [
  { text: "Home", route: "/" },
  { text: "Register", route: "/register" },
  { text: "Store", route: "/categories?query=face" },
  // { text: "Hair System", route: `/categories?query=Hair system` },
  // { text: "Accessories", route: `/categories?query=Accessories` },
  // { text: "Track My Order", route: `/ordertrack` },
  { text: "Login", route: "/login" },
];

const Nav = () => {
  const router = usePathname();
  const [mobNavPosstion, setMobNavPosstion] = useState(false);

  const { cartItems } = useContext(CartContext);
  const NoOfCartItems = cartItems.length;

  const { user, refetch } = useContext(AuthContext);

  // Logout Function ------------------------/
  const handleLogout = async () => {
    try {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;
      const res = await axios.post("/api/auth/logout");
      if (res.data.success) {
        toast.success("User Logout Successfully!");
        window.location.reload();
        refetch();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* ===================== Navbar For Desktop ==========================================  */}
      <div className="sticky top-0 z-[99] w-full bg-[#e4e4e4] py-3 drop-shadow-lg backdrop-blur-lg">
        <nav className="m-auto flex max-w-[1200px] items-center justify-between px-4 lg:px-0">
          {/* ===================== Navbar Image Here ==========================================  */}
          <div className=" w-16">
            <Link href="/">
              <Image
                priority
                width={500}
                height={200}
                alt="Logo Here"
                src="/ulogo.png"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* ===================== Navbar Links Here ==========================================  */}
            <div>
              <ul className="flex items-center gap-5 text-md">
                {navLinks.map(
                  (links, i) =>
                    !(
                      user &&
                      (links.route === "/register" || links.route === "/login")
                    ) && (
                      <li
                        key={links.route}
                        className="relative z-20 hidden text-gray-500 transition duration-200 hover:text-red-700 lg:block"
                      >
                        <Link href={links.route}>{links.text}</Link>
                      </li>
                    ),
                )}
              </ul>

              {/* ===================== Navbar Toggle Button ==========================================  */}
              <OutsideClickHandler
                onOutsideClick={() => {
                  setMobNavPosstion(false);
                }}
              >
                <div
                  onClick={() => setMobNavPosstion(!mobNavPosstion)}
                  className="visible lg:hidden"
                >
                  <div className="relative grid cursor-pointer grid-cols-1 items-center gap-3">
                    <span
                      className="absolute mt-0 w-6 border border-gray-400 transition-all duration-300 ease-in-out"
                      style={{
                        rotate: `${mobNavPosstion === false ? 0 : 44}deg`,
                        top: `${mobNavPosstion === false ? 3 : 12}px`,
                      }}
                    ></span>
                    <span
                      className="mt-5 w-6 border border-gray-400"
                      style={{ opacity: `${mobNavPosstion === false ? 1 : 0}` }}
                    ></span>
                    <span
                      className="absolute top-3 mt-0 w-6 border border-gray-400 transition-all duration-300 ease-in-out"
                      style={{
                        rotate: `${mobNavPosstion === false ? 0 : -44}deg`,
                      }}
                    ></span>
                  </div>
                </div>
              </OutsideClickHandler>
              {/* ===================== Navbar Toggle Button Ends ==========================================  */}
            </div>

            {/* ===================== Navbar Icons and User Auth ==========================================  */}
            <div className=" text-gray-60 hidden items-center gap-4 lg:flex">
              <Link href={"/cart"}>
                <i className=" fa-solid fa-cart-shopping relative cursor-pointer text-gray-500 hover:text-red-500">
                  {NoOfCartItems <= 0 ? null : (
                    <span className="absolute -top-2 left-2 flex h-4 w-4 items-center justify-center rounded-full bg-sky-300 text-xs text-[#344352]">
                      {NoOfCartItems}
                    </span>
                  )}
                </i>
              </Link>
              {user ? (
                <div className="group relative flex items-center gap-2 border-l border-gray-100 pl-2 pr-4">
                  <img
                    alt="image here"
                    src={user.photo || "/user.jpeg"}
                    className="h-9 w-9 cursor-pointer rounded-full border border-gray-300 object-cover"
                  />
                  <div className="leading-3">
                    <h2 className="mb-0.5 text-[14px] font-medium capitalize text-gray-600">
                      {user.fullname}
                    </h2>
                    <span className="cursor-pointer text-[11px] text-gray-500">
                      {user.role}
                    </span>
                  </div>

                  {/* Profile Model Here --------------------- */}
                  <div
                    className={`shade pointer-events-none absolute -left-4 top-[130%] z-[1000000] h-fit min-w-[100px] overflow-hidden rounded-md bg-white opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:top-[100%] group-hover:opacity-100`}
                  >
                    <ul className="px-4 py-5">
                      <li className="flex flex-col gap-2">
                        {user?.role == "admin" ? (
                          <Link
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-600"
                            href="/dashboard"
                          >
                            <i className="fa-solid fa-chart-simple"></i>{" "}
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-600"
                            href="/dashboard/user-portal"
                          >
                            <i className="fa-solid fa-chart-simple"></i>{" "}
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-600"
                        >
                          <i className="fa-solid fa-right-from-bracket"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      </div>

      {/* ===================== Navbar Responive ==========================================  */}
      <div
        style={{
          transition: ".3s",
          left: `${mobNavPosstion === true ? 0 : -100}%`,
        }}
        className="absolute top-0 z-[9999] h-screen w-full overflow-hidden bg-[#00000055]"
      >
        <nav
          style={{
            transition: ".8s",
            left: `${mobNavPosstion === true ? 0 : -100}%`,
          }}
          className="navGlass fixed h-full w-1/2 border bg-gray-300 p-4"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex w-full items-center gap-4">
              <Image
                width={80}
                height={80}
                alt="Logo Here"
                src="/ulogo.png"
                data-src="images/logo1.webp"
                className="h-16 w-16 object-cover"
              />
              <span>Glam By Maha</span>
            </Link>
            <i
              onClick={() => setMobNavPosstion(false)}
              className="bx bx-x grid cursor-pointer place-content-center rounded-full object-cover p-1 text-xl text-slate-300 hover:text-slate-400 "
            ></i>
          </div>
          <ul className="mt-10 grid gap-4">
            {navLinks.map(
              (v, i) =>
                !(
                  user &&
                  (v.route === "/register" || v.route === "/login")
                ) && (
                  <li key={i} className="text-slate-500 hover:text-slate-600">
                    <Link href={v.route}>{v.text}</Link>
                  </li>
                ),
            )}

            <li className="mt-2 text-slate-500 hover:text-slate-600">
              <Link
                href="/categories"
                className="flex w-fit items-center gap-1 rounded-lg bg-slate-600 px-5 py-2 text-white transition-all duration-150 hover:bg-indigo-500"
              >
                Explore
                <i className="bx bx-right-arrow-alt"></i>
                <i className="fa-solid fa-angle-right asideAnimate"></i>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Nav;
