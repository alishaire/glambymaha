import Products from "@/models/product";
import dbConnect from "@/config/dbConnect";
import OrdersModal from "@/models/orders";

export default async function handler(req, res) {
  dbConnect();

  switch (req.method) {
    case "GET":
      try {
        var match = {};

        if (req.query.id) {
          match._id = req.query.id;
        } else if (req.query.isLoginUserName) {
          match.isLoginUserName = req.query.isLoginUserName;
        }

        var foundOrders = await OrdersModal.find(match)
          .populate({
            path: "items.productID",
            modal: Products,
            select: ["name", "images", "stock"],
          })
          .populate("hasLoginUserData", "fullname email");

        foundOrders = foundOrders.map((order) => {
          var total = 0;
          order.items.map((v) => {
            total = total + v.quantity * v.unitPrice;
          });

          var obj = { ...order._doc, total };
          return obj;
        });

        res.json({
          success: true,
          message: foundOrders,
        });
      } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
      }
      break;
    case "POST":
      try {
        var order = await OrdersModal.create(req.body);

        res.json({
          success: true,
          message: order,
        });
      } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
      }
      break;
    case "PUT":
      try {
        await OrdersModal.findByIdAndUpdate(req.body._id, { $set: req.body });

        res.json({
          success: true,
          message: "Order Updated Successfully!",
        });
      } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
      }
      break;
    case "DELETE":
      try {
        await OrdersModal.findByIdAndDelete(req.query.id);

        res.json({
          success: true,
          message: "Order Deleted Successfully!",
        });
      } catch (error) {
        console.log(error);

        res.json({
          success: false,
          message: error.message,
        });
      }
      break;
  }
}
