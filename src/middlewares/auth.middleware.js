import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    req.user = decoded; // 🔥 contains id, role, collegeId

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};