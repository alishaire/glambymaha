import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import { CartContext } from "@/context/CartProvider";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";

export default function Categories(props) {
  const { addToCart, setShowCartState } = useContext(CartContext);
  const [showForm, setShowForm] = useState(false);
  const [filterByName, setFilterByName] = useState({ name: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
 
  // Minimum price range --------------------------------------------------------/
  const [minPrice, setMinPrice] = useState("");
  // Maximum price range --------------------------------------------------------/
  const [maxPrice, setMaxPrice] = useState("");

  const router = useRouter();
  const { query } = router.query;

  const [productData, setProductData] = useState(
    props.data.message.ProductData,
  );

  const handleCategoryChange = (categoryName) => {

    // Construct the new query with the selected category
    const query = `?query=${categoryName}`;

    // Update the URL query parameter
    router.push(`/categories${query}`);
  };

  // Input OnChange Function -----------------------------------------------------/
  const searchInputHandler = (e) => {
    setFilterByName({ ...filterByName, [e.target.name]: e.target.value });
  };

  // Fetch Data Basis Filter by Name Function ------------------------------------/
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(
        `/api/get-all-product?limitLess=true&category=${query}`,
        {
          params: { name: filterByName.name },
        },
      );

      setProductData(data?.message?.ProductData);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Fetch data on Every Render  -------------------------------------------------/
  useEffect(() => {
    fetchProductData();
  }, [filterByName.name]);

  // Filter Data On Filteration --------------------------------------------------/
  const filteredProducts = selectedCategories.length
    ? productData.filter((product) =>
        selectedCategories.includes(product.category),
      )
    : productData;

  // Filter by Price Range --------------------------------------------------------/
  const filteredProductsByPrice = filteredProducts?.filter((product) => {
    if (!minPrice && !maxPrice) return true; // If both min and max prices are empty, show all products
    const min = parseFloat(minPrice) || 0; // If minPrice is empty, set it to 0
    const max = parseFloat(maxPrice) || Infinity; // If maxPrice is empty, set it to Infinity
    return product.price >= min && product.price <= max;
  });

  // Fetch Categories
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/products/category");
      setCategories(data.getcat);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [query]);

  return (
    <>
      <Toaster />

      <Head>
        <title>Shop Now: Explore Exclusive Deals & Products</title>
        <meta
          name="description"
          content="U-Shop is your one-stop destination for great finds. Browse our vast collection, find exclusive deals, and shop for quality products."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="">
        <main className="m-auto mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className=" flex flex-col items-center justify-between py-8 pb-6 md:flex-row">
            <h1 className="text-4xl font-bold tracking-wide text-gray-700">
              All Products
            </h1>
            <div className="relative">
              <input
                style={{
                  transition: ".4s",
                  opacity: showForm ? "1" : "0",
                  visibility: showForm ? "visible" : "hidden",
                }}
                name="name"
                placeholder="Search here"
                value={filterByName.name}
                onChange={searchInputHandler}
                className="w-[240px] rounded-full border border-red-400 px-3 py-1 font-light text-gray-600 outline-none ring-red-500 placeholder:text-gray-400 hover:ring-1 focus:border-none focus:ring-2 focus:ring-red-400"
              />
              <i
                onClick={() => setShowForm(true)}
                className="fa-solid fa-magnifying-glass text-md absolute right-2 top-1/2 -translate-y-1/2 animate-pulse cursor-pointer text-red-400 transition-all duration-300 hover:text-red-600"
              ></i>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* ------------ Aside filtetion aside Div ----------------------------------- */}
            <aside
            className={`sticky top-[4.7rem] bg-white h-fit overflow-hidden rounded-lg p-2 shadow-[0px_0px_8px_lightgray]`}
            >
              {/* ------------ Category filtetion ----------------------------------- */}
              <div className="mb-3 border-b">
                <h2 className="my-2 px-2 text-xl font-medium tracking-wider text-red-500">
                  Filter Products
                </h2>

                {/* <span className="px-2 text-base font-medium text-slate-600">
                  Category
                </span> */}

                <div className=" my-2">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <Link
                        href={`/categories?query=${category.name}`}
                        className="flex items-center gap-3 px-4 py-1.5"
                      >
                        <input
                          type="radio"
                          id={category.name}
                          name={category.name}
                          onChange={handleCategoryChange}
                          checked={query == category.name}
                          className="border-gray-300 text-red-500 peer"
                        />
                        <label
                          htmlFor={category.name}
                          className="cursor-pointer text-sm text-gray-500 peer-checked:text-red-500 peer-checked:font-semibold"
                        >
                          {category.name}
                        </label>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              {/* ------------ Pricing filtetion ----------------------------------- */}
              <div className="mb-3 border-b pb-3">
                <span className="my-4 mb-3 px-2 text-base font-medium text-slate-600">
                  Pricing
                </span>

                <div className=" m-2 flex items-center gap-2">
                  <div className="">
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      value={minPrice}
                      placeholder="Min"
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-[70px] min-w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-500 outline-none placeholder:text-gray-400 focus:text-gray-600 focus:ring-1"
                    />
                  </div>
                  <div className="">
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      value={maxPrice}
                      placeholder="Max"
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-[70px] min-w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-500 outline-none placeholder:text-gray-400 focus:text-gray-600 focus:ring-1"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* ------------ Products Grid Here ----------------------------------- */}

            <div className="grid bg-white h-full flex-1 grid-cols-1 gap-2 rounded-lg border-4 border-red-300/10 bg-slate-100/30 p-4 shadow-[0px_0px_8px_lightgray] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProductsByPrice?.length == 0 ? (
                <h1 className="my-10 whitespace-nowrap text-gray-500">
                  Oops! Products Not Found.
                </h1>
              ) : (
                filteredProductsByPrice?.map((v, i) => (
                  <ProductCard data={v} index={i} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Fetch All Product Data Api ------------------------------------------------------/
export async function getServerSideProps() {
  const response = await fetch(
    "http://localhost:3000/api/get-all-product",
  );
  const data = await response.json();

  return { props: { data } };
}
