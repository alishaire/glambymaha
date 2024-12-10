import React from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const Footerlogo = () => {
  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000, // Adjust the speed (in milliseconds)
    speed: 1500,
    arrows: false,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const imageSlider = [
    "/logo1.jpeg",
    "/logo2.jpeg",
    "/logo3.jpeg",
    "/logo4.jpeg",
   
  ];

  return (
    <>
      <div className="Logos_parent_div  max-w-[1200px] px-[15px] pt-[50px] pb-[100px] m-auto">
        <div className="sub_parent_grid">
          <div className="logo_child_div_col_1">
            <span className="tbox_span uppercase">Brands WE Have</span>
            <h2>Trusted By The World</h2>
            <p>
              You Need it We Have it in reasonable price.
            </p>

            {/* <Link href={"#destinations"}>Check Our Brands</Link> */}
          </div>

          <div className="logo_child_div_col_2">
            <Slider {...settings}>
              {imageSlider?.map((v, i) => (
                <div key={i} className=" px-3 py-6">
                  <div className="imageBorder hover:shadow rounded-xl transition-all duration-300">
                    <Image
                      src={v}
                      width={600}
                      height={600}
                      priority="true"
                      alt="Edify Universities logos"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footerlogo;

