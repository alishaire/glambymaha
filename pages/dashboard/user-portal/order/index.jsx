import axios from "axios";
import { useQuery } from "react-query";
import { Toaster, toast } from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import { format, render, cancel, register } from "timeago.js";
import React, { useContext, useEffect, useState } from "react";

const tableHeader = [
  { lable: "Date", align: "left" },
  { lable: "Product Detail", align: "left" },
  { lable: "Costomer Name", align: "left" },
  { lable: "Shipping Address", align: "left" },
  { lable: "Price", align: "left" },
  { lable: "Product Status", align: "left" },
  { lable: "Actions", align: "center" },
];

const index = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [filterByName, setFilterByName] = useState({ name: "" });

  // Input Hadler For Searching by Name ------------------------------------------/
  const searchInputHanler = (e) => {
    setFilterByName({ ...filterByName, [e.target.name]: e.target.value });
  };

  const { data, isLoading, isError, refetch } = useQuery(
    ["products", filterByName],
    async () => {
      try {
        const res = await axios.get(`/api/history?id=${user?._id}`);
        return res?.data?.foundOrders;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  );

  // Delete particular Order ------------------------------------------------------/
  const delPost = async (id) => {
    try {
      if (window.confirm("Do you want to Delete this Product") === true) {
        const res = await fetch(`/api/history/${id}`, {
          method: "DELETE",
        });
        if (
          toast.success("Product Deleted Successfully!", {
            duration: 2000,
          })
        ) {
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

  return (
    <>
      <Toaster />
      <div className="w-full p-3">
        <div className="overflow-x-auto w-full border rounded-2xl">
          <div className="bg-white p-4 flex justify-between items-center flex-col gap-3 lg:flex-row w-full">
            <h2 className="text-xl font-semibold">
              Your <span className="text-indigo-600">Orders</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="">
                  <input
                    name="name"
                    value={filterByName.name}
                    onChange={searchInputHanler}
                    placeholder="Search here..."
                    className="relative border border-gray-200 text-gray-400 text-sm pl-3 px-2 py-[6px] lg:w-[12vw] w-[25vw] rounded-full focus:ring-2 transition-colors focus:outline-none focus:text-gray-400"
                  />
                  <span>
                    {loading ? (
                      <i className="fa-solid fa-spinner absolute top-[30%] right-3 text-xs text-gray-500 dashboardSearchSlide"></i>
                    ) : null}{" "}
                  </span>
                </div>
                <i
                  title="Add Product"
                  className="absolute top-1/2 -translate-y-1/2 right-3 border-l pl-2 cursor-pointer text-gray-400 hover:text-gray-500 bx bx-search-alt-2"
                ></i>
              </div>
              <div>
                <i className="fa-solid fa-plus rounded-full h-8 w-8 flex items-center justify-center bg-blue-500 text-white transition-all duration-150 cursor-pointer text-sm"></i>
              </div>
            </div>
          </div>
          <table className="text-sm min-w-[1100px] w-full text-left text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
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
            {data?.length > 0 ? (
              data?.map((v, i) => {
                return (
                  <tbody>
                    <tr
                      key={i}
                      className="hover:bg-slate-100 border-b border-gray-100 bg-white"
                    >
                      <td className="px-6 py-2 text-[10px]">
                        {format(new Date(v.createdAt), "en_US")}
                      </td>
                      <td
                        scope="row"
                        className="px-6 flex gap-2 border-0 items-center py-2 font-medium text-gray-600 whitespace-nowrap"
                      >
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                          {v.items.map(
                            (item, index) =>
                              index < 2 && (
                                <img
                                  key={index}
                                  alt={`Image ${index + 1}`}
                                  src={item?.productID?.images[0] || null}
                                  className="w-8 h-8 border-white rounded-full bg-gray-200 hover:-translate-x-2 transition-all"
                                />
                              )
                          )}
                          {v.items.length > 2 && (
                            <a
                              href="#"
                              className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 rounded-full hover:bg-gray-600 dark:border-gray-800"
                            >
                              +{v.items.length - 2}
                            </a>
                          )}
                        </div>
                        {v.items[0]?.productID?.name.slice(0, 18) + "..."}
                      </td>
                      {/* Costomer Details ---------------------------- */}
                      <td className="px-6 py-2">
                        {v.hasLoginUserData?.fullname}
                      </td>
                      <td className="px-6 py-2">{v.isLoginUserAddress}</td>
                      <td className="px-6 py-2"> {v.total} </td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-3 rounded-full font-light ${
                            v.status === "Pending"
                              ? "bg-[#FAF5EF] text-[#FF941A]"
                              : v.status === "Confirmed"
                              ? "bg-blue-50 text-blue-400"
                              : v.status === "Delivered"
                              ? "bg-[#EEF7F2] text-[#05B651]"
                              : v.status === "Shipped"
                              ? "bg-purple-50 text-purple-400"
                              : v.status === "Cancelled"
                              ? "bg-[#FAF0F0] text-[#F46A6A]"
                              : ""
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className=" text-center px-6 py-2">
                        <i
                          title="Delete"
                          onClick={() => delPost(v._id)}
                          className="fa fa-solid fa-trash px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-full text-red-400 text-sm"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                );
              })
            ) : (
              <div className="hover:bg-slate-100 border-b border-gray-100 px-4 py-3">
                <h1 className=" text-lg">You Don't Have Any Order, Yet!</h1>
              </div>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default index;
