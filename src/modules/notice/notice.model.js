import mongoose from "mongoose";

const noticeSchema =
  new mongoose.Schema({

    action: {
      type: String,
      required: true
    },

    personName: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    adminName: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    reason: {
      type: String,
      required: true
    }

  },

  {
    timestamps: true
  }

);

export default mongoose.model(
  "Notice",
  noticeSchema
);