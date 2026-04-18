// src/modules/branch/branch.model.js

import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    intakeCapacity: {
      type: Number,
      default: 60,
    },

    lateralEntryAllowed: {
      type: Boolean,
      default: false,
    },

    totalSeats: {
      type: Number,
      default: 60,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// unique branch per course per college
branchSchema.index(
  { code: 1, courseId: 1, collegeId: 1 },
  { unique: true }
);

export default mongoose.model("Branch", branchSchema);