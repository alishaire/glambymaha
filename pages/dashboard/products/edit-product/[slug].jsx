import axios from "axios";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { Editor } from "@tinymce/tinymce-react";
import { Toaster, toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";

const EditProduct = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    seller: "",
    stock: "",
    avatar: "",
    images: [],
    onSale: "",
    bestSelling: "",
    discountPrice: "",
  });

  const [images, setImages] = useState([]);
  const [tempImgs, setTempImgs] = useState([]);
  const [alreadyExistedImages, setAlreadyExistedImages] = useState([]);

  const router = useRouter();
  const slug = router.query.slug;

  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImagesToCloudinary = async () => {
    const tempImages = [];
    try {
      setLoading(true);
      for (let i = 0; i < images.length; i++) {
        const data = new FormData();
        data.append("file", images[i]);
        data.append("upload_preset", "r6qmrhq9");
        data.append("cloud_name", "dltmv6mfa");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dltmv6mfa/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const jsonRes = await res.json();
        tempImages.push(jsonRes.secure_url);
      }

      setLoading(false);
    } catch (error) {
      alert(error);
    } finally {
      return [...alreadyExistedImages, ...tempImages];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();

      setFormData(data?.singleProduct);

      setTempImgs(data?.singleProduct?.images);
      setAlreadyExistedImages(data?.singleProduct?.images);
    };
    fetchData();
  }, []);

  // Update Product Data ----------------------------------/
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageUrls = await uploadImagesToCloudinary();
      const res = await axios.put(`/api/products/${slug}`, {
        ...formData,
        ...imagePreviews,
        images: imageUrls,
      });
      toast.success("Product Updated Successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show Image on Clinet Side -----------------------------/
  const handleFileInputChange = async (e) => {
    setImages(e.target.files);
    var newImagesObjUrls = Object.keys(e.target.files).map((key, i) => {
      return URL.createObjectURL(e.target.files[key]);
    });
    setTempImgs([...tempImgs, ...newImagesObjUrls]);
  };

  // Remove Specific Image from Client Side ----------------/
  const removeImagePreview = (indexToRemove) => {
    var substateResImgs = [...tempImgs];
    substateResImgs.splice(indexToRemove, 1);
    setTempImgs([...substateResImgs]);

    const updatedImages = [...images];
    updatedImages.splice(indexToRemove, 1);
    setImages(updatedImages);

    const updateImg = [...alreadyExistedImages];
    updateImg.splice(indexToRemove, 1);
    setAlreadyExistedImages(updateImg);
  };

  // Map the Categories --------------------------------/
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

  return (
    <>
      <Toaster />
     <section className="m-auto my-6 max-w-[1050px] ">
       <h1 className="py-4 text-2xl font-extrabold">
          Update
          <span className="ml-2 text-red-500">Product</span>
        </h1>
        <form  className="rounded-lg bg-white px-4 py-6" onSubmit={submitHandler}>
          <div className="grid grid-cols-2 gap-4">
            {/* 1. Name ------------*/}
            <div className="createProductInner">
              <label htmlFor="name" className="text-gray-600 text-sm">Product Name </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData?.name}
                placeholder="Product Name"
                onChange={formDataChangeHandler}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
            {/* 2. Price ------------*/}
            <div className="createProductInner">
              <label htmlFor="price" className="text-gray-600 text-sm">Product Price </label>
              <input
                value={formData?.price}
                onChange={formDataChangeHandler}
                name="price"
                placeholder="Product Price"
                id="Product Price"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
            {/* 2. discountPrice ------------*/}
            <div className="createProductInner">
              <label htmlFor="discountPrice" className="text-gray-600 text-sm">Discounted Price (eg. 10, 20) </label>
              <input
                name="discountPrice"
                id="Product discountPrice"
                value={formData?.discountPrice}
                onChange={formDataChangeHandler}
                placeholder="Product discountPrice"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
          {/* 4.  Categories ------------*/}
          <div className="flex flex-col gap-1">
              <label htmlFor="cate" className="text-gray-600 text-sm">Product Category</label>
              <select
                value={formData.category}
                onChange={formDataChangeHandler}
                id="cate"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
                name="category"
              >
                <option selected value="select Category">
                  Select Category
                </option>
                {categories?.map((v, i) => {
                  return <option value={v.name}> {v.name} </option>;
                })}
              </select>
            </div>
            {/* 4. Seller ------------*/}
            <div className="createProductInner">
              <label htmlFor="seller" className="text-gray-600 text-sm">Product Seller</label>
              <input
                type="text"
                id="seller"
                name="seller"
                value={formData?.seller}
                placeholder="Product Saller Name"
                onChange={formDataChangeHandler}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
            {/* 5. Stock ------------*/}
            <div className="createProductInner">
              <label htmlFor="stock" className="text-gray-600 text-sm">Product Stock</label>
              <input
                value={formData?.stock}
                onChange={formDataChangeHandler}
                name="stock"
                type="text"
                placeholder="Product Stock"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>

          {/* 6. Best Selling ------------------------------------------------ */}
          <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm">Best Selling</label>
            <div className="flex items-center gap-6 h-full">
                <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="bestSelling"
                      name="bestSelling"
                      placeholder="Best Selling"
                      value={formData?.bestSelling}
                      checked={formData?.bestSelling}
                      className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          bestSelling: e.target.checked,
                        }))
                      }
                    />
                    <label id="checkboxLabel" htmlFor="bestSelling" className="text-gray-500 text-sm font-light">
                      Best Selling
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                      id="onSale"
                      type="checkbox"
                      name="onSale"
                      value={formData?.onSale}
                      placeholder="Best Selling"
                      checked={formData?.onSale}
                      className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          onSale: e.target.checked,
                        }))
                      }
                    />
                    <label id="checkboxLabel" htmlFor="onSale" className="text-gray-500 text-sm font-light">
                      On Sale
                    </label>
                </div>
            </div>
            </div>
           
          </div>
          <div className="myFlex">
            {/* 6. Description ------------*/}
            <div className=" mb-6">
              <label
                htmlFor="description"
                className=" text-gray-400 text-sm my-10"
              >
                Product Description
              </label>
              <Editor
                apiKey="z5f7ugf635wz96udas9dzbjlugsi9xxx6oxnnb6aw83hdkdk"
                value={formData?.description}
                onEditorChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo blocks " +
                    "bullist numlist " +
                    "table image removeformat code fullscreen",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                placeholder="helkafsd"
              />
            </div>
            {/* Product Hero Image ------------*/}

            {/* Arry of Images to Show */}
            <div className="createProductInner">
              <label htmlFor="arryOfImages" className="text-gray-600 text-sm">Select Multiple Images</label>
              <input
                multiple
                type="file"
                id="arryOfImages"
                className="remainDiv"
                style={{ color: "#7d879c" }}
                onChange={handleFileInputChange}
              />

              <div className="border grid grid-cols-1 gap-4 items-center p-6 mt-2 rounded-lg lg:grid-cols-4 2xl:grid-cols-4">
                {tempImgs?.map((preview, index) => (
                  <div className="border rounded-lg w-full h-[150px] lg:h-[200px] overflow-hidden relative lg:w-[250]">
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <i
                      onClick={() => removeImagePreview(index)}
                      className="fa-solid fa-xmark absolute top-2 right-2 bg-gray-100 text-gray-500 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all cursor-pointer"
                    ></i>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className=" w-fit mt-3 bg-indigo-500 text-white font-light hover:bg-indigo-600 flex items-center gap-2 px-5 py-2 rounded-lg transition duration-300 cursor-pointer"
            >
              <i className="fa fa-plus"></i>
              {loading ? <Loader /> : "Update Product"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProduct;
