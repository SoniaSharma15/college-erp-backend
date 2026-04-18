// src/modules/branch/branch.routes.js

import express from "express";
import {
  createBranch,
  getBranchesByCourse,
} from "./branch.controller.js";

import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {allowRoles} from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("ADMIN"), createBranch);

router.get(
  "/:courseId",
  authMiddleware,
  allowRoles("ADMIN"),
  getBranchesByCourse
);

export default router;