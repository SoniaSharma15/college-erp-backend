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
    // 🔥 BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
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

    // 🔥 RELATIONS
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true, // 🔥 performance + filtering
    },

    // 🔥 EMPLOYEE ID (college-wise unique)
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    documents: {
      type: [documentSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


// 🔥 COMPOUND UNIQUE INDEXES (FINAL)
staffSchema.index(
  { email: 1, collegeId: 1 },
  { unique: true }
);

staffSchema.index(
  { employeeId: 1, collegeId: 1 },
  { unique: true }
);


// 🔥 SAFE EXPORT (avoid model overwrite error in dev)
export default mongoose.models.Staff || mongoose.model("Staff", staffSchema);