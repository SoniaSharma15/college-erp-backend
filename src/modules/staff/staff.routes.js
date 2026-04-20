import { Router } from "express";
import {
  registerStaff,
  loginStaff,
  getAllStaff,
  getByEmployeeId,
  updateStaff,
  deleteStaff,
  changePassword,
  resetPassword,
  toggleStatus,
  addDocument,
  removeDocument,
} from "./staff.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

// ================= AUTH =================

// ❗ login public rahega
router.post("/login", loginStaff);

// ================= PROTECTED =================

// 🔥 CREATE STAFF (only COLLEGE_ADMIN)
router.post(
  "/register",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  registerStaff
);

// 🔥 GET STAFF (college-wise)
router.get(
  "/",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  getAllStaff
);

router.get(
  "/emp/:empId",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  getByEmployeeId
);

// 🔥 UPDATE
router.put(
  "/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  updateStaff
);

// 🔥 PASSWORD
router.put(
  "/change-password/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  changePassword
);

router.put(
  "/reset-password/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  resetPassword
);

// 🔥 STATUS
router.put(
  "/toggle/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  toggleStatus
);

// 🔥 DOCUMENT
router.post(
  "/document/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  addDocument
);

router.delete(
  "/document/:id/:docId",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  removeDocument
);

// 🔥 DELETE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("COLLEGE_ADMIN"),
  deleteStaff
);

export default router;