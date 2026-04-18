// src/modules/branch/branch.controller.js

import Branch from "./branch.model.js";
import Course from "../course/course.model.js";

export const createBranch = async (req, res, next) => {
  try {
    const {
      name,
      code,
      courseId,
      intakeCapacity,
      lateralEntryAllowed,
      totalSeats,
      description,
    } = req.body;

    // 🔴 Manual Validation
    if (!name || !code || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Name, code and courseId are required",
      });
    }

    // 🔴 Check course exists in same college
    const course = await Course.findOne({
      _id: courseId,
      collegeId: req.user.collegeId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this college",
      });
    }

    // 🔴 Duplicate check
    const existingBranch = await Branch.findOne({
      code: code.toUpperCase(),
      courseId,
      collegeId: req.user.collegeId,
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch already exists for this course",
      });
    }

    // ✅ Create Branch
    const branch = await Branch.create({
      name: name.trim(),
      code: code.toUpperCase(),
      courseId,
      intakeCapacity: intakeCapacity || 60,
      lateralEntryAllowed: lateralEntryAllowed || false,
      totalSeats: totalSeats || 60,
      description: description || "",
      collegeId: req.user.collegeId,
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (err) {
    next(err);
  }
};

export const getBranchesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // 🔴 Safety check
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId is required",
      });
    }

    const branches = await Branch.find({
      courseId,
      collegeId: req.user.collegeId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: branches,
    });
  } catch (err) {
    next(err);
  }
};