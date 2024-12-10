import { CartContext } from "@/context/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "react-hot-toast";

const ProductCard = ({ data, index }) => {
  const { addToCart, setShowCartState } = useContext(CartContext);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discountPercentage) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  return (
    <div
      key={index}
      className="group group relative overflow-hidden rounded-lg bg-[#fff] "
    >
      <div className="absolute  right-0 top-2 z-[5] flex w-full translate-x-14 flex-col items-end  gap-2 transition-all duration-500 group-hover:translate-x-0">
        <i
          onClick={() => {
            addToCart(data);
            setShowCartState(true);
            toast.success("Added to Cart Successfully!");
          }}
          className="fa-solid fa-cart-plus cursor-pointer rounded bg-gray-200/50 px-4 py-2 text-lg text-slate-500 shadow-md hover:text-slate-600 "
        ></i>
        <Link href={`/product/${data.slug}`}>
          <i className="fa-solid fa-eye  cursor-pointer rounded bg-gray-200/50  px-4 py-2 text-lg text-slate-500 shadow-md hover:text-slate-600 "></i>
        </Link>
      </div>

      <div className=" absolute left-0 top-2 z-[2]">
        {data?.onSale ? (
          <span className="rounded-r-lg bg-red-400 px-4 py-1 text-sm text-white">
            Sale
          </span>
        ) : null}
      </div>

      <div className="h-[270px] w-full overflow-hidden rounded-md bg-gray-50 bg-transparent px-4 pt-4">
        <Link href={`/product/${data.slug}`} className="relative">
          <Image
            height={400}
            width={400}
            priority="true"
            alt="image here"
            src={data.images[index] || data.images[0]}
            className="h-full w-full rounded-lg object-contain object-center transition-all duration-300"
          />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2   items-end justify-center gap-6 py-2">
            {/* <Image
              width={700}
              height={700}
              alt="watermark"
              src="/watermark.png"
              className="h-48 w-48 object-cover invert"
            /> */}
          </div>
        </Link>
      </div>

      <div className="px-4 py-4 ">
        <Link
          href={`/product/${data.slug}`}
          className="mb-2 line-clamp-1 text-lg font-medium text-slate-700 transition-all duration-300 hover:text-red-700"
        >
          {data.name}
        </Link>

        <div>
          <p className="mb-2 text-[18px]  font-medium text-red-500">
            Rs {parseInt(data.price).toLocaleString()}
          </p>
          {data.discountPrice ? (
            <div className=" flex items-center gap-3 text-sm">
              <p className="text-md font-light text-gray-500 line-through decoration-red-500">
                {calculateDiscountedPrice(
                  data.price,
                  data.discountPrice,
                ).toLocaleString()}
              </p>
              <span className="text-md font-medium text-gray-500">
                - {data.discountPrice} % Off
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
