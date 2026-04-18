// src/modules/course/course.model.js

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
      trim: true,
    },

    degreeType: {
      type: String,
      enum: ["UG", "PG", "Diploma", "PhD"],
      required: true,
    },

    durationYears: {
      type: Number,
      required: true,
    },

    totalSemesters: {
      type: Number,
      required: true,
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

// unique course per college
courseSchema.index({ code: 1, collegeId: 1 }, { unique: true });

export default mongoose.model("Course", courseSchema);