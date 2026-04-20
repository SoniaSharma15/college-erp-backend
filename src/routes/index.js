import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import collegeRoutes from "../modules/college/college.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js";
import courseRoutes from "../modules/course/course.routes.js";
import branchRoutes from "../modules/branch/branch.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/college", collegeRoutes);
router.use("/staff", staffRoutes);

// 🔥 FIXED
router.use("/courses", courseRoutes);
router.use("/branches", branchRoutes);

router.get("/test", (req, res) => {
  res.json({
    message: "API is working ✅",
  });
});

export default router;