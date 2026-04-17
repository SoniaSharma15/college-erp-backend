import { Router } from "express";
import {
  createCollege,
  getAllColleges
} from "./college.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.SUPER_ADMIN),
  createCollege
);

router.get(
  "/all",
  authMiddleware,
  allowRoles(ROLES.SUPER_ADMIN),
  getAllColleges
);

export default router;