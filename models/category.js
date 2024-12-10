import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category Name required!"],
      unique: [true, "Category Already Exists!"],
    },
  },

  { timestamps: true }
);

export default mongoose?.models?.category ||
  mongoose?.model("category", categorySchema);
