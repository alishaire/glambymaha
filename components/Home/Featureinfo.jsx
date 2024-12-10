import Link from "next/link";
import React from "react";

const Featureinfo = () => {
  return (
    <div>
      <section className="p-4 lg:p-8">
        <div className="mx-auto space-y-12 max-w-[1250px] m-auto">
          <div className="globalShadow flex flex-col overflow-hidden rounded-lg border-4 border-gray-300/40 bg-white py-6 lg:flex-row">
            <img src="/firstglam.jpeg" alt="" className="aspect-video h-80" />
            <div className="flex flex-1 flex-col justify-center p-6">
              <h3 className="text-3xl font-bold text-gray-700">Discover Glam by Maha: Your Destination for Beauty and Elegance</h3>
              <p className="my-6 text-gray-500">
              Welcome to Glam by Maha, where beauty meets sophistication. As a premium Pakistani brand, we pride ourselves on offering an exquisite range of makeup, skincare, and perfume products designed to enhance your natural charm. From luxurious skincare solutions to long-lasting fragrances and high-quality cosmetics, our carefully curated collection caters to every beauty enthusiast. At Glam by Maha, we believe in empowering individuals to feel confident, radiant, and glamorous every day. Explore our exclusive offerings and embark on a journey to redefine your beauty routine with products crafted for excellence and authenticity.
              </p>
            </div>
          </div>

          <div className="globalShadow flex flex-col overflow-hidden rounded-lg border-4 border-gray-300/40 bg-white py-6 lg:flex-row-reverse">
            <img src="/secondglam.jpeg" alt="" className="aspect-video  h-80" />
            <div className="flex flex-1 flex-col justify-center p-6 ">
              <h3 className="text-3xl font-bold text-gray-700">Elevate Your Beauty with Our Cosmetics and Perfumes</h3>
              <p className="my-6 text-gray-500">
              At Glam by Maha, we bring you a dazzling collection of cosmetics and perfumes that redefine elegance and style. Our cosmetics line features high-quality products, from vibrant lip shades to flawless foundations, designed to enhance your natural beauty while ensuring long-lasting wear. Complement your look with our signature perfumes, crafted with captivating fragrances that leave a lasting impression. Whether you	&apos;re seeking everyday essentials or show-stopping glamour, Glam by Maha is your ultimate destination for beauty and sophistication. Let our products inspire your confidence and elevate your charm.
              </p>
            </div>
          </div>

          <div className="globalShadow flex flex-col overflow-hidden rounded-lg border-4 border-gray-300/40 bg-white py-6 lg:flex-row">
            <img
              src="/thirdglam.jpeg"
              alt=""
              className=" aspect-square w-[50%] object-cover"
            />
            <div className="flex flex-1 flex-col justify-center p-6 ">
              <h3 className="text-3xl font-bold text-gray-700">Nurture Your Skin with Glam by Maha Skincare</h3>
              <p className="my-6 text-gray-500">
              Your skin deserves the best, and at Glam by Maha, we deliver just that with our premium skincare range. From hydrating creams to exfoliating gels, our products are formulated with nourishing ingredients to enhance your skin	&apos;s natural glow. Designed to address various skincare needs, our collection helps you achieve a smooth, radiant, and healthy complexion. Whether you	&apos;re looking for daily care or targeted treatments, Glam by Maha is committed to providing solutions that prioritize your skin	&apos;s health and beauty. Discover the secret to glowing, confident skin with our expertly crafted skincare essentials.
              </p>
              <Link
                href={"/categories"}
                type="button"
                className="self-start rounded-lg  bg-red-500 text-white px-4 py-1.5"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Featureinfo;
