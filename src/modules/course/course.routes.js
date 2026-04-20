// src/modules/course/course.routes.js

import express from "express";
import { createCourse, getCourses } from "./course.controller.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {allowRoles} from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("COLLEGE_ADMIN"), createCourse);
router.get("/", authMiddleware, allowRoles("COLLEGE_ADMIN"), getCourses);

export default router;