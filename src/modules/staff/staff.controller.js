import Staff from "./staff.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔥 helpers
const generateEmployeeId = async () => {
  const count = await Staff.countDocuments();
  return "EMP" + (1000 + count + 1);
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// ================= CREATE =================
export const registerStaff = async (req, res) => {
  try {
    const { name, email, phone, role, designation } = req.body;

    if (!name || !email || !phone || !role || !designation) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const exists = await Staff.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const employeeId = await generateEmployeeId();
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const staff = await Staff.create({
      name,
      email,
      phone,
      role,
      designation,
      employeeId,
      password: hashedPassword,

      courseId: null,
      collegeId: null,
      documents: [], // ✅ FIXED
    });

    res.status(201).json({
      message: "Employee created",
      credentials: {
        employeeId,
        email,
        password: rawPassword,
      },
      data: staff,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, staff.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    staff.lastLogin = new Date();
    await staff.save();

    res.json({ token, user: staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET =================
export const getAllStaff = async (req, res) => {
  const data = await Staff.find();
  res.json(data);
};

export const getByEmployeeId = async (req, res) => {
  const staff = await Staff.findOne({
    employeeId: req.params.empId,
  });

  if (!staff) return res.status(404).json({ message: "Not found" });

  res.json(staff);
};

// ================= UPDATE =================
export const updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await Staff.findByIdAndUpdate(id, { password: hashed });

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const newPass = generatePassword();
    const hashed = await bcrypt.hash(newPass, 10);

    await Staff.findByIdAndUpdate(id, { password: hashed });

    res.json({
      message: "Password reset",
      newPassword: newPass,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= TOGGLE ACTIVE =================
export const toggleStatus = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  staff.isActive = !staff.isActive;
  await staff.save();

  res.json({ message: "Status updated", isActive: staff.isActive });
};

// ================= ADD DOCUMENT =================
export const addDocument = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  staff.documents.push(req.body);
  await staff.save();

  res.json(staff);
};

// ================= REMOVE DOCUMENT =================
export const removeDocument = async (req, res) => {
  const { id, docId } = req.params;

  const staff = await Staff.findById(id);

  staff.documents = staff.documents.filter(
    (doc) => doc._id.toString() !== docId
  );

  await staff.save();

  res.json(staff);
};

// ================= DELETE =================
export const deleteStaff = async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};