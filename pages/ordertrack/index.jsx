import Image from "next/image";
import React from "react";

const index = () => {
  return (
    <>
      <div className="relative -z-20 flex h-screen flex-col items-center justify-center bg-[#F4F4F4] px-4">
        <Image
          width={400}
          height={400}
          src={"/Airplane.gif"}
          className="absolute -top-20 left-[35%] -z-10 max-md:hidden"
        />
        <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 max-md:text-center max-md:text-lg">
            TRACK ORDER STATUS
          </h2>
          <p className="pb-6 text-gray-500">
            To track your order please enter your Order number and email in the
            boxes below and press the "Track" button.
          </p>

          <form className="flex flex-col">
            <input
              placeholder="Email address"
              className="mb-4 rounded-md border-0 bg-gray-100 p-2 text-gray-800 transition duration-150 ease-in-out focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="email"
            />
            <input
              placeholder="Order Number"
              className="mb-4 rounded-md border-0 bg-gray-100 p-2 text-gray-800 transition duration-150 ease-in-out focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
            />

            <button
              className="mt-4 rounded-md bg-gradient-to-r from-red-300 via-red-500 to-red-300 px-4 py-2 font-bold text-white transition duration-150 ease-in-out hover:bg-indigo-600 hover:to-blue-600"
              type="submit"
            >
              Track
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;
