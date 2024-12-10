import Head from "next/head";
import {
  BestSlelling,
  Deliveryinfo,
  Featureinfo,
  Features,
  Header,
} from "@/components/Home/Export";
import OnSaleProducts from "@/components/OnSaleProducts";
import queryStr from "query-string";
import Footerlogo from "@/components/Home/Footerlogo";

export default function Home({ products, products2, products3 }) {
  return (
    <>
      <Head>
        <title>Glam By Maha: Trendy Finds at Your Fingertips </title>
        <meta
          name="description"
          content="Shop at U-Shop and discover a world of fashion. Get your hands on style that speaks volumes today."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <Features />
      <Featureinfo />
      <BestSlelling props={products2} />
        <OnSaleProducts props={products3} /> 
      <Deliveryinfo />
      <Footerlogo/>
    </>
  );
}

export async function getServerSideProps(props) {
  const queryString = queryStr.stringify(props.query);
  const res = await fetch(
    `http://localhost:3000/api/get-all-product?${queryString}`,
  );
  const data = await res.json();

  const fetchData = await fetch(
    `http://localhost:3000/api/get-all-product?bestSelling=true`,
  );
  const jsonData = await fetchData.json();

  const fetchData2 = await fetch(
    `http://localhost:3000/api/get-all-product?onSale=true`,
  );
  const jsonData2 = await fetchData2.json();

  return {
    props: {
      products: data?.message?.ProductData,
      products2: jsonData?.message?.ProductData,
      products3: jsonData2?.message?.ProductData,
    },
  };
}
