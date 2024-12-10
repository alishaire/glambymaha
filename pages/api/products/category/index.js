import categoryModel from "@/models/category";
import dbConnect from "@/config/dbConnect";

export default async function handler(req, res) {
  dbConnect();

  switch (req.method) {
    case "POST":
      try {
        const category = await categoryModel.create(req.body);
        res.status(201).json({
          success: true,
          category,
        });
      } catch (error) {
        if(error.code == 11000){

          res.status(500).json({
            success: false,
            message: "Category already added!",
          });
        }
      }
      break;

    case "GET":
      try {
        const getcat = await categoryModel.find();
        res.status(200).json({
          success: true,
          getcat,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Internal Server Error!",
        });
      }

    default:
      break;
  }
}
