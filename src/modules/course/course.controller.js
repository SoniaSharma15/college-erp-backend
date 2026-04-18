// src/modules/course/course.controller.js

import Course from "./course.model.js";

export const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      code,
      degreeType,
      durationYears,
      totalSemesters,
      description,
    } = req.body;

    // 🔴 Manual Validation
    if (!name || !code || !degreeType || !durationYears || !totalSemesters) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!["UG", "PG", "Diploma", "PhD"].includes(degreeType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid degree type",
      });
    }

    if (durationYears <= 0 || totalSemesters <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration and semesters must be greater than 0",
      });
    }

    // 🔴 Duplicate check (per college)
    const existingCourse = await Course.findOne({
      code: code.toUpperCase(),
      collegeId: req.user.collegeId,
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with this code already exists",
      });
    }

    // ✅ Create Course
    const course = await Course.create({
      name: name.trim(),
      code: code.toUpperCase(),
      degreeType,
      durationYears,
      totalSemesters,
      description: description || "",
      collegeId: req.user.collegeId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      collegeId: req.user.collegeId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};