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

const router = Router();

// AUTH
router.post("/register", registerStaff);
router.post("/login", loginStaff);

// GET
router.get("/", getAllStaff);
router.get("/emp/:empId", getByEmployeeId);

// UPDATE
router.put("/:id", updateStaff);

// PASSWORD
router.put("/change-password/:id", changePassword);
router.put("/reset-password/:id", resetPassword);

// STATUS
router.put("/toggle/:id", toggleStatus);

// DOCUMENT
router.post("/document/:id", addDocument);
router.delete("/document/:id/:docId", removeDocument);

// DELETE
router.delete("/:id", deleteStaff);

export default router;