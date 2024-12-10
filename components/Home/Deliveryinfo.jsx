const Deliveryinfo = () => {
  
  return (
    <div className="max-w-[1220px] m-auto bg-white rounded-lg">
      <div className="p-8">
        <div className="flex felx-col items-center justify-center">
      
        </div>
        <h1 className="text-4xl font-medium uppercase text-gray-700 text-center mt-6">
          Delivery Services
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 px-4">
        <div className="p-8">
          <div className="bg-indigo-100 text-3xl rounded-full w-16 h-16 flex justify-center items-center text-indigo-500 shadow-2xl">
            <i className="fa-solid fa-circle-check "></i>
          </div>
          <h2 className="uppercase mt-6 text-indigo-500 font-medium mb-3">
            Original Products
          </h2>
          <p className="font-light text-sm text-gray-500 text-justify">
            All products on Glam By Maha are 100% original. We make sure you only
            get original imported products and never deal with fake or knockoff
            products.
          </p>
        </div>

        <div className="p-8">
          <div className="bg-green-100 text-3xl rounded-full w-16 h-16 flex justify-center items-center text-green-500 shadow-2xl">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <h2 className="uppercase mt-6 text-green-500 font-medium mb-3">
            Timely Delivery
          </h2>
          <p className="font-light text-sm text-gray-500 text-justify">
            We ensure timely delivery of all our orders. Once the order is
            placed, we make sure you receive the product within the timeframe
            committed to you.
          </p>
        </div>

        <div className="p-8">
          <div className="bg-red-100 text-3xl rounded-full w-16 h-16 flex justify-center items-center text-red-500 shadow-2xl">
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </div>
          <h2 className="uppercase mt-6 text-red-500 font-medium mb-3 ">
            Easy Return
          </h2>
          <p className="font-light text-sm text-gray-500 text-justify">
            Glam By Maha provides hassle-free Online Cosmatics Skin care and perfumes Shopping in Pakistan. We offer 7 days
            return & exchange policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Deliveryinfo;
