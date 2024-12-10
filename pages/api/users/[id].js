import dbConnect from "@/config/dbConnect";
import userModal from "@/models/users";

export default async function handler(req, res) {
  dbConnect();

  try {
    const fetchUser = await userModal.findById(req.query.id);

    if (!fetchUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const deleteUser = await userModal.findByIdAndDelete(req.query.id);

    if (!deleteUser) {
      return res.status(400).json({
        success: false,
        message: "Unable to delete the User!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error!",
      error: error.message,
    });
  }
}
