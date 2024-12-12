import axios from "axios";
import { useRouter } from "next/router";
import queryStr from "query-string";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
const tableHeader = [
  { lable: "Name", align: "left" },
  { lable: "Category", align: "left" },
  { lable: "Price", align: "left" },
];

const Dashboard = ({ products, start, end, total, page }) => {
  var pageCount = parseInt(page);
  const { user } = useContext(AuthContext);
  console.log(user)
  const router = useRouter();

  const [statsData, setStatsData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("/api/stats");
    const statDataFetch = await res.data;
    setStatsData(statDataFetch);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    {
      user?.role === "admin" ?<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Dashboard Card 01 -----------*/}
      <div className="globalShadow flex rounded-lg bg-white px-7 py-5">
        <div className=" flex-1">
          <h2 className=" mb-2 text-sm text-slate-600">Products</h2>
          <span className=" text-2xl font-semibold text-slate-800">
            {statsData.products}
          </span>
        </div>
        <div>
          <i className="fa-solid fa-chart-simple rounded-md bg-cyan-200 p-2 text-cyan-700"></i>
        </div>
      </div>
      {/* Dashboard Card 02 -----------*/}
      <div className="globalShadow flex rounded-lg bg-white px-7 py-5">
        <div className=" flex-1">
          <h2 className=" mb-2 text-base text-slate-600">Category</h2>
          <span className=" text-2xl font-semibold text-slate-800">
            {statsData?.category}
          </span>
        </div>
        <div>
          <i className="fa-solid fa-box rounded-md bg-emerald-200 p-2 text-green-700"></i>
        </div>
      </div>
      {/* Dashboard Card 03 -----------*/}
      <div className="globalShadow flex rounded-lg bg-white px-7 py-5">
        <div className=" flex-1">
          <h2 className=" mb-2 text-base text-slate-600">User</h2>
          <span className=" text-2xl font-semibold text-slate-800">
            {statsData?.users}
          </span>
        </div>
        <div>
          <i className="fa-solid fa-user rounded-md bg-fuchsia-200 p-2 text-fuchsia-700"></i>
        </div>
      </div>
      {/* Dashboard Card 04 -----------*/}
      <div className="globalShadow flex rounded-lg bg-white px-7 py-5">
        <div className=" flex-1">
          <h2 className=" mb-2 text-base text-slate-600">Orders</h2>
          <span className=" text-2xl font-semibold text-slate-800">
            {statsData?.orders}
          </span>
        </div>
        <div>
          <i className="fa-solid fa-cart-shopping rounded-md bg-rose-200 p-2 text-rose-700"></i>
        </div>
      </div>
    </div>:""
    }
      

      <main className="grid grid-cols-1 gap-4 px-4 py-0 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-1 mb-4">
        <div className="globalShadow flex rounded-lg bg-white px-0 py-4">
          <div className="w-full overflow-x-auto">
            <div className="p-4">
              <h2 className="text-xl text-slate-700">Recent Sales</h2>
            </div>
            <table className="w-full min-w-[800px] text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700">
                <tr>
                  {tableHeader.map((value) => {
                    return (
                      <th
                        scope="col"
                        className={`px-6 py-3 text-${value.align}`}
                      >
                        {value.lable}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {products?.map((v, i) => {
                  return (
                    <tr key={i} className="border-b border-gray-100 bg-white">
                      <td
                        scope="row"
                        className="flex items-center px-6 py-3 text-gray-600"
                      >
                        <div className="mr-3 h-10 w-10 overflow-hidden">
                          <img
                            className="h-full w-full object-contain"
                            src={v.avatar || v.images[0]}
                            alt="Image Here"
                          />
                        </div>
                        <h2 className=" line-clamp-1 font-normal">
                          {v.name.slice(0, 35) + "..."}
                        </h2>
                      </td>
                      <td className="px-6 py-3"> {v.category} </td>
                      <td className="px-6 py-3"> {v.price} </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Starts ------------------ */}
            <div className=" mt-5 flex w-full items-center justify-end gap-5 pr-14">
              <span className=" flex items-center justify-center whitespace-nowrap text-sm text-slate-500">
                {pageCount} to {end} of {total}
              </span>
              <div className="flex gap-4 rounded-full border px-4 py-1">
                <i
                  onClick={() =>
                    router.push(`/dashboard?page=${pageCount - 1}`)
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
                      router.push(`/dashboard?page=${pageCount + 1}`);
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
       
      </main>
    </>
  );
};

export default Dashboard;

export async function getServerSideProps(props) {
  const queryString = queryStr.stringify(props.query);
  const res = await fetch(
    `https://glambymaha.vercel.app/api/get-all-product?${queryString}`
  );
  const data = await res.json();

  return {
    props: {
      products: data.message.ProductData,
      start: data.message.starting,
      end: data.message.ending,
      total: data.message.TotalProducts,
      page: data?.message?.page,
    },
  };
}
