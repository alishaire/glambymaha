import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
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
      const user = await axios.post("/api/auth/register", formData, {});
      toast.success("User Register Successfully!");
      router.push("/login");
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
    <>
      <div className="pattren -mb-12 flex flex-col items-center px-6 py-12 lg:px-8">
        <div className="mt-2 w-[350px] rounded-lg bg-white px-6 py-8 md:w-[600px]">
          <div className="mb-2">
            <div className=" flex flex-col items-center gap-4">
              {/* <img src="ulogo.png" alt="Logo Here" className=" w-16  p-2 " /> */}

              <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                <span className="block h-[2px] w-[70%] bg-red-600" />
                <span className="block h-[2px] w-[40%] bg-red-600" />
                <h2 className="text-xl font-bold text-slate-700">
                  Welcome To Glam By Maha
                </h2>
                <p>Register to continue</p>
                <span className="block h-[2px] w-[70%] bg-red-600" />
                <span className="block h-[2px] w-[40%] bg-red-600" />
              </div>
            </div>
          </div>
          <form className="space-y-10 py-6" onSubmit={submitForm}>
            <div className="grid grid-cols-2 gap-6">
              {/* Full name  ---------------- */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm leading-6 text-gray-500"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullname"
                  onChange={routehandler}
                  value={formData.fullname}
                  autoComplete="fullName"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
              {/* Username  ----------------*/}
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
                    autoComplete="username"
                    value={formData.username}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Phone  ----------------*/}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm leading-6 text-gray-500"
                >
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    onChange={routehandler}
                    autoComplete="phone"
                    value={formData.phone}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Email ----------------*/}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm leading-6 text-gray-500"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    onChange={routehandler}
                    value={formData.email}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Password ----------------*/}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm leading-6 text-gray-500"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    onChange={routehandler}
                    value={formData.password}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            {/* button ----------------*/}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-500">
            Already Have an Account /
            <Link
              href="/login"
              className="leading-6 text-red-500 hover:text-red-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
