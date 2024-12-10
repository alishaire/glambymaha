import axios from "axios";
import Link from "next/link";
import queryStr from "query-string";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Toaster, toast } from "react-hot-toast";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { format, render, cancel, register } from "timeago.js";

const tableHeader = [
  { lable: "Date", align: "left" },
  { lable: "Product Detail", align: "left" },
  { lable: "Costomer Name", align: "left" },
  { lable: "Address", align: "left" },
  { lable: "Price", align: "left" },
  { lable: "Product Status", align: "left" },
  { lable: "Actions", align: "center" },
];

const productStatus = [
  { name: "Pending" },
  { name: "Confirmed" },
  { name: "Shipped" },
  { name: "Delivered" },
  { name: "Cancelled" },
];
const paymentStatus = [{ name: "Pending" }, { name: "Confirmed" }];

const index = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  var hasUserID = user?._id;

  const [filterByName, setFilterByName] = useState({ name: "" });

  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useQuery(["products", filterByName], async () => {
    try {
      const queryString = queryStr.stringify(filterByName);
      const res = await axios.get(`/api/orders?${queryString}`);
      return res.data.message;
    } catch (error) {
      throw new Error(error.message);
    }
  });

  // Login User Address And Other Details -------------
  const [loginUserData, setLoginUserData] = useState("");

  // Fetch Login User Address And Other Details --------
  const fetchUser = async () => {
    var res = await axios.get(`/api/auth/profile?id=${hasUserID}`);
    setLoginUserData(res.data.message);
  };

  // Call the Fetch Login User data Function ------------
  useEffect(() => {
    fetchUser();
  }, []);

  // Input Hadler For Searching by Name ------------------------------------------/
  const searchInputHanler = (e) => {
    setFilterByName({ ...filterByName, [e.target.name]: e.target.value });
  };

  // Fetch Data Basis Filter by Name Function ------------------------------------/
  const fetchProductData = async () => {
    try {
      setLoading(true);
      await refetch();
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter Data On Filteration --------------------------------------------------/
  useEffect(() => {
    fetchProductData();
  }, [filterByName]);

  // Delete particular Order ------------------------------------------------------/
  const delPost = async (id) => {
    try {
      if (window.confirm("Do you want to Delete this Product") === true) {
        const res = await fetch(`/api/orders/${id}`, {
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

  // Open Model ------------------------------------------------------------------/
  const [showModal, setShowModal] = useState(false);
  const [modeladata, setModeldata] = useState("");

  const openModal = (v) => {
    setModeldata(v);
    setShowModal(true);
  };

  const [updateShowModal, setUpdateShowModal] = useState(false);
  const [updateModeladata, setUpdateModeladata] = useState("");
  // Update status
  const openUpdateModal = (v) => {
    setUpdateModeladata(v);
    setUpdateShowModal(true);
  };

  // Form all fucntion ------------------------------------------/

  const [formData, setFormData] = useState({
    status: "",
    message: "",
  });

  // Update status remarks change handler ---------------------------------/
  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const Id = updateModeladata._id;
      var res = await axios.put(`/api/orders/${Id}`, {
        ...formData,
      });

      toast.success(res.data.message);

      if (res.data.success) {
        setUpdateModeladata(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* TABLE STARTED ---------------------------------------------------------------------------  */}
      <div className="w-full p-3">
        <div className="w-full  overflow-auto rounded-2xl border bg-white">
          <div className="flex w-full flex-col items-center justify-between gap-3 p-4 lg:flex-row">
            <h2 className="text-xl font-semibold">
              All <span className="text-red-600">Orders</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="">
                  <input
                    name="name"
                    value={filterByName.name}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm text-gray-500 ">
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
                {productData?.map((v, i) => {
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-100 bg-white hover:bg-slate-100"
                    >
                      <td className="px-6 py-2 text-[10px]">
                        {format(new Date(v.createdAt), "en_US")}
                      </td>
                      <td
                        scope="row"
                        className="flex items-center gap-2 whitespace-nowrap border-0 px-6 py-2 font-medium text-gray-600"
                      >
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                          {v.items.map(
                            (item, index) =>
                              index < 2 && (
                                <img
                                  key={index}
                                  alt={`Image ${index + 1}`}
                                  src={item?.productID?.images[0] || null}
                                  className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 transition-all hover:-translate-x-2"
                                />
                              ),
                          )}
                          {v.items.length > 2 && (
                            <a
                              href="#"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
                            >
                              +{v.items.length - 2}
                            </a>
                          )}
                        </div>
                        {v.items[0]?.productID?.name.slice(0, 18) + "..."}
                      </td>
                      {/* Costomer Details ---------------------------- */}
                      <td className="px-6 py-2">
                        {v.customerDetail.fullname ||
                          v.hasLoginUserData?.fullname}
                      </td>
                      <td className="px-6 py-2">
                        {" "}
                        {v.customerDetail.address || v.isLoginUserAddress}
                      </td>
                      <td className="px-6 py-2"> {v.total} </td>
                      <td className="px-6 py-2">
                        <span
                          className={`rounded-full px-3 font-light ${
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

                      <td className="px-6 py-2 text-center text-lg">
                        <button onClick={() => openModal(v)}>
                          <i
                            title="View"
                            className="fa fa-solid fa-eye cursor-pointer rounded-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
                          ></i>
                        </button>
                        <button onClick={() => openUpdateModal(v)}>
                          <i className="fa-solid fa-pen-to-square cursor-pointer rounded-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"></i>
                        </button>
                        {/* <Link href={`products/edit-product/${v.slug}`}>
                        <i
                          title="Edit"
                          className="fa-solid fa-pen-to-square px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-full text-gray-400 text-sm"
                        ></i>
                      </Link> */}
                        <i
                          title="Delete"
                          onClick={() => delPost(v._id)}
                          className="fa fa-solid fa-trash cursor-pointer rounded-full px-2 py-1 text-sm text-red-400 hover:bg-gray-100"
                        ></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination start  ----------- */}
          <div className=" flex w-full items-center justify-end gap-5 border-b border-gray-100 bg-gray-50 py-5 pr-10">
            <span className=" flex items-center justify-center whitespace-nowrap text-sm text-slate-500">
              {/* {pageCount} to {end} of {total} */}
              {productData?.page} of {productData?.ending} to{" "}
              {productData?.TotalProducts}
            </span>
            <div className="flex gap-4 rounded-full border px-4 py-1">
              <i
                onClick={() =>
                  router.push(
                    `/dashboard/products?page=${productData?.page - 1}`,
                  )
                }
                className={`fa-solid fa-angle-left border-r p-1 pr-4 text-xs text-red-600 ${
                  productData?.starting == 1
                    ? "cursor-not-allowed text-slate-300"
                    : "cursor-pointer hover:text-red-500"
                }`}
              ></i>

              <i
                onClick={() => {
                  if (productData?.end < productData?.TotalProducts) {
                    router.push(
                      `/dashboard/products?page=${productData?.page + 1}`,
                    );
                  }
                }}
                className={`fa-solid fa-angle-right p-1 text-xs text-red-600 ${
                  productData?.end >= productData?.TotalProducts
                    ? "cursor-not-allowed text-slate-300"
                    : "cursor-pointer hover:text-red-500"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>

      {/* order details modal here ------------- */}
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
          } relative mx-auto my-8 max-w-[70%] rounded-lg bg-transparent p-4 duration-500`}
        >
          <span
            onClick={() => setShowModal(false)}
            className="h-8 w-8 cursor-pointer"
          >
            <i className="bxShadow fa-solid fa-xmark absolute -right-[0px] top-[12px] z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-400 p-1 text-white hover:bg-gray-100 hover:text-gray-900"></i>
          </span>
          <div className="mt-3 rounded-lg bg-white p-4 backdrop-blur-sm">
            <span className=" mb-4 text-xl font-semibold text-slate-800">
              Product Details
            </span>
            <div className="mt-3 flex items-center justify-center gap-4">
              {modeladata?.items?.map((item, index) => (
                <>
                  <img
                    key={index}
                    alt={`Image ${index + 1}`}
                    src={item.productID.images[0] || null}
                    className=" h-32 w-28 rounded-md bg-gray-200 bg-contain"
                  />
                  <h2 className=" text-sm text-gray-500">
                    {" "}
                    {item.productID.name}
                  </h2>
                </>
              ))}
            </div>
            <div className="my-4 mt-6">
              <h2 className=" mb-4 text-xl font-semibold text-slate-700">
                Customer Details
              </h2>
              {/* customer detail main div ----------------- */}
              <div className=" grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
                {/* Customer detail ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Customer Name
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.customerDetail?.fullname ||
                      modeladata.isLoginUserName}
                  </span>
                </div>
                {/* Email ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Email
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.customerDetail?.email || loginUserData.email}
                  </span>
                </div>
                {/* City ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    City
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.customerDetail?.city ||
                      modeladata.isLoginUserAddress}
                  </span>
                </div>
                {/* Address ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Address
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.customerDetail?.address ||
                      modeladata.isLoginUserAddress}
                  </span>
                </div>
                {/* Product Details ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Product Details
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.status}
                  </span>
                </div>
                {/* Payment Details ---------------------- */}
                <div className="globalShadow mb-4 flex flex-col rounded-lg p-4">
                  <span className="mb-1 text-xs font-medium text-[#222222ab]">
                    Payment Details
                  </span>
                  <span className="text-sm font-semibold text-[#444]">
                    {modeladata?.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* order Update Status Modal */}
      <div
        style={{
          visibility: updateModeladata ? "visible" : "hidden",
          opacity: updateModeladata ? "1" : "0",
          transition: ".4s",
        }}
        className="fixed left-0 top-0 z-10 h-screen w-full overflow-auto border-red-600 bg-[#00000094] backdrop-blur-[2px]"
      >
        <div
          className={`${
            updateModeladata ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } relative mx-auto my-8 max-w-[90%] rounded-lg bg-transparent p-4 duration-500 md:max-w-[70%] lg:max-w-[50%]`}
        >
          <span
            onClick={() => setUpdateModeladata(false)}
            className="h-8 w-8 cursor-pointer"
          >
            <i className="bxShadow fa-solid fa-xmark absolute -right-[0px] top-[12px] z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-400 p-1 text-white hover:bg-gray-100 hover:text-gray-900"></i>
          </span>
          <div className="mt-3 rounded-lg bg-white p-4 backdrop-blur-sm">
            <span className=" mb-4 text-xl font-semibold text-slate-800">
              Update Status of Product
            </span>
            <form onSubmit={submitForm}>
              <div className="my-5 flex flex-col">
                <label className="mb-1 text-gray-500" htmlFor="paymentStatus">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  onChange={changeHandler}
                  value={formData.paymentStatus}
                  className="relative rounded-lg border border-gray-200 px-2 py-[6px] pl-3 text-sm text-gray-400 transition-colors focus:text-gray-400 focus:outline-none focus:ring-2"
                >
                  <option selected value="select paymentStatus">
                    Select Product Payment Status
                  </option>
                  {paymentStatus?.map((v, i) => {
                    return (
                      <option key={i} value={v.name}>
                        {v.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="my-5 flex flex-col">
                <label className="mb-1 text-gray-500" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={changeHandler}
                  className="relative rounded-lg border border-gray-200 px-2 py-[6px] pl-3 text-sm text-gray-400 transition-colors focus:text-gray-400 focus:outline-none focus:ring-2"
                >
                  <option selected value="select status">
                    Select Product Status
                  </option>
                  {productStatus?.map((v, i) => {
                    return (
                      <option key={i} value={v.name}>
                        {v.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button className="rounded-md bg-indigo-500 px-4 py-1.5 text-white">
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
