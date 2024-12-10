import Image from "next/image";
import Link from "next/link";

const Features = () => {
  const cardJson = [
    {
      heading: "Facial products",
      img: "/face.jpeg",
    },
    {
      heading: "Hair Products",
      img: "/face2.jpeg",
    },
  ];

  return (
    <>
      <div id="featuresLink" className="m-auto my-4 max-w-[1250px] py-6">
        <h1 className="mb-5 text-2xl font-semibold text-gray-600">Shop Now</h1>
        <div className="grid  grid-cols-1 gap-3 md:grid-cols-2">
          {cardJson?.map((v, i) => (
            <div
              className="flex items-center gap-4 justify-between rounded-md bg-gradient-to-tr from-red-400 to-red-400/30 px-6 py-4 text-white max-md:flex-col"
              key={i}
            >
              <div className="flex h-full flex-col items-start justify-center gap-4">
                <h1 className=" text-3xl max-md:text-xl">{v.heading}</h1>
                <div>
                  <Link
                    href={"/categories"}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-2 py-1"
                  >
                    Shop Now
                    <i className="fa-solid fa-arrow-right-long" />
                  </Link>
                </div>
              </div>

              <Image
                height={300}
                width={300}
                priority="true"
                src={v.img}
                alt="image here"
                className=" w-full  max-w-[250px] mix-blend-multiply "
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;
