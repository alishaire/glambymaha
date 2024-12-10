import dbConnect from "@/config/dbConnect";
import productModel from "../../../models/product";

export default async function handler(req, res) {
  dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const singleProduct = await productModel.findOne({
          slug: req.query.slug,
        });
        res.status(200).json({
          success: true,
          singleProduct,
        });
      } catch (error) {
        console.log(error);
      }
      break;
    case "PUT": // Add a new "PUT" case for updating the product
      if (req.query.reviews) {
        let reviews = req.query.reviews;
        switch (reviews) {
          case "POST":
            let updatedProduct = await productModel.findOneAndUpdate(
              { slug: req.query.slug },
              { $push: { reviews: req.body } },
              { new: true }
            );

            res.status(200).json({
              success: true,
              message: updatedProduct,
            });
            break;
          case "GET":
            let productGet = await productModel.findOne({
              slug: req.query.slug,
            });
            res.status(200).json({
              success: true,
              message: productGet,
            });
            break;
          case "DELETE":
            let newProduct = await productModel.findOneAndUpdate(
              { slug: req.query.slug },
              { $pull: { reviews: { _id: req.body._id } } },
              { new: true }
            );
            res.status(200).json({
              success: true,
              message: newProduct,
            });
            break;
          default:
            res.send("Invalid Product");
            break;
        }
      } else {
        const updatedProduct = await productModel.findOneAndUpdate(
          { slug: req.query.slug },
          req.body,
          { new: true }
        );

        res.status(200).json({
          success: true,
          message: "Product Updated Successfully!",
          updatedProduct,
        });
      }

      break;
    case "DELETE":
      try {
        const singleProduct = await productModel.findOne({
          slug: req.query.slug,
        });
        if (!singleProduct) {
          res.status(404).json({
            success: false,
            message: "Product Not Found!",
          });
        } else {
          const delProduct = await productModel.findByIdAndDelete(
            singleProduct._id
          );
          res.status(200).json({
            success: true,
            message: "Product Deleted Successfully!",
          });
        }
      } catch (error) {
        res.status(error?.message);
      }

    default:
      break;
  }
  try {
    const singleProduct = await productModel.findOne({ slug: req.query.slug });
    res.status(200).json({
      success: true,
      singleProduct,
    });
  } catch (error) {
    console.log(error);
  }
}
