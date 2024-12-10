import ProductCard from "../ProductCard";

const ProductList = ({ props }) => {
  const AllProductsData = props;

  return (
    <div className="m-auto max-w-[1200px]">
      <div id="recentProducts">
        <div className=" m-auto">
          {/* Sale --------------------------------------------- */}
          <div className=" px-4 py-10">
            <div className="flex items-center justify-between ">
              <h2 className="flex gap-2 py-6 text-6xl font-extrabold">
                All Products
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-red-600" />
                <span>Up To 50% Discount.</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AllProductsData?.map((v, i) => (
                <ProductCard data={v} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
