import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      const loginUser = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("User Logged In");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
    <div className="pattren -mb-12 flex h-full flex-col items-center px-6 py-12 lg:px-8">
      <div className="mt-2 w-[350px] rounded-lg bg-white px-6 py-8 md:w-[600px]">
        <div className="mb-2">
          <div className=" flex flex-col items-center justify-center gap-4">
            {/* <img src="ulogo.png" alt="Logo Here" className=" w-16  p-2 " /> */}

            <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
              <span className="block h-[2px] w-[40%] bg-red-600" />
              <span className="block h-[2px] w-[70%] bg-red-600" />
              <h2 className="text-2xl font-bold text-slate-700">
                Welcome To Glam By Maha
              </h2>
              <span className="block h-[2px] w-[70%] bg-red-600" />
              <span className="block h-[2px] w-[40%] bg-red-600" />
            </div>
          </div>
        </div>

        <form className="space-y-6 py-6" onSubmit={submitForm}>
          {/* Username ----------------------- */}
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
                autocomplete="username"
                value={formData.username}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* Password ----------------------- */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm leading-6 text-gray-500"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={routehandler}
                value={formData.password}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* Button here --------------------- */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              {loading ? "Processing..." : "Log In"}
            </button>
          </div>
        </form>
        {/* accout Info ----------------------- */}
        <p className="text-center text-sm text-gray-500">
          Don't Have an Accout /
          <a
            href="/register"
            className="leading-6 text-red-500 hover:text-red-600"
          >
            {" "}
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}
