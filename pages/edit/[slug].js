import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";

const SingleProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sale: "",
    description: "",
    price: "",
    category: "",
    seller: "",
    stock: "",
    avatar: "",
    images: [],
  });

  const router = useRouter();
  const slug = router.query.slug;
  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cloudinary States
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
          }
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      setFormData(data?.singleProduct);
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageUrls = await uploadImagesToCloudinary();
      const res = await axios.put(`/api/products/${slug}`, {
        ...formData,
        images: imageUrls,
      });
      toast.success("Product Updated Successfully!");
      router.push("/dashboard");
      //   setTempImage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <section className="createProductOuter">
        <h1>Update Product</h1>
        <form onSubmit={submitHandler}>
          <div className="createProductMain">
            {/* 1. Name ------------*/}
            <div className="createProductInner">
              <label htmlFor="name">Product Name</label>
              <input
                value={formData.name}
                onChange={formDataChangeHandler}
                type="text"
                id="name"
                name="name"
                placeholder="Product Name"
              />
            </div>
            {/* 2. Sale ------------*/}
            <div className="createProductInner">
              <label htmlFor="sale">Product Sale </label>
              <input
                value={formData.sale}
                onChange={formDataChangeHandler}
                type="text"
                name="sale"
                id="sale"
                placeholder="Product Sale"
              />
            </div>
            {/* 3. Price ------------*/}
            <div className="createProductInner">
              <label htmlFor="price">Product Price: </label>
              <input
                value={formData.price}
                onChange={formDataChangeHandler}
                type="number"
                name="price"
                placeholder="Product Price"
                id="Product Price"
              />
            </div>
            {/* 4.  Categories ------------*/}
            <div className="createProductInner">
              <label htmlFor="cate">Product Category</label>
              <select
                value={formData.category}
                onChange={formDataChangeHandler}
                className="remainDiv"
                id="cate"
                name="category"
              >
                <option disabled selected value="select Category">
                  Select Category
                </option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            {/* 5. Seller ------------*/}
            <div className="createProductInner">
              <label htmlFor="seller">Product Seller</label>
              <input
                value={formData.seller}
                onChange={formDataChangeHandler}
                id="seller"
                name="seller"
                type="text"
                placeholder="Product Saller Name"
              />
            </div>
            {/* 6. Stock ------------*/}
            <div className="createProductInner">
              <label htmlFor="stock">Product Stock:</label>
              <input
                value={formData.stock}
                onChange={formDataChangeHandler}
                name="stock"
                type="text"
                placeholder="Product Stock"
              />
            </div>
          </div>
          <div className="flex flex-col">
            {/* 7. Description ------------*/}
            <div className="createProductInner my-2">
              <label htmlFor="desc">Product Description</label>
              <textarea
                value={formData.description}
                onChange={formDataChangeHandler}
                name="description"
                className="remainDiv diffInput"
                id="desc"
                cols="50"
                rows="5"
                placeholder="Please provide any details"
              ></textarea>
            </div>
            {/* Product Hero Image ------------*/}
            <div className="createProductInner my-2">
              <label htmlFor="avatarInput">Product Fetured Image</label>
              <input
                style={{ color: "#7d879c" }}
                className="remainDiv"
                id="avatarInput"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, bannerImg: e.target.files[0] })
                }
              />
            </div>

            {/* Arry of Images to Show */}
            <div className="createProductInner my-2">
              <label htmlFor="arryOfImages">Select Multiple Images</label>
              <input
                style={{ color: "#7d879c" }}
                className="remainDiv"
                id="arryOfImages"
                type="file"
                onChange={(e) => setTempImage(e.target.files)}
                multiple
              />
            </div>

            <button className="createBtn">
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SingleProduct;
