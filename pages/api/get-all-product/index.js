import dbConnect from "../../../config/dbConnect";
import productModel from "../../../models/product";

export default async function handler(req, res) {
  dbConnect();

  try {
    var match = {};
    var ProductData = {};

    const page = req.query.page || 1;
    const limit = req.query.limit || 8;
    const skip = (page - 1) * limit;

    // Check if minPrice and maxPrice query parameters are provided
    if (req.query.minPrice || req.query.maxPrice) {
      match.price = {};

      // Add minimum price filter if provided
      if (req.query.minPrice) {
        match.price.$gte = req.query.minPrice;
      }

      // Add maximum price filter if provided
      if (req.query.maxPrice) {
        match.price.$lte = req.query.maxPrice;
      }
    }

    if (req.query.sort) {
      var sorted = await productModel.find().sort({ createdAt: 1 });
      return res.status(200).json({
        success: true,
        message: {
          data: sorted,
        },
      });
    } else if (req.query.unsort) {
      var unSorted = await productModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: {
          data: unSorted,
        },
      });
    }

    // Add other filters (name, category, seller)
    if (req.query.name) {
      match.name = new RegExp(req.query.name, "i");
    } else if (req.query.category) {
      match.category = new RegExp(req.query.category, "i");
    } else if (req.query.seller) {
      match.seller = new RegExp(req.query.seller, "i");
    } else if (req.query.bestSelling) {
      match.bestSelling = new RegExp(req.query.bestSelling, "i");
    } else if (req.query.limitLess) {
    } else if (req.query.onSale) {
      match.onSale = new RegExp(req.query.onSale, "i");
    } else if (req.query.limitLess) {
      var items = await productModel.find().sort({ createdAt: -1 });
      const total = await productModel.find().count();
      return res.status(200).json({
        success: true,
        message: {
          data: items,
          count: total,
        },
      });
    }

    ProductData = await productModel
      .find(match, {
        description: 0,
        reviews: 0,
        ratings: 0,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const TotalProducts = await productModel.find(match).count();

    var starting = TotalProducts ? skip + 1 : 0;
    var ending =
      starting + limit > TotalProducts ? TotalProducts : starting + limit - 1;

    res.status(200).json({
      success: true,
      message: {
        TotalProducts,
        ProductData,
        starting,
        ending,
        page,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
