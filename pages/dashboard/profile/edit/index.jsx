import Loader from "@/components/Loader";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  
  const { user, refetch } = useContext(AuthContext);

  const [tempImage, setTempImage] = useState(null);
  const [phoneValue, setPhoneValue] = useState();
  useEffect(() => {
    setFormData({ ...formData, phone: phoneValue });
  }, [phoneValue]);
  const routehandler = (e) => {
    console.log(e)
    const name = e.target.name;
    const value = e.target.value;

    if (name === "photo") {
      setTempImage(e.target.files[0]);
      setFormData({ ...formData, photo: e.target.files[0] });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const uploadImageToCloudinary = async () => {
    try {
      const data = new FormData();
      data.append("file", tempImage);
      data.append("upload_preset", "r6qmrhq9");
      data.append("cloud_name", "dltmv6mfa");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dltmv6mfa/image/upload",
        {
          body: data,
          method: "POST",
        }
      );

      const jsonRes = await res.json();

      return jsonRes.secure_url;
    } catch (error) {
      alert("Something wrong! while Uplading images");
    }
  };

  const sumbitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imgUrl = user.photo;
      if (tempImage) {
        imgUrl = await uploadImageToCloudinary();
      }
      const res = await axios.put(`/api/auth/edit`, {
        ...formData,
        photo: imgUrl,
      });
      if (res.data.success) {
        toast.success("User Updated Successfully 😍😎");
      }
      refetch();
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);
  return (
    <>
      <Toaster />
      <form className="max-w-5xl mx-auto mt-4" onSubmit={sumbitHandler}>
        <div className="bg-[#fefefee1] shade rounded-lg px-5 py-6">
          <span className="text-[#333448] text-lg">Basic Informations</span>
          <div className="flex lg:items-center mt-4 gap-6 items-start">
            <div className="w-60">
              {/* PROFILE IMAGE -------- */}
              {tempImage ? (
                <div className="relative group overflow-hidden border rounded-md">
                  <img
                    alt="Image alternate Text"
                    src={URL.createObjectURL(tempImage)}
                    className="h-44 w-full object-cover"
                  />
                  <button
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 group-hover:bottom-0 group-hover:opacity-100 opacity-0 transition-all"
                    onClick={() => setTempImage(null)}
                  >
                    <i className="fa-solid fa-xmark bg-[#00000095] text-white w-screen py-1"></i>
                  </button>
                </div>
              ) : (
                <>
                  {user && user.photo ? (
                    <div className="relative group rounded-md overflow-hidden">
                      <input
                        type="file"
                        id="photo"
                        className="hidden"
                        onChange={(e) => setTempImage(e.target.files[0])}
                      />
                      <label htmlFor="photo">
                        <div>
                          <img
                            className="w-full h-44 object-cover cursor-pointer border border-gray-100 rounded-lg"
                            src={user.photo}
                            alt="Your Image Here"
                          />
                        </div>
                      </label>
                      <label
                        htmlFor="photo"
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 group-hover:bottom-0 group-hover:opacity-100 opacity-0 transition-all cursor-pointer"
                      >
                        <i className="fa-solid fa-camera bg-[#0000007c] text-white w-[200px] py-1 text-center"></i>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group rounded-md overflow-hidden">
                      <input
                        type="file"
                        id="photo"
                        className="hidden"
                        onChange={(e) => setTempImage(e.target.files[0])}
                      />
                      <label htmlFor="photo">
                        <div>
                          <img
                            className="w-full h-44 object-cover cursor-pointer border border-gray-100 rounded-lg"
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt="Your Image Here"
                          />
                        </div>
                      </label>
                      <label
                        htmlFor="photo"
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 group-hover:bottom-0 group-hover:opacity-100 opacity-0 transition-all cursor-pointer"
                      >
                        <i className="fa-solid fa-camera bg-[#0000007c] text-white w-[200px] py-1 text-center"></i>
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
              {/* Full Name */}
              <div className="flex flex-col">
                <label
                  className="text-[#333441d8] text-sm mb-1"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  onChange={routehandler}
                  value={formData?.fullname}
                  className="rounded-lg py-2 border text-[#555] focus:text-[#1553A1] border-gray-300 focus:border-[#1554a177] px-2"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col">
                <label
                  className="text-[#333441d8] text-sm mb-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  onChange={routehandler}
                  value={formData?.username}
                  disabled={user ? user.username : null}
                  className="rounded-lg py-2 border text-gray-400 focus:text-[#1553A1] border-gray-200 focus:border-[#1554a177] cursor-not-allowed select-none px-2"
                />
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <label
                  className="text-[#333441d8] text-sm mb-1"
                  htmlFor="Email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  placeholder="Email"
                  onChange={routehandler}
                  value={formData?.email}
                  className="rounded-lg py-2 border text-[#555] focus:text-[#1553A1] border-gray-300 focus:border-[#1554a177] px-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION  */}
        <div className="bg-[#fefefee1] shade rounded-lg px-5 py-6 mt-6">
          <span className="text-[#333448] text-lg">Contact Informations</span>
          <div className="flex items-center mt-4 gap-6">
            <div className="grid gap-4 grid-cols-2 w-full">
              {/* Phone */}
              <div className="flex flex-col">
                <label
                  className="text-[#333441d8] text-sm mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <PhoneInput
                name="phone"
                placeholder="Phone"
                onChange={setPhoneValue}
                value={formData?.phone}
                className="editphone"
                />
                {/* <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  onChange={routehandler}
                  value={formData?.phone}
                  className="rounded-lg py-2 border text-[#555] focus:text-[#1553A1] border-gray-300 focus:border-[#1554a177] px-2"
                /> */}
              </div>
              {/* Gender */}
              {/* <div className="flex flex-col">
                <label
                  className="text-[hsla(236,12%,23%,1)] text-sm mb-1"
                  htmlFor="gender"
                >
                  Select Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  onChange={routehandler}
                  value={formData?.gender}
                  className="rounded-lg py-2 border text-[#555] focus:text-[#1553A1] border-gray-300 focus:border-[#1554a177] px-2"
                >
                  <option selected value="" disabled>
                    Select
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div> */}
            </div>
          </div>
        </div>

        {/* BUTTON HERE  */}
        <button
          type="submit"
          className=" mt-4 w-fit bg-indigo-500 text-white font-light hover:bg-indigo-600 flex items-center gap-2 px-5 py-2 rounded-full transition duration-300 cursor-pointer"
        >
          <i className="fa fa-plus"></i>
          {loading ? <Loader /> : "Save"}
        </button>
      </form>
    </>
  );
};

export default EditProfile;
