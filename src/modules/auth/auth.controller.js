import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model.js";
import Staff from "../staff/staff.model.js";
import { ENV } from "../../config/env.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 🔥 STEP 1: Check in User collection
    let account = await User.findOne({ email });

    let isStaff = false;

    // 🔥 STEP 2: If not found → check Staff
    if (!account) {
      account = await Staff.findOne({ email });
      isStaff = true;
    }

    // ❌ Not found anywhere
    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Password check
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 Roles fix
    const roles = isStaff ? [account.role] : account.roles;

    // 🔥 Token
    const token = jwt.sign(
      {
        id: account._id,
        roles,
        collegeId: account.collegeId,
      },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        ...account.toObject(),
        roles, // 🔥 ensure frontend gets roles array
      },
    });

  } catch (err) {
    next(err);
  }
};