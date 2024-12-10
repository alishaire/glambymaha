import dbConnect from "@/config/dbConnect";
import usersModel from "@/models/users";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  dbConnect();

  try {
    if (!req.body.username) {
      res.status(400).json({
        success: false,
        message: "Username Required!",
      });
    }

    if (!req.body.password) {
      res.status(400).json({
        success: false,
        message: "Password Required!",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await usersModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: user,
    });
  } catch (error) {
    // For duplicate Data Error Hnadle
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `${Object.keys(error.keyPattern)[0]} already in use!`,
      });
    }

    var errorMessage = error.message?.split(":")[2]?.trim();
    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
}
