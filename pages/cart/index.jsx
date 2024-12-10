import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartProvider";
import Link from "next/link";
import Image from "next/image";

const ShoppingCart = () => {
  // const router = useRouter();
  // const [value, setValue] = useState(1);

  const {
    cartItems,
    addToCart,
    clearCart,
    decreaseItemQuantity,
    RemoveSpecificItemFromCart,
  } = useContext(CartContext);
  const cartLength = cartItems.length;

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = item.price
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
      : 0;
    return total + itemPrice * item.quantity;
  }, 0);

  return (
    <>
      <div className="max-w-[1250px] rounded-lg border bg-white p-4 md:m-5 2xl:m-auto 2xl:my-12">
        <h2 className="mb-6 mt-4 text-3xl font-bold text-slate-700">
          Shopping Cart
        </h2>

        <div className="flex flex-col items-center justify-center gap-6 md:flex-col md:items-start lg:flex-row lg:items-start">
          <div className="md:w-full lg:w-[70%]">
            {cartLength == 0 ? (
              <div className="my-2 flex flex-col items-center">
                <Image
                  height={200}
                  width={200}
                  alt="empty cart image here"
                  className="w-48 select-none"
                  src="https://img.freepik.com/premium-vector/shopping-cart-with-cross-mark-wireless-paymant-icon-shopping-bag-failure-paymant-sign-online-shopping-vector_662353-912.jpg"
                />
                <h1 className="mb-4 font-light text-slate-600">
                  Shoping Cart Empty
                </h1>
                <Link
                  href="/categories"
                  className="flex w-fit items-center gap-3 rounded-full border bg-red-600 px-5 py-3 text-white transition-all hover:border-red-300 hover:text-red-400"
                >
                  <i className="fa-solid fa-angle-left asideAnimate text-sm"></i>{" "}
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {cartItems.map((v, i) => {
                  return (
                    <div className="grid grid-cols-7 place-content-center items-center border border-b-slate-200 md:my-3 md:pb-4 lg:grid-cols-6 lg:items-center lg:justify-center">
                      <div className="col-span-4 flex items-center gap-4">
                        <Image
                          height={200}
                          width={200}
                          alt="image here"
                          src={v.images[i] || v.images[0] || v.avatar}
                          className="h-auto w-24 object-cover md:w-32 lg:w-24"
                        />

                        <div>
                          <h2 className="line-clamp-1 font-medium text-slate-800">
                            {v.name}
                          </h2>
                          <div className="mt-3 flex flex-col gap-2">
                            <span className="font-normal text-slate-950">
                              Rs {parseInt(v.price).toLocaleString()}
                            </span>
                            <div>
                              <span className="rounded-md border-2 border-red-600/60  px-2 py-1  text-xs font-light text-slate-600">
                                {v.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="my-4 flex items-center justify-center md:mt-4 lg:items-end">
                        <div className="w-fit rounded-full border px-4 py-1">
                          <button
                            className=" text-sm text-slate-500 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-100"
                            onClick={() => {
                              decreaseItemQuantity(cartItems[i]);
                            }}
                          >
                            -
                          </button>
                          <span className="px-2 text-slate-600">
                            {cartItems[i].quantity}
                          </span>
                          <button
                            className="text-sm text-slate-500 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-100"
                            onClick={() => addToCart(v)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="my-4 grid md:mt-4 lg:items-end">
                        <button
                          className="rounded text-sm text-slate-500 hover:text-slate-700 lg:px-2"
                          onClick={() => RemoveSpecificItemFromCart(v._id)}
                        >
                          <i className="fa-solid fa-x"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {cartLength <= 0 ? null : (
              <div className="my-2 mt-5 flex items-center gap-3">
                <div>
                  <Link
                    href={"/checkout"}
                    className="flex items-center gap-2 self-start rounded-md bg-red-600 px-4 py-2 text-white"
                  >
                    Procced to Checkout
                    <i className="fa-solid fa-arrow-right-long" />
                  </Link>
                </div>

                <button
                  onClick={() => {
                    clearCart();
                  }}
                  disabled={cartLength == 0}
                  className="flex items-center gap-2 self-start rounded-md border-2 border-red-600 px-4 py-2"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
          <div className="w-full md:w-full lg:w-[30%]">
            <div className="rounded-md border bg-[white]/30 px-4 py-6 shadow-md shadow-black/30">
              <h1 className="mb-4 border-b border-black pb-3 text-xl font-bold text-slate-700">
                Order Summary
              </h1>

              <div>
                <ul>
                  <li className="grid grid-cols-4 border-b border-black pb-4">
                    <span className="col-span-2">Name</span>
                    <span className="">Quantity</span>
                    <span className="text-center">Price</span>
                  </li>
                  {cartItems?.map((v, i) => (
                    <li key={i} className="grid grid-cols-4 py-4">
                      <span className="col-span-2 line-clamp-2 ">
                        {" "}
                        {v.name}
                      </span>
                      <span className="px-4 text-center">
                        {cartItems[i].quantity}
                      </span>
                      <span className="text-slate-600">
                        Rs {parseInt(v.price).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between border-t-2 border-black pt-4 ">
                <h1 className="font-semibold">Total</h1>
                <p className="">{parseInt(totalPrice).toLocaleString()} Rs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
