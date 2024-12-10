import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const Dnav = () => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;
      const res = await axios.post("/api/auth/logout");
      if (res.data.success) {
        // router.push("/login");
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-between px-4 py-0">
          <div className="flex items-center gap-4">
            <div className="mt-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  width={150}
                  height={150}
                  src="/ulogo.png"
                  className="mx-auto w-9"
                />
                <h2 className=" text-lg font-semibold text-gray-700">
                  Glam By Maha
                </h2>
              </Link>
            </div>
          </div>
          {/* PROFILE START ============================*/}
          <>
            {user ? (
              <div className="flex py-2 group relative items-center gap-2 pr-4">
                <img
                  src={user.photo || "/user.jpeg"}
                  alt="image here"
                  className="rounded-full h-9 w-9 object-cover cursor-pointer border border-gray-300"
                />
                <div className="leading-3">
                  <p className="text-[14px] capitalize font-medium">
                    {user.fullname}
                  </p>
                  <span className="text-[11px] cursor-pointer text-red-500 hover:text-red-600">
                    {user.role}
                  </span>
                </div>

                {/* Profile Model Here */}
                <div
                  className={`shade pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 group-hover:top-[100%] transition-all duration-500 bg-white absolute -left-4 top-[130%] overflow-hidden rounded-md h-fit min-w-[100px] z-[1000000]`}
                >
                  <ul className="px-4 py-5">
                    <li className="flex flex-col gap-2">
                      <Link
                        className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                        href="/dashboard/profile"
                      >
                        <i className="fa-solid fa-user"></i> Profile
                      </Link>
                      <Link
                        className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                        href="/dashboard/profile/edit"
                      >
                        <i className="fa-solid fa-gear"></i> Setting
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex py-2 group relative items-center gap-2 pr-4">
                <img
                  src="/user.jpeg"
                  alt="image here"
                  className="rounded-full h-9 w-9 object-cover cursor-pointer border border-gray-300"
                />
                <div className="leading-3">
                  <p className="text-[14px] capitalize font-medium">
                    Not Found
                  </p>
                  <span className="text-[11px] cursor-pointer text-red-500 hover:text-red-600">
                    User
                  </span>
                </div>

                {/* Profile Model Here  */}
                <div
                  className={`shade pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 group-hover:top-[100%] transition-all duration-500 bg-white absolute left-0 top-[130%] overflow-hidden rounded-md h-fit min-w-[100px] z-[1000000]`}
                >
                  <ul className="px-4 py-4">
                    <li className="flex flex-col gap-2">
                      <Link
                        className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                        href="/dashboard/profile"
                      >
                        <i className="fa-solid fa-user"></i> Profile
                      </Link>
                      <Link
                        className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                        href="/"
                      >
                        <i className="fa-solid fa-gear"></i> Setting
                      </Link>
                      <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2">
                        <i className="fa-solid fa-gear"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Dnav;
