// staff.model.js

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    public_id: String,
  },
  { _id: true }
);

const staffSchema = new mongoose.Schema(
  {
    // 🔥 REQUIRED (CREATE TIME)
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "HOD", "FACULTY", "STAFF"],
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    // 🔥 OPTIONAL (LATER ASSIGN)
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null, // ❗ FIXED (NOT REQUIRED)
    },

    // 🔥 AUTO GENERATED
    employeeId: {
      type: String,
      unique: true,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    // 🔥 OPTIONAL DOCUMENTS
    documents: {
      type: [documentSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);