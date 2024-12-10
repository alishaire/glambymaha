import axios from "axios";
import Link from "next/link";
import queryStr from "query-string";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";

const tableHeader = [
  { lable: "Name", align: "left" },
  { lable: "Username", align: "left" },
  { lable: "Email", align: "left" },
  { lable: "Phone No", align: "left" },
  { lable: "Role", align: "left" },
  { lable: "Actions", align: "center" },
];

const index = ({ users: initialProducts, start, end, total, page }) => {
  const router = useRouter();
  var pageCount = parseInt(page);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [fuser, setFuser] = useState(initialProducts);
  const [filterByName, setFilterByName] = useState({ fullname: "" });

  // Input Hadler For Searching by Name ------------------------------------------/
  const searchInputHanler = (e) => {
    setFilterByName({ ...filterByName, [e.target.name]: e.target.value });
  };

  // delete User by ID ------------------------------------------------------/
  const deleteUser = async (id) => {
    try {
      if (window.confirm("Do you wnat to Delete this User") === true) {
        const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (
          toast.success("User Deleted Successfully!", {
            duration: 2000,
          })
        ) {
          // router.push("/dashboard");
          window.location.reload();
        } else {
          toast.error("Something went Wrong");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  // Fetch Data Basis Filter by Name Function ------------------------------------/
  const fetchUserData = async () => {
    try {
      setLoading(true);

      const queryString = queryStr.stringify({
        name: filterByName.fullname,
        page: pageCount,
      });

      const { data } = await axios.get(`/api/users?${queryString}`);
      setFuser(data.message.users);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter Data On Filteration --------------------------------------------------/
  useEffect(() => {
    if (pageCount === page) {
      setFuser(initialProducts);
    } else {
      fetchUserData();
    }
  }, [filterByName.name, pageCount]);

  // Modal States ------------------------------------------------------------------/
  const [showModal, setShowModal] = useState(false);
  const [modeladata, setModeldata] = useState("");

  // Modal here -------------------------------------------------------------------/
  const openModal = (v) => {
    setModeldata(v);
    setShowModal(true);
  };

  // ADD NEW USER MODAL FUNCTIONS START HERE =============================================
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "admin",
  });

  const routehandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = await axios.post("/api/auth/register", formData);
      if (user.data.success) {
        toast.success("User Register Successfully!");
        setFormData({
          fullname: "",
          username: "",
          password: "",
          email: "",
          phone: "",
        });
        setShowForm(false);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* TABLE STARTED ---------------------------------------------------------- */}
      <div className="w-full p-3">
        <div className="w-full overflow-x-auto rounded-2xl border">
          <div className="flex flex-col items-center justify-between gap-3 bg-white p-4 lg:flex-row">
            <h2 className="text-xl font-semibold">
              All <span className="text-red-600">Products</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="">
                  <input
                    type="search"
                    name="fullname"
                    value={filterByName.fullname}
                    onChange={searchInputHanler}
                    placeholder="Search here..."
                    className="relative w-[25vw] rounded-md border-2 border-red-200 px-2 py-[6px] pl-3 text-sm text-gray-400 transition-colors focus:text-gray-400 focus:outline-none focus:ring-2 lg:w-[22vw]"
                  />
                  <span>
                    {loading ? (
                      <i className="fa-solid fa-spinner dashboardSearchSlide absolute right-3 top-[30%] text-xs text-gray-500"></i>
                    ) : null}{" "}
                  </span>
                </div>
              </div>
              <div>
                <i
                  onClick={() => setShowForm(true)}
                  className="fa-solid fa-plus flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-500 text-sm text-white transition-all duration-150"
                ></i>
              </div>
            </div>
          </div>
          <table className="w-full min-w-[1000px] text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700">
              <tr>
                {tableHeader.map((value, index) => {
                  return (
                    <th
                      scope="col"
                      key={index}
                      className={`px-6 py-3 text-${value.align}`}
                    >
                      {value.lable}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {fuser?.map((v, i) => {
                return (
                  <tr key={i} className="border-b border-gray-100 bg-white">
                    <td
                      scope="row"
                      className="flex items-center whitespace-nowrap border-0 px-6 py-2 font-medium text-gray-600"
                    >
                      <div className="mr-3 h-10 w-10 overflow-hidden rounded-full border border-gray-100">
                        <img
                          className="h-full w-full object-contain"
                          src={v.photo || "/user.jpeg"}
                          alt="Image Here"
                        />
                      </div>
                      {v.fullname}
                    </td>
                    <td className="px-6 py-2"> {v.username} </td>
                    <td className="px-6 py-2"> {v.email} </td>
                    <td className="px-6 py-2"> {v.phone} </td>
                    <td className="px-6 py-2">
                      <span
                        className={`rounded-full px-3 font-light ${
                          v.role == "admin"
                            ? "bg-purple-50 text-purple-400"
                            : "bg-pink-50 text-pink-400"
                        }`}
                      >
                        {v.role == "admin" ? "Admin" : "User"}
                      </span>{" "}
                    </td>
                    <td className="px-6 py-2 text-center text-lg">
                      <button>
                        <i
                          title="View Deatail"
                          onClick={() => openModal(v)}
                          className="fa fa-solid fa-eye cursor-pointer rounded-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
                        ></i>
                      </button>
                      <i
                        title="Delete"
                        onClick={() => deleteUser(v._id)}
                        className="fa fa-solid fa-trash cursor-pointer rounded-full px-2 py-1 text-sm text-red-400 hover:bg-gray-100"
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className=" flex w-full items-center justify-end gap-5 border-b border-gray-100 bg-gray-50 py-5 pr-14">
            <span className=" flex items-center justify-center whitespace-nowrap text-sm text-slate-500">
              {pageCount} to {end} of {total}
            </span>
            <div className="flex gap-4 rounded-full border px-4 py-1">
              <i
                onClick={() =>
                  router.push(`/dashboard/users?page=${pageCount - 1}`)
                }
                className={`fa-solid fa-angle-left border-r p-1 pr-4 text-xs text-red-600 ${
                  start == 1
                    ? "cursor-not-allowed text-slate-300"
                    : "cursor-pointer hover:text-red-500"
                }`}
              ></i>

              <i
                onClick={() => {
                  if (end < total) {
                    router.push(`/dashboard/users?page=${pageCount + 1}`);
                  }
                }}
                className={`fa-solid fa-angle-right p-1 text-xs text-red-600 ${
                  end >= total
                    ? "cursor-not-allowed text-slate-300"
                    : "cursor-pointer hover:text-red-500"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>
      {/* User Details Modal Here  ------------------------------------------------------- */}
      <div
        style={{
          visibility: showModal ? "visible" : "hidden",
          opacity: showModal ? "1" : "0",
          transition: ".4s",
        }}
        className="fixed left-0 top-0 z-10 h-screen w-full overflow-auto border-red-600 bg-[#00000094] backdrop-blur-[2px]"
      >
        <div
          className={`${
            showModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } relative mx-auto my-8 max-w-xl rounded-lg bg-transparent p-4 px-4 duration-500 lg:max-w-2xl lg:px-0`}
        >
          <span onClick={() => setShowModal(false)} className="cursor-pointer">
            <i className="fa-solid fa-x bxShadow absolute right-2 top-10 z-20 flex h-8 w-8 cursor-pointer items-center justify-center text-slate-400 hover:text-gray-500"></i>
          </span>
          <div className="mt-3 grid grid-cols-2 items-center justify-center gap-2 rounded-lg bg-white backdrop-blur-sm">
            <div className="h-[420px] w-full">
              <img
                alt="photo alt"
                src={modeladata.photo || "/user.jpeg"}
                className="h-full w-full rounded-l-lg object-cover"
              />
            </div>
            <div className="rounded-r-lg bg-transparent p-2">
              <h1 className="mb-4 text-3xl font-bold text-[#1553A1]">
                {modeladata.fullname}
              </h1>
              <div className="mt-2 text-left">
                <div className="col-span-2 mb-4 grid w-full items-center">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    User Name
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata.username}
                  </span>
                </div>

                <div className="col-span-2 mb-4 grid w-full items-center">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Email
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata.email}
                  </span>
                </div>

                <div className="col-span-2 mb-4 grid w-full items-center">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    phone
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata.phone}
                  </span>
                </div>

                <div className="col-span-2 mb-4 grid w-full items-center">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    User Role
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata.role}
                  </span>
                </div>

                {/* <div className="mb-4 grid col-span-2 items-center w-full">
                  <span className="mb-1 text-[#222222ab] font-medium text-xs">
                    Address
                  </span>
                  <span className="text-[#444] text-sm font-semibold">
                    {modeladata.address}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal Here ----------------------------------------------------  */}
      <div
        style={{
          visibility: showForm ? "visible" : "hidden",
          opacity: showForm ? "1" : "0",
          transition: ".4s",
        }}
        className="fixed left-0 top-0 z-10 h-screen w-full overflow-auto bg-[#00000094] backdrop-blur-[2px]"
      >
        <div
          className={`${
            showForm ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } relative mx-3 my-8 max-w-xl overflow-hidden rounded-lg bg-white duration-500 sm:mx-auto lg:max-w-4xl`}
        >
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <h2 className=" text-xl font-semibold text-slate-500">
              Add New User
            </h2>
            <i
              onClick={() => setShowForm(false)}
              className="fa-solid fa-xmark  flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 text-lg text-gray-400 hover:bg-gray-200"
            ></i>
          </div>
          {/* -------------------------- UPLOAD NEW User HERE -------------------------------------- */}
          <form className="space-y-6 p-4" onSubmit={submitForm}>
            {/* Full name  ----------------*/}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm leading-6 text-gray-500"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullname"
                  onChange={routehandler}
                  value={formData.fullname}
                  autoComplete="fullName"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* Username  ----------------*/}
            <div>
              <label
                htmlFor="username"
                className="block text-sm leading-6 text-gray-500"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  onChange={routehandler}
                  autoComplete="username"
                  value={formData.username}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* Phone  ----------------*/}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm leading-6 text-gray-500"
              >
                Phone
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  onChange={routehandler}
                  autoComplete="phone"
                  value={formData.phone}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* Email ----------------*/}
            <div>
              <label
                htmlFor="email"
                className="block text-sm leading-6 text-gray-500"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  onChange={routehandler}
                  value={formData.email}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* Password ----------------*/}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm leading-6 text-gray-500"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="block text-sm leading-6 text-gray-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  onChange={routehandler}
                  value={formData.password}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* button ----------------*/}
            <div>
              <button
                type="submit"
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;

// Fetch All Product Data Api ----------------------------------------------------------------------------/
export async function getServerSideProps(props) {
  const queryString = queryStr.stringify(props.query);
  const res = await fetch(
    // `https://u-store.vercel.app//api/users?${queryString}`
    `http://localhost:3000/api/users?${queryString}`,
  );
  const data = await res.json();

  return {
    props: {
      users: data.message.users,
      start: data.message.starting,
      end: data.message.ending,
      total: data.message.totalUser,
      page: data?.message?.page,
    },
  };
}
