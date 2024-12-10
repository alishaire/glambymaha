import axios from "axios";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Toaster, toast } from "react-hot-toast";

const CreateProduct = () => {
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


  // for sales logic start here ----------------------------------------------------/
  const formDataChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // for sales logic Ends here ----------------------------------------------------/
  // Cloudinary States Fucnton -------------------------/
  const [tempImage, setTempImage] = useState("");
  const uploadImagesToCloudinary = async () => {
    try {
      const imageUrls = [];

      for (const file of tempImage) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "r6qmrhq9");
        data.append("cloud_name", "dltmv6mfa");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dltmv6mfa/image/upload",
          {
            body: data,
            method: "POST",
          },
        );

        const jsonRes = await res.json();
        imageUrls.push(jsonRes.secure_url);
      }

      return imageUrls;
    } catch (error) {
      alert("Something went wrong while uploading images");
      return [];
    }
  };

  // Add New Product -----------------------------------/
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageUrls = await uploadImagesToCloudinary();
      const res = await axios.post("/api/products", {
        ...formData,
        images: imageUrls,
      });
      toast.success("Product Added Successfully!");
      setFormData({
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
      images: [],
      setImagePreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Show Image on Clinet Side -------------------------/
  const handleImageChange = (e) => {
    const files = e.target.files;
    const previews = [];
    const tempImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(files[i]);

      // Push the files to tempImages array
      tempImages.push(files[i]);
    }

    // Update the tempImage state with the new array of files
    setTempImage(tempImages);
  };

  // Remove Specific Image from Client Side ------------/
  const removeImagePreview = (indexToRemove) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove),
    );
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
    <div>
      <Toaster />
      <section className="m-auto my-6 max-w-[1050px] ">
        <h1 className="py-4 text-2xl font-extrabold">
          Create
          <span className="ml-2 text-red-500">Product</span>
        </h1>
        <form
          onSubmit={submitHandler}
          className="rounded-lg bg-white px-4  py-6 "
        >
          <div className="grid grid-cols-2 gap-4 ">
            {/* 1. Name ------------------------ */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-600 text-sm">Product Name</label>
              <input
                value={formData.name}
                onChange={formDataChangeHandler}
                type="text"
                id="name"
                name="name"
                placeholder="Product Name"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
            {/* 3. Price ------------------------ */}
            <div className="flex flex-col gap-1">
              <label htmlFor="price" className="text-gray-600 text-sm">Product Price </label>
              <input
                name="price"
                id="Product Price"
                value={formData.price}
                 className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
                placeholder="Product Price"
                onChange={formDataChangeHandler}
              />
            </div>
            {/* 3. discountPrice ------------------------ */}
            <div className="flex flex-col gap-1">
              <label htmlFor="discountPrice" className="text-gray-600 text-sm">Discounted Price</label>
              <input
                name="discountPrice"
                id="Product discountPrice"
                value={formData.discountPrice}
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
            {/* 5. Seller ------------------------ */}
            <div className="flex flex-col gap-1">
              <label htmlFor="seller" className="text-gray-600 text-sm">Product Seller</label>
              <input
                id="seller"
                type="text"
                name="seller"
                value={formData.seller}
                onChange={formDataChangeHandler}
                placeholder="Product Saller Name"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
              />
            </div>
            {/* 6. Stock ------------------------------------------------ */}
            <div className="flex flex-col gap-1">
              <label htmlFor="stock" className="text-gray-600 text-sm">Product Stock</label>
              <input
                type="text"
                name="stock"
                value={formData.stock}
                checked={formData.bestSelling}
                placeholder="Product Stock"
                 className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 hover:ring-red-300"
                onChange={formDataChangeHandler}
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
                      value={formData.bestSelling}
                      className="rounded-sm"
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
                      type="checkbox"
                      id="onSale"
                      name="onSale"
                      placeholder="Best Selling"
                      value={formData.onSale}
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

            {/* 7. Description --------------------------------------- */}
          <div>
            {/* Editor for Desription --------------------------------- */}
            <div className=" my-6 flex h-72  flex-col gap-2">
              <label htmlFor="description">Product Description</label>
              <Editor
                apiKey="z5f7ugf635wz96udas9dzbjlugsi9xxx6oxnnb6aw83hdkdk"
                value={formData.description}
                onEditorChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                init={{
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

            {/* Product Hero Image ------------------------------------ */}

            {/* Arry of Images to Show ---------------------------------- */}
            <div className="flex flex-col gap-6 py-4">
              <label htmlFor="arryOfImages">Select Multiple Images</label>
              <input
                multiple
                type="file"
                id="arryOfImages"
                className="remainDiv border rounded-lg p-2 cursor-pointer file:mr-4 file:rounded-full
                file:border-0 file:bg-violet-100
                file:px-4 file:py-2
                file:text-sm file:font-semibold
                file:text-violet-700 hover:file:bg-violet-200"
                onChange={handleImageChange}
              />
              {imagePreviews.length == 0 ? null : (
                <div className="mt-2 grid grid-cols-4 items-center gap-4 rounded-lg border p-6">
                  {imagePreviews.map((preview, index) => (
                    <div className="relative h-[320px] w-[270px] overflow-hidden rounded-lg border">
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <i
                        onClick={() => removeImagePreview(index)}
                        className="fa-solid fa-xmark absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200"
                      ></i>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className=" flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 font-light text-white transition duration-300 hover:bg-indigo-600"
              >
                <i className="fa fa-plus"></i>
                {loading ? <Loader /> : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateProduct;
