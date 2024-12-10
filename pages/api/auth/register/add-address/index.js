import dbConnect from "@/config/dbConnect";
import usersModel from "@/models/users";

export default async function handleAddressAddition(req, res) {
  dbConnect();
  try {
    const userId = req.body._id || req.query.id;
    const user = await usersModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract the new address details from the request body
    const { city, addresses } = req.body;

    // Add the new address to the user's addressDetails array
    user.addressDetails.push({ city, addresses });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
