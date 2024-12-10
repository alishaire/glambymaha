import "@/styles/globals.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Layout from "@/components/Layout";
import CartProvider from "@/context/CartProvider";
import Context from "@/context/AuthContext";
import { QueryClientProvider, QueryClient } from "react-query";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Context>
          <CartProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </Context>
      </QueryClientProvider>
    </>
  );
}
