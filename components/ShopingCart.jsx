import { useContext, useState } from "react";
import { CartContext } from "@/context/CartProvider";
import Link from "next/link";
import Image from "next/image";

const ShopingCart = () => {
  const {
    cartItems,
    addToCart,
    clearCart,
    setShowCartState,
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
    <div className="h-full max-w-[600px]  overflow-auto rounded-lg border bg-white p-4">
      <button
        className="flex items-center gap-2 self-start  rounded-md bg-red-600 px-2 py-1 text-white"
        onClick={() => setShowCartState(false)}
      >
        <i className="fa-solid fa-x text-[12px]"></i>
        <span className="ml-2">Close</span>
      </button>

      <h2 className="mb-6 mt-4 text-3xl font-bold text-slate-700">
        Shopping Cart
      </h2>

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full">
          {cartLength == 0 ? (
            <div className="my-2">
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
                className="flex w-fit items-center gap-3 rounded-full border px-5 py-3 text-slate-500 transition-all hover:border-red-300 hover:text-red-400"
              >
                <i className="fa-solid fa-angle-left asideAnimate text-sm"></i>{" "}
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map((v, i) => {
                return (
                  <div className="border-b border-b-slate-200">
                    <div className="col-span-3 flex items-center gap-4">
                      <Image
                        height={200}
                        width={200}
                        alt="image here"
                        src={v.images[i] || v.images[0] || v.avatar}
                        className="h-auto w-24 object-cover md:w-32 lg:w-24"
                      />
                      <div className="">
                        <h2 className="line-clamp-1 font-medium text-slate-800">
                          {v.name}
                        </h2>
                        <div className="mt-3 flex flex-col gap-2">
                          <span className="text-sm font-normal text-slate-950">
                            Rs {parseInt(v.price).toLocaleString()}
                          </span>
                          <span className="text-xs font-light text-slate-600">
                            {v.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-between px-2 py-4">
                      <div className="col-span-1 grid lg:items-end ">
                        <div className="w-fit rounded-full border px-4 py-1">
                          <button
                            className="text-sm text-slate-500 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-100"
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

                      <button
                        className="rounded text-sm text-slate-500 hover:text-slate-700"
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
          <div className="w-full md:w-full">
            <div className="flex items-center justify-between px-4 py-2">
              <h1 className=" text-xl font-bold text-slate-700">Order Total</h1>
              <p className="text-sm text-[#000000b0]">
                Rs
                {parseInt(totalPrice).toLocaleString()}
              </p>
            </div>
          </div>
          {cartLength <= 0 ? null : (
            <div className="my-2 mt-5 flex items-center gap-3">
              <Link
                href={"/checkout"}
                className="rounded-lg border bg-red-600 px-5 py-2 font-light text-white transition-all hover:bg-red-500 disabled:hidden"
              >
                Procced to Checkout
              </Link>
              <button
                onClick={() => {
                  clearCart();
                }}
                disabled={cartLength == 0}
                className="rounded-lg border px-5 py-2 font-light text-slate-500 transition-all hover:text-red-600 disabled:hidden"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopingCart;
