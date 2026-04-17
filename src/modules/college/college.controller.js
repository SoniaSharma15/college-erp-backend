import { College } from "./college.model.js";
import { User } from "../user/user.model.js";
import bcrypt from "bcryptjs";
import { ROLES } from "../../constants/roles.js";

export const createCollege = async (req, res, next) => {
  try {
    const { name, code, adminName, adminEmail, adminPassword } = req.body;

    // create college
    const college = await College.create({ name, code });

    // hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // create admin
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      roles: [ROLES.COLLEGE_ADMIN],
      collegeId: college._id
    });

    res.status(201).json({
      message: "College & Admin created",
      college,
      admin
    });
  } catch (err) {
    next(err);
  }
};

export const getAllColleges = async (req, res, next) => {
  try {
    const colleges = await College.find();

    res.json({
      count: colleges.length,
      colleges
    });
  } catch (err) {
    next(err);
  }
};