import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

const index = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // adding new address here ------------
  const [addressFormData, setAddressFormData] = useState({
    city: "",
    addresses: "",
  });

  // address router handler here ----------
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const userSubmitAddressData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const userId = user._id;

      const res = await axios.post(
        `/api/auth/register/add-address/?id=${userId}`,
        {
          userId: userId,
          city: addressFormData.city,
          addresses: addressFormData.addresses,
        }
      );

      if (res.data.success) {
        toast.success("Address added successfully!");
        setAddressFormData({ city: "", addresses: "" });
        window.location.reload();
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete particular Address --------------
  const deleteAddress = async (addressId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this address?"
      );
      if (!confirmDelete) return;

      const userId = user?._id;
      await axios.delete(
        `/api/auth/register/delete-address?userId=${userId}&addressId=${addressId}`
      );
      toast.success("Address deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-5 gap-1 lg:gap-4 max-w-[1100px] m-auto mt-4 px-4">
        <div className="bg-white col-span-5 lg:col-span-3 relative mt-4 rounded-lg">
          <Link
            href="/dashboard/profile/edit"
            className="absolute cursor-pointer top-6 right-6 border rounded-md text-gray-600 bg-gray-100  border-gray-200 hover:text-indigo-600 hover:bg-gray-50 gap-1 text-sm flex items-center px-3 py-1 transition-all duration-150"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Edit
          </Link>
          <Link
            href="/dashboard/profile/update-password"
            className="absolute cursor-pointer top-6 right-24 border rounded-md text-gray-600 bg-gray-100  border-gray-200 hover:text-indigo-600 hover:bg-gray-50 gap-1 text-sm flex items-center px-3 py-1 transition-all duration-150"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            Update
          </Link>

          <div className="shade rounded-lg py-10 flex items-center flex-col justify-center">
            {user ? (
              <div>
                <div className="max-w-full m-auto">
                  <div className="h-fit w-fit border-[10px] border-[#eeeeee9c] rounded-full max-w-full m-auto">
                    <img
                      alt="image here"
                      src={user.photo || "/user.jpeg"}
                      className="h-60 w-60 border-[10px] object-cover border-[#c9c9c9cc] rounded-full"
                    />
                  </div>
                </div>

                {/* Full Name ----------------------------------------------- */}
                <div className="flex items-center justify-center flex-col mt-6">
                  <h1 className="capitalize text-3xl mb-3 text-slate-800 font-bold tracking-wider">
                    {user.fullname}
                  </h1>
                  <h2 className="text-[#6c757d] text-xs uppercase tracking-wide">
                    {user.username}
                  </h2>
                </div>
                {/* Inner Divs ----------------------------------------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
                  {/* Email ----------------------------------------------- */}
                  <div className="px-4 py-2 flex items-center gap-4 shadow-md rounded-lg">
                    <i className="fa-solid fa-envelope text-xl text-gray-400"></i>
                    <div>
                      <p className="text-xs text-[#00000084] mb-1">Email</p>
                      <span className="text-[#444] text-sm">{user.email}</span>
                    </div>
                  </div>
                  {/* Phone ----------------------------------------------- */}
                  <div className="px-4 py-2 flex items-center gap-2 shadow-md rounded-lg">
                    <i className="fa-solid fa-phone text-gray-400"></i>
                    <div>
                      <p className="text-xs text-[#00000084] mb-1">Phone</p>
                      <span className="text-[#444] text-sm">
                        {user.phone}
                      </span>
                    </div>
                  </div>
                  {/* User Role ---------------------------------------------- */}
                  <div className="px-4 py-2 flex items-center gap-3 shadow-md rounded-lg">
                    <i className="fa-solid fa-user-secret text-lg text-gray-400"></i>
                    <div>
                      <p className="text-xs text-[#00000084] mb-1">User Role</p>
                      <span className="text-[#444] text-sm">{user.role}</span>
                    </div>
                  </div>
                  {/* Gender ----------------------------------------------- */}
                  <div className="px-4 py-2 flex items-center gap-3 shadow-md rounded-lg">
                    <i className="fa-solid fa-user text-gray-400 text-lg"></i>
                    <div>
                      <p className="text-xs text-[#00000084] mb-1">Gender</p>
                      <span className="text-[#444] text-sm">
                        {user.gender || "Male"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-red-600 text-2xl">
                Opps! Profile Not Found...
              </span>
            )}
          </div>
        </div>

        <div className="bg-white col-span-5 lg:col-span-2 relative my-4 rounded-lg overflow-y-auto">
          <h1 className="px-4 py-6 text-xl text-gray-700 font-semibold">
            Your Address Here
          </h1>
          <div className=" max-h-[450px] mb-2 overflow-y-auto">
            {user?.addressDetails.map((v, i) => {
              return (
                <div
                  key={i}
                  className="border mx-4 rounded-lg p-4 relative overflow-hidden group mb-4"
                >
                  <div className=" mb-2">
                    <span className=" text-gray-400 text-xs">CITY</span>
                    <h2 className=" text-gray-600">{v.city}</h2>
                  </div>
                  <div>
                    <span className=" text-gray-400 text-xs">ADDRESS</span>
                    <h2 className=" text-gray-600">{v.addresses}</h2>
                  </div>
                  <i
                    title="Delete This Address"
                    onClick={() => deleteAddress(v?._id)}
                    className="fa-solid fa-trash text-red-400 absolute top-4 right-4 translate-x-10 group-hover:translate-x-0 transition-all duration-200 cursor-pointer"
                  ></i>
                </div>
              );
            })}
          </div>
          <div className="px-4 my-4">
            <div
              onClick={() => setShowForm(true)}
              className=" flex items-center gap-2 p-2 w-fit rounded-lg bg-red-100 cursor-pointer hover:bg-red-200 transition"
            >
              <i className="fa-solid fa-plus rounded-full h-6 w-6 flex items-center justify-center bg-red-500 text-white transition-all duration-150 cursor-pointer text-sm"></i>
              <span className=" text-red-500">Add New Address</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          visibility: showForm ? "visible" : "hidden",
          opacity: showForm ? "1" : "0",
          transition: ".4s",
        }}
        className="fixed z-50 top-0 left-0 w-full h-screen border-red-600 backdrop-blur-[2px] bg-[#00000094] overflow-auto"
      >
        <div
          className={`${
            showForm ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } bg-white duration-500 md:mx-auto mx-4 my-8 relative p-4 max-w-xl lg:max-w-4xl border rounded-lg`}
        >
          <div className="flex items-center justify-between">
            <h1 className=" text-xl text-gray-700 font-semibold">
              Add New Shipping Address
            </h1>
            <span onClick={() => setShowForm(false)} className="cursor-pointer">
              <i className="fa-solid fa-x text-gray-500 text-sm hover:text-gray-600"></i>
            </span>
          </div>

          <form className="space-y-6 mt-4" onSubmit={userSubmitAddressData}>
            {/* Town / City ----------------------- */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm leading-6 text-gray-500"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressFormData.city}
                  placeholder="Enter Your City"
                  onChange={handleAddressChange}
                  className="border-gray-300 rounded-md px-3 py-2 w-full font-light placeholder:text-gray-400"
                />
              </div>
            </div>
            {/* New Address  ----------------------- */}
            <div>
              <label
                htmlFor="addresses"
                className="block text-sm leading-6 text-gray-500"
              >
                New Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="addresses"
                  name="addresses"
                  onChange={handleAddressChange}
                  placeholder="Enter Your Address"
                  value={addressFormData.addresses}
                  className="border-gray-300 rounded-md px-3 py-2 w-full font-light placeholder:text-gray-400"
                />
              </div>
            </div>
            {/* Button here --------------------- */}
            <div>
              <button
                type="submit"
                className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                {loading ? "Processing..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;
