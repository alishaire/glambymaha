import axios from "axios";
import Link from "next/link";
import queryStr from "query-string";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Toaster, toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { format, render, cancel, register } from "timeago.js";

const tableHeader = [
  { lable: "Name", align: "left" },
  { lable: "Category", align: "left" },
  { lable: "Price", align: "left" },
  { lable: "Stock", align: "left" },
  { lable: "Sale", align: "left" },
  { lable: "Seller", align: "left" },
  { lable: "Actions", align: "center" },
];

const index = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterByName, setFilterByName] = useState({ name: "", page: 1 });

  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useQuery(["products", filterByName], async () => {
    try {
      const queryString = queryStr.stringify(filterByName);
      const res = await axios.get(`/api/get-all-product?${queryString}`);
      return res.data.message;
    } catch (error) {
      throw new Error(error.message);
    }
  });

  // Input Hadler For Searching by Name ------------------------------------------/
  const searchInputHanler = (e) => {
    setFilterByName({ ...filterByName, [e.target.name]: e.target.value });
  };

  // delete Product by Slug ------------------------------------------------------/
  const delPost = async (slug) => {
    try {
      if (window.confirm("Do you wnat to Delete this Product") === true) {
        const res = await fetch(`/api/products/${slug}`, {
          method: "DELETE",
        });
        if (
          toast.success("Product Deleted Successfully!", {
            duration: 1000,
          })
        ) {
          refetch();
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
  }, [filterByName]); // Refetch when filterByName changes

  return (
    <>
      <Toaster />
      {/* TABLE STARTED ---------------------------------------------------------------------------  */}
      <div className="w-full p-3">
        <div className="w-full overflow-x-auto rounded-2xl border">
          <div className="flex w-full flex-col items-center justify-between gap-3 bg-white p-4 lg:flex-row">
            <h2 className="text-2xl font-semibold">
              All <span className="text-red-600">Products</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  name="name"
                  value={filterByName.name}
                  onChange={searchInputHanler}
                  placeholder="Search here..."
                  className="relative w-[45vw] rounded-md border-2 border-red-200 px-2 py-[6px] pl-3 text-sm text-gray-400 transition-colors placeholder:text-gray-400 focus:text-gray-400 focus:outline-none focus:ring-2 lg:w-[22vw]"
                />
                <span>
                  {loading ? (
                    <i className="fa-solid fa-spinner absolute right-3 top-[30%]  text-xs text-gray-500"></i>
                  ) : null}{" "}
                </span>
              </div>

              <Link
                title="Add Product"
                className="my-2 flex items-center gap-2 rounded-md bg-red-400 px-4 py-2 text-white"
                href="/dashboard/products/createproduct"
              >
                <i className="fa-solid fa-pen"></i>
                <span>Add Product</span>
              </Link>
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
              {productData?.ProductData?.map((v, i) => {
                return (
                  <tr key={i} className="border-b border-gray-100 bg-white">
                    <td
                      scope="row"
                      className="flex items-center px-6 py-2 font-medium text-gray-600"
                    >
                      <div className=" flex items-center">
                        <div className="mr-3 h-12 w-12 overflow-hidden rounded-full border border-gray-100">
                          <img
                            className="h-full w-full object-contain"
                            src={v.images[0]}
                            alt="Image Here"
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <h2 className=" line-clamp-1 leading-[1.5] text-gray-600">
                            {v.name.slice(0, 60) + "..."}
                          </h2>
                          <span className=" text-xs font-light text-gray-500">
                            {format(new Date(v.createdAt), "en_US")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2"> {v.category} </td>
                    <td className="px-6 py-2"> {v.price} </td>
                    <td className="px-6 py-2"> {v.stock} </td>
                    <td className={`whitespace-nowrap px-6 py-2`}>
                      <span
                        className={`${
                          v.sale
                            ? "border-green-200 text-green-500"
                            : "border-red-100 text-red-500"
                        } rounded-md border px-2 font-light `}
                      >
                        {v.sale ? "Sale" : "Not Sale"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-2">{v.seller}</td>
                    <td className="whitespace-nowrap px-6 py-2">
                      <Link href={`/product/${v.slug}`}>
                        <i
                          title="View"
                          className="fa fa-solid fa-eye cursor-pointer rounded-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
                        ></i>
                      </Link>
                      <Link href={`products/edit-product/${v.slug}`}>
                        <i
                          title="Edit"
                          className="fa-solid fa-pen-to-square cursor-pointer rounded-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
                        ></i>
                      </Link>
                      <i
                        title="Delete"
                        onClick={() => delPost(v.slug)}
                        className="fa fa-solid fa-trash cursor-pointer rounded-full px-2 py-1 text-sm text-red-400 hover:bg-gray-100"
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Pagination start  ----------- */}
          <div className=" flex w-full items-center justify-end gap-5 border-b border-gray-100 bg-gray-50 py-5 pr-10">
            <span className=" flex items-center justify-center whitespace-nowrap text-sm text-slate-500">
              {productData?.page} of {productData?.ending} to{" "}
              {productData?.TotalProducts}
            </span>
            <div className="flex gap-4 rounded-full border px-4 py-1">
              <button disabled={productData?.starting == 1}>
                <i
                  onClick={() => {
                    setFilterByName({
                      ...filterByName,
                      page: filterByName.page - 1,
                    });
                  }}
                  className={`fa-solid fa-angle-left border-r p-1 pr-4 text-xs text-red-600 ${
                    productData?.starting == 1
                      ? "cursor-not-allowed text-slate-300"
                      : "cursor-pointer hover:text-red-500"
                  }`}
                ></i>
              </button>

              <button
                disabled={productData?.ending >= productData?.TotalProducts}
              >
                <i
                  onClick={() => {
                    setFilterByName({
                      ...filterByName,
                      page: filterByName.page + 1,
                    });
                  }}
                  className={`fa-solid fa-angle-right p-1 text-xs text-red-600 ${
                    productData?.ending >= productData?.TotalProducts
                      ? "cursor-not-allowed text-slate-300"
                      : "cursor-pointer hover:text-red-500"
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NEW MODEL DESING ---------------------------------------------------------------------------  */}
      <div
        style={{
          visibility: showForm ? "visible" : "hidden",
          opacity: showForm ? "1" : "0",
          transition: ".4s",
        }}
        className="fixed left-0 top-0 z-10 h-screen w-full overflow-auto border-red-600 bg-[#00000094] backdrop-blur-[2px]"
      >
        <div
          className={`${
            showForm ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } relative mx-auto my-8 max-w-xl rounded-lg border bg-white p-4 duration-500 lg:max-w-4xl`}
        >
          <span onClick={() => setShowForm(false)} className="cursor-pointer">
            close
          </span>
          <h1>Model Design</h1>
        </div>
      </div>
    </>
  );
};

export default index;
