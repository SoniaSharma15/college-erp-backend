import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import collegeRoutes from "../modules/college/college.routes.js";
import courseRoutes from "../modules/course/course.routes.js";
import branchRoutes from "../modules/branch/branch.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/college", collegeRoutes);

router.use("/api/courses", courseRoutes);
router.use("/api/branches", branchRoutes);


// test route
router.get("/test", (req, res) => {
  res.json({
    message: "API is working ✅"
  });
});

export default router;