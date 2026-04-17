import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    roles: [
      {
        type: String
      }
    ],
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);