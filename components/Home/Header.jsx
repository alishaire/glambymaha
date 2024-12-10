import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        // navigation={true}
        // pagination={{
        //   clickable: true,
        // }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        className="h-screen max-md:h-full"
      >
        <SwiperSlide>
          <div className="flex relative h-full w-full">
            <Image
              width={700}
              height={700}
              src="/h1.jpeg"
              alt="hero"
              className="h-full object-cover w-full "
            />
             <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex relative h-full w-full ">
            <Image
              width={700}
              height={700}
              src="/h2.jpeg"
              alt="hero"
              className="h-full w-full "
            />
                 <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide>
          <div className="flex relative h-full w-full">
            <Image
              width={700}
              height={700}
              src="/h3.jpeg"
              alt="hero"
              className="h-full w-full "
            />
                 <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide>
          <div className="flex relative h-full w-full">
            <Image
              width={700}
              height={700}
              src="/h4.jpeg"
              alt="hero"
              className="h-full w-full "
            />
                 <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex relative h-full w-full">
            <Image
              width={700}
              height={700}
              src="/h5.jpeg"
              alt="hero"
              className="h-full w-full "
            />
                 <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Header;
