import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, "Enter Fullname Name"],
  },
  username: {
    type: String,
    trim: true,
    unique: [true, "Username already in Use!"],
    required: [true, "Enter Username"],
  },
  email: {
    type: String,
    trim: true,
    unique: [true, "Email already in Use!"],
    required: [true, "Enter Email"],
  },
  phone: {
    type: String,
    trim: true,
    unique: [true, "Phone No already in Use!"],
    required: [true, "Enter Phone Number"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Enter Password"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    value: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      required: true,
    },
  },
  addressDetails: [
    {
      city: {
        type: String,
      },
      addresses: {
        type: String,
      },
    },
  ],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
  },
  otp: {
    value: Number,
    expirationTime: Number,
  },
});

export default mongoose.models?.users || mongoose.model("users", UserSchema);
