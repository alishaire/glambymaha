import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

// ASIDE LINKS ADDED
var adminNavLinks = [
  { href: "/dashboard", lable: "Dashboard", icon: "fa-solid fa-chart-simple" },
  { href: "/dashboard/category", lable: "Category", icon: "fa-solid fa-list" },
  {
    href: "/dashboard/products",
    lable: "Product",
    icon: "fa-solid fa-headphones-simple",
  },
  {
    href: "/dashboard/users",
    lable: "Users",
    icon: "fa-regular fa-user",
  },
  {
    href: "/dashboard/orders",
    lable: "Orders",
    icon: "fa-regular fa-calendar",
  },
];

var userNavLinks = [
  {
    lable: "Dashboard",
    href: "/dashboard/user-portal",
    icon: "fa-solid fa-chart-simple",
  },
  {
    lable: "Account",
    href: "/dashboard/profile",
    icon: "fa-solid fa-list",
  },
  {
    lable: "Orders",
    href: "/dashboard/user-portal/order",
    icon: "fa-regular fa-calendar",
  },
];

const Aside = () => {
  const router = useRouter();
  const [toggle, setToggle] = useState(true);

  const { user } = useContext(AuthContext);

  // set the Toggle Value False if window width should be md, or sm -------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setToggle(false);
      } else {
        setToggle(true);
      }
    };

    // Set initial toggle state based on the window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
      style={{
        transition: ".6s",
        width: toggle ? "200px" : "48px",
      }}
      className={`mt-4 flex flex-col justify-between overflow-hidden ${
        toggle ? "pr-4" : "pr-0"
      }`}
    >
      <div className="relative flex flex-col">
        <div className="my-4 flex h-full flex-1 flex-col justify-between">
          {user?.role == "admin" ? (
            <ul className="text-sm">
              {adminNavLinks.map((v, i) => {
                return (
                  <ul key={i}>
                    <Link
                      href={v.href}
                      className={`group relative flex cursor-pointer items-center rounded-none px-4 py-1 hover:bg-red-50 lg:rounded-r-full ${
                        router.pathname === v.href
                          ? "group cursor-pointer bg-red-400 hover:bg-red-400"
                          : ""
                      }`}
                    >
                      <i
                        className={`${v.icon} text-base ${
                          router.pathname === v.href
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      ></i>
                      <div
                        style={{
                          opacity: toggle ? "1" : "0",
                          transition: ".5s",
                        }}
                        className={`ml-3 ${
                          router.pathname === v.href
                            ? "font-medium text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {v.lable}
                      </div>
                    </Link>
                  </ul>
                );
              })}
            </ul>
          ) : (
            <ul className="text-sm">
              {userNavLinks.map((v, i) => {
                return (
                  <ul key={i}>
                    <Link
                      href={v.href}
                      className={`group relative flex cursor-pointer items-center rounded-none px-4 py-1 hover:bg-[#3e1e9707] lg:rounded-r-full ${
                        router.pathname === v.href
                          ? "group cursor-pointer md:bg-transparent lg:bg-[#F6F5FD]"
                          : ""
                      }`}
                    >
                      <i
                        className={`${v.icon} text-base ${
                          router.pathname === v.href
                            ? "text-[#3E1E97]"
                            : "text-gray-500"
                        }`}
                      ></i>
                      <div
                        style={{
                          opacity: toggle ? "1" : "0",
                          transition: ".5s",
                        }}
                        className={`ml-3 ${
                          router.pathname === v.href
                            ? "font-medium text-[#3E1E97]"
                            : "text-gray-600"
                        }`}
                      >
                        {v.lable}
                      </div>
                    </Link>
                  </ul>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-3 pl-2">
        <span onClick={() => setToggle(!toggle)}>
          <i
            style={{
              transition: ".5s",
            }}
            className={`asideAnimate cursor-pointer rounded-lg bg-gray-50 p-1 px-2 text-lg text-gray-600 active:bg-gray-300 ${
              toggle ? "fa-solid fa-angle-left" : "fa-solid fa-angle-right"
            }`}
          ></i>
        </span>
      </div>
    </aside>
  );
};

export default Aside;
