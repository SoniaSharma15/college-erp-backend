import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../src/modules/user/user.model.js";
import { ROLES } from "../src/constants/roles.js";


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected for seeding");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

const seedSuperAdmin = async () => {
  try {
    const existing = await User.findOne({
      roles: ROLES.SUPER_ADMIN
    });

    if (existing) {
      console.log("⚠️ Super Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      roles: [ROLES.SUPER_ADMIN]
    });

    console.log("🔥 Super Admin Created:");
    console.log({
      email: superAdmin.email,
      password: "admin123"
    });

    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedSuperAdmin();
};

run();