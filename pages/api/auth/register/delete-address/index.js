import userModal from "@/models/users";
import dbConnect from "@/config/dbConnect";

export default async function handler(req, res) {
  dbConnect();

  try {
    const userId = req.query.userId;
    const addressId = req.query.addressId;

    const user = await userModal.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Find the index of the address in the addressDetails array
    const addressIndex = user.addressDetails.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Remove the address from the array
    user.addressDetails.splice(addressIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      error,
    });
  }
}
