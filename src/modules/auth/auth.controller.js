import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model.js";
import { ENV } from "../../config/env.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        collegeId: user.collegeId
      },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};