import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const index = () => {
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
  });

  const [categories, setCategories] = useState([]);

  const fetchCatgories = async () => {
    try {
      const { data } = await axios.get("/api/products/category");
      setCategories(data.getcat);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCatgories();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewCategory = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/products/category`, { ...formData });
      if (res.data.success) {
        setFormData("");
        toast.success("Catgory Added Successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/products/category/${id}`);
      if (res.data.success) {
        toast.success("Catgory Deleted Successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <>
      <div className="m-auto my-4 max-w-5xl rounded-lg bg-white p-5">
        <form onSubmit={addNewCategory}>
          <div className=" mb-4 text-2xl font-semibold">
            Add Product{" "}
            <span className=" font-semibold text-indigo-600">Category</span>
          </div>
          <div className=" mt-10 flex flex-wrap items-center gap-4">
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              placeholder="Catgory Name"
              onChange={handleAddressChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 hover:ring-indigo-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className=" mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 font-light text-white transition duration-300 hover:bg-indigo-600"
            >
              <i className="fa fa-plus"></i>
              Add
            </button>
              <p className="text-sm text-red-400 mt-3">{error}</p>
          </div>
        </form>

        <div className=" mt-6 px-2">
          {categories?.map((v, i) => {
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b py-2"
              >
                <h3 className=" text-slate-600">{v.name} </h3>
                <div>
                  <i
                    onClick={() => {
                      window.confirm("Are you sure to delete this Category?") &&
                        deleteCategory(v._id);
                    }}
                    className="fa-solid fa-trash-can cursor-pointer text-sm text-red-400 transition hover:text-red-500"
                  ></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default index;
