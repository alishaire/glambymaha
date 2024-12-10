import axios from "axios";
import { Rating } from "primereact/rating";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CartContext } from "@/context/CartProvider";
import Image from "next/image";
import BestSlelling from "@/components/Home/BestSelling";
import { AuthContext } from "@/context/AuthContext";

const SingleProduct = ({ data, products2 }) => {
  const {user} = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [totalPrice, setTotalPrice] = useState(data.singleProduct.price);
  const [activeImage, setActiveImage] = useState(data.singleProduct.images[0]);
  const { addToCart } = useContext(CartContext);

  const changeMainImage = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const updateTotalPrice = () => {
    const newTotalPrice = data.singleProduct.price * value;
    setTotalPrice(newTotalPrice);
  };

  useEffect(() => {
    updateTotalPrice();
  }, [value]);

  // REVIEWS SYSTEMS HERE ======================================/
  const [reviewData, setReviewData] = useState({
    costomerName: "",
    NoOfreviews: "",
    comment: "",
    createdAt: "",
  });

  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(0);
  const [newReviews, setNewReviews] = useState([...data.singleProduct.reviews]);

  // input handler =============================================/
  const inputHandler = (e) => {
    const { value, name } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const onStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // Reviews on Sumbit =========================================/
  const submitReview = async (e) => {
    e.preventDefault();

    try {

      if(user){
        return alert.error("Login First to Post Review")
      }

      setLoading(true);
      const res = await axios.put(
        `/api/products/${data.singleProduct.slug}?reviews=POST`,
        { ...reviewData, NoOfreviews: rating },
      );
      const updatedReview = res.data;

      setNewReviews([...newReviews, updatedReview]);

      toast.success("Review Added Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      setReviewData({
        costomerName: "",
        NoOfreviews: "",
        comment: "",
        createdAt: "",
      });
      setRating(0);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

   // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercentage) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  return (
    <>
      {/* Single PAGE HERE ---------------------------------- */}
      <div className="m-auto my-4 flex max-w-[1250px] justify-around bg-[#f9f9f9] py-8">
        <div className="max-w-[40%] pb-6">
          <div className="mb-4">
            <Image
              width={700}
              height={700}
              src={activeImage}
              alt="product Image here"
              className="aspect-[3/2] h-full w-full rounded-md object-contain border hover:bg-gray-100"
            />
          </div>

          <div className="h-36 w-full">
            {data.singleProduct.images.length >= 4 ? (
              <Swiper
                className="h-full w-full"
                slidesPerView={3}
                spaceBetween={30}
                // pagination={{
                //   clickable: true,
                // }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Navigation, Pagination]}
              >
                {data.singleProduct.images.map((v, i) => {
                  return (
                    <SwiperSlide>
                      <Image
                        width={700}
                        height={700}
                        key={i}
                        src={v}
                        alt="product Images"
                        onClick={() => changeMainImage(v)}
                        className={`h-full w-full rounded-md border object-cover p-2 transition-all cursor-pointer ${
                          v === activeImage ? "border-2 border-red-400" : "hover:scale-105 hover:bg-red-50"
                        }`}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="grid h-full w-full grid-cols-3">
                {data.singleProduct.images.map((v, i) => {
                  return (
                    <Image
                    key={i}
                    src={v}
                    width={700}
                    height={700}
                      alt="product Images"
                      onClick={() => changeMainImage(v)}
                      className={`h-full w-full rounded-md p-2 ${
                        v === activeImage ? "" : "hover:scale-105"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 max-md:w-full">
          <div className="col-right-info">
            <h2 className="inline-block rounded-lg bg-red-500/10 px-4 py-0.5 text-xs font-light text-red-500 lg:text-sm">
              {data.singleProduct.category}
            </h2>
            {data.singleProduct.bestSelling ? (
              <h2 className="ml-3 inline-block rounded-lg bg-green-500/10 px-4 py-0.5 text-xs font-light text-green-500 lg:text-sm">
                Best Selling
              </h2>
            ) : null}
            <h1 className=" my-3 text-xl leading-[1.4] font-semibold text-slate-700 lg:text-[28px]">
              {data.singleProduct.name}
            </h1>
            <div className="flex items-center gap-3 text-sm">
            <span className=" line-clamp-1 text-sm font-medium text-gray-700 lg:text-xl">
              Rs.
              {parseInt(data.singleProduct.price).toLocaleString()}
            </span>
            {data.singleProduct.discountPrice ?
         <>
         <p className="text-md text-gray-500 font-light line-through decoration-red-500">
         {calculateDiscountedPrice(data.singleProduct.price, data.singleProduct.discountPrice).toLocaleString()}
          </p>
          <span className="text-md font-medium text-gray-500">
          - {data.singleProduct.discountPrice} % Off
          </span>
          </>
            :null}
         </div>
            <main
              dangerouslySetInnerHTML={{
                __html: data.singleProduct.description.slice(0, 400) + "...",
              }}
              className="mb-8 mt-4 text-justify text-[13px] text-gray-500 lg:text-sm"
            ></main>

            <div className=" my-4 flex items-center gap-4">
              <div className="flex justify-between">
               
                <button
                  className="rounded-full border bg-slate-600 px-2 text-white"
                  disabled={value === 1}
                  onClick={() => {
                    if (value > 0) {
                      setValue(value - 1);
                      updateTotalPrice();
                    }
                  }}
                >
                  <i className="fa-solid fa-minus text-sm" />
                </button>

                <span className="w-[4ch] text-center text-xl text-gray-500">
                  {value}
                </span>

                <button
                  className="rounded-full border bg-slate-600 px-2 text-white"
                  disabled={value === 9}
                  onClick={() => {
                    if (value < 9) {
                      setValue(value + 1);
                      updateTotalPrice();
                    }
                  }}
                >
                  <i className="fa-solid fa-plus  text-xs " />
                </button>

              </div>

              <button
                onClick={() => {
                  addToCart(data.singleProduct);
                  toast.success("Add To Cart Successfully 😍");
                }}
                className="rounded-md bg-[#f05353c4] px-8 py-3 text-sm text-white hover:bg-slate-800 lg:px-10 lg:py-4"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Descripton and Commnet main Div ----------------------------- */}
      <div className="m-auto max-w-[1250px] rounded-lg bg-[#f9f9f9] px-4">
        {/* Desciropiton here--------------------------------- */}
        <div className="rounded-lg  p-4">
          <h2 className="border-b pb-2 text-lg font-semibold text-gray-700">
            Description
          </h2>
          <main
            dangerouslySetInnerHTML={{
              __html: data.singleProduct.description,
            }}
            className="mb-8 mt-4 px-3 text-justify text-[13px] text-gray-500 lg:text-sm"
          ></main>
        </div>

        {/* Comment & Post Form Here main Div ----------------- */}
        <div className="m-auto my-4 flex max-w-[1480px] flex-col items-center gap-4 lg:grid lg:grid-cols-3">
          {/* Comment System Here ------------------------------ */}
          <div className="my-8 min-h-[380px] w-full overflow-hidden rounded-lg bg-[#f9f9f9] lg:col-span-2">
            <div className="px-4 py-10 lg:px-8 lg:py-20">
              <h1 className="mb-4 text-xl font-semibold text-sky-700">
                Reviews
              </h1>
              {newReviews.length > 0 ? (
                <Swiper
                  slidesPerView={2}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay, Navigation, Pagination]}
                >
                  {newReviews.map((v, i) => {
                    return (
                      <SwiperSlide
                        key={i}
                        className="my-10 rounded-lg border bg-white p-6 shadow-sm sm:p-8"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            alt="Man"
                            src="https://static.priceoye.pk/images/user-icon.svg"
                            className="h-12 w-12 rounded-full border object-cover"
                          />
                          <div>
                            <p className="mb-1 mt-0.5 text-sm font-medium text-gray-900">
                              {v.costomerName}
                            </p>
                            <div className="flex gap-0.5 text-xs text-[#F44335]">
                              <Rating
                                readOnly
                                cancel={false}
                                value={v.NoOfreviews}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 line-clamp-2 text-xs text-gray-700">
                          {v.comment}
                        </p>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <h1>Comment Not Posted Yet</h1>
              )}
            </div>

            {/* REVIEW FORM HERE ---------------- */}
          </div>
          {/* post Comment Form -------------------------------- */}
          <div className="flex w-full items-center justify-center rounded-lg bg-[#fff] lg:col-span-1">
            <form
              onSubmit={submitReview}
              className="m-auto mx-6 my-7 h-fit w-full rounded-lg"
            >
              <h1 className="mb-4 text-lg font-semibold text-red-600">
                Submit Your Review
              </h1>
              {/* Name */}
              <div className="">
                <input
                  required
                  id="name"
                  name="costomerName"
                  placeholder="Your Name"
                  onChange={inputHandler}
                  value={reviewData.costomerName}
                  className="block w-full rounded-md border-0 py-1.5 outline-none ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 hover:ring-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
              </div>

              {/* Ratings ---------------- */}
              <div className="my-3">
                {/* NoOfreviews -----------*/}
                <div className="flex flex-col">
                  <label
                    htmlFor="NoOfReviews"
                    className="mb-2 text-sm font-medium text-gray-500"
                  >
                    Your Ratings
                  </label>
                  <input
                    min="1"
                    max="5"
                    required
                    type="number"
                    value={rating}
                    id="NoOfReviews"
                    className="hidden"
                    name="NoOfreviews"
                    onChange={inputHandler}
                    placeholder="Stars Ratings"
                  />
                </div>
                <div className="mb-4">
                  {[...Array(5)]?.map((star, index) => {
                    const currentRating = index + 1;

                    return (
                      <label key={index}>
                        <FaStar
                          className="fa-regular fa-star cursor-pointer"
                          size={20}
                          color={
                            currentRating <= (hover || rating)
                              ? "rgb(230, 67, 47)"
                              : "#c8c8c8"
                          }
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => onStarClick(currentRating)}
                        />
                        <input
                          type="radio"
                          className="hidden"
                          name="NoOfreviews"
                          value={currentRating}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
              {/* Comment -------------*/}
              <div className="reviewtextarea reviewsInput">
                <label
                  className="mb-2 text-sm font-medium text-gray-500"
                  htmlFor="comment"
                >
                  Your Comment
                </label>
                <textarea
                  required
                  rows="3"
                  cols="30"
                  id="comment"
                  name="comment"
                  onChange={inputHandler}
                  placeholder="Write Comment"
                  value={reviewData.comment}
                  className="block w-full rounded-md border-0 py-1.5 outline-none ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 hover:ring-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                ></textarea>
              </div>

              <div className="my-2 mt-4">
                <button
                  type="submit"
                  className=" w-full rounded-md bg-gradient-to-tr from-red-500 to-red-400 py-1 text-white  hover:bg-gradient-to-br"
                >
                  {loading ? "Loading..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Payment and Aditional Fetarures ------------------------------ */}
      <div className="m-auto grid max-w-[1250px] grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
        {/* Progress Bars for Rating ------------ */}
        <div className="rounded-lg bg-[#f9f9f9] p-4">
          <h1 className=" font-semibold text-gray-700">Hair System Rating</h1>
          <div className=" mt-3 flex items-center justify-between gap-3">
            <h2 className="text-sm text-gray-600">Comfort</h2>
            <div className="progress">
              <div className="bar full-90">
                <p className="percent text-gray-500">90%</p>
              </div>
            </div>
          </div>
          <div className=" mt-2 flex items-center justify-between gap-3">
            <h2 className="text-sm text-gray-600">Front Appearance</h2>
            <div className="progress">
              <div className="bar full-85">
                <p className="percent text-gray-500">85%</p>
              </div>
            </div>
          </div>
          <div className=" mt-2 flex items-center justify-between gap-3">
            <h2 className="text-sm text-gray-600">Top Appearance</h2>
            <div className="progress">
              <div className="bar full-85-2">
                <p className="percent text-gray-500">85%</p>
              </div>
            </div>
          </div>
          <div className=" mt-2 flex items-center justify-between gap-3">
            <h2 className="text-sm text-gray-600">Durability</h2>
            <div className="progress">
              <div className="bar full-70">
                <p className="percent text-gray-500">70%</p>
              </div>
            </div>
          </div>
        </div>
        {/* Delivery Details -------------------- */}
        <div className="rounded-lg bg-[#f9f9f9] p-4">
          <h1 className=" mb-2 font-semibold text-gray-700">Delivery</h1>
          <div>
            <h2 className="mb-1 text-sm text-gray-600">Free Shipping</h2>
            <p className=" mb-2 text-sm font-light text-gray-500">
              From Glam By Maha to Punjab, City - Faisalabad via Glam By Maha
              Standard
            </p>
            <h2 className="mb-1 text-sm text-gray-600">
              Shipping Estimated delivery:
            </h2>
            <p className=" text-sm font-light text-gray-500">
              3-5 working days
            </p>
          </div>
        </div>
        {/* Payment Shipping -------------------- */}
        <div className="rounded-lg bg-[#f9f9f9] p-4">
          <h1 className=" mb-4 font-semibold text-gray-700">Payment</h1>
          <div className="my-0 flex items-center justify-between">
            <h2 className="mb-1 text-sm text-gray-600">Debit/Credit Card</h2>
            <img
              alt="image here"
              className=" w-20"
              src="https://www.freepnglogos.com/uploads/visa-and-mastercard-logo-26.png"
            />
          </div>
          <div className="my-3 flex items-center justify-between">
            <h2 className="mb-1 text-sm text-gray-600">JazzCash</h2>
            <img
              alt="image here"
              className=" w-20"
              src="https://images.halohair.pk/uploads/jazzcash_logo.png"
            />
          </div>
          <div className="my-0 flex items-center justify-between">
            <h2 className="mb-1 text-sm text-gray-600">Easypaisa</h2>
            <img
              alt="image here"
              className=" w-20"
              src="https://images.halohair.pk/uploads/easypaisa_logo.png"
            />
          </div>
        </div>
      </div>

      {/* best selling */}
      <BestSlelling props={products2} />
    </>
  );
};

export default SingleProduct;

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const res = await fetch(
    `https://u-shop-liart.vercel.app/api/products/${slug}`,
  );
  const data = await res.json();

  const fetchData = await fetch(
    `https://u-shop-liart.vercel.app/api/get-all-product?bestSelling=true`,
  );
  const jsonData = await fetchData.json();

  return { props: { data, products2: jsonData?.message?.ProductData } };
}
