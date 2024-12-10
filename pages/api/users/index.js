import dbConnect from "@/config/dbConnect";
import userModal from "@/models/users";

export default async function handler(req, res) {
  dbConnect();

  try {
    var match = {};
    var users = {};

    const page = req.query.page || 1;
    const limit = req.query.limit || 6;
    const skip = (page - 1) * limit;

    if (req.query.fullname) {
      match.fullname = new RegExp(req.query.fullname, "i");
    } else if (req.query.phone) {
      match.phone = new RegExp(req.query.phone, "i");
    } else if (req.query.role) {
      match.role = new RegExp(req.query.role, "i");
    }

    users = await userModal
      .find(match, {
        description: 0,
        reviews: 0,
        ratings: 0,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalUser = await userModal.find(match).count();

    var starting = totalUser ? skip + 1 : 0;
    var ending =
      starting + limit > totalUser ? totalUser : starting + limit - 1;

    res.status(200).json({
      success: true,
      message: {
        totalUser,
        users,
        starting,
        ending,
        page,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
