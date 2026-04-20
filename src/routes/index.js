import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import collegeRoutes from "../modules/college/college.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js"; // ✅ correct
import courseRoutes from "../modules/course/course.routes.js";
import branchRoutes from "../modules/branch/branch.routes.js";


const router = Router();

// MODULE ROUTES
router.use("/auth", authRoutes);
router.use("/college", collegeRoutes);
router.use("/staff", staffRoutes); // ✅ added correctly

router.use("/courses", courseRoutes);
router.use("/branches", branchRoutes);


// test route
router.get("/test", (req, res) => {
  res.json({
    message: "API is working ✅",
  });
});

export default router;