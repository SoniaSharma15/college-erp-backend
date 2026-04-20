import express from "express";

import { createNotice, getAllNotices } from "./notice.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Create Notice

router.post(
  "/",
  authMiddleware,
  createNotice
);
// Get All Notices

router.get(
  "/",
  authMiddleware,
  getAllNotices
);
export default router;