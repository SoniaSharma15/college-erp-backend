import Staff from "./staff.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= HELPERS =================

// ✅ SAFE employeeId (college-wise + collision safe)
const generateEmployeeId = async (collegeId) => {
  let id;
  let exists = true;

  while (exists) {
    const count = await Staff.countDocuments({ collegeId });
    id = "EMP" + (1000 + count + 1);

    exists = await Staff.findOne({ employeeId: id, collegeId });
  }

  return id;
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// ================= CREATE =================
export const registerStaff = async (req, res) => {
  try {
    const { name, email, phone, role, designation } = req.body;

    const collegeId = req.user.collegeId;

    if (!name || !email || !phone || !role || !designation) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // ✅ email unique per college
    const exists = await Staff.findOne({ email, collegeId });
    if (exists) {
      return res.status(400).json({
        message: "Email already exists in this college",
      });
    }

    const employeeId = await generateEmployeeId(collegeId);

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
      collegeId,
      documents: [],
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
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({
  email,
  collegeId: req.body.collegeId // OR from frontend
});

    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, staff.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ INCLUDE collegeId
    const token = jwt.sign(
      {
        id: staff._id,
        role: staff.role,
        collegeId: staff.collegeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    staff.lastLogin = new Date();
    await staff.save();

    res.json({
      token,
      user: staff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET =================

// ✅ FILTER BY COLLEGE
export const getAllStaff = async (req, res) => {
  try {
    console.log("FETCH FOR:", req.user.collegeId); // 🔥 debug

    const data = await Staff.find({
      collegeId: req.user.collegeId, // 🔥 MUST
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ SECURE BY COLLEGE
export const getByEmployeeId = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      employeeId: req.params.empId,
      collegeId: req.user.collegeId,
    });

    if (!staff) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
export const updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findOneAndUpdate(
      {
        _id: req.params.id,
        collegeId: req.user.collegeId, // 🔥 SECURITY
      },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.newPassword, 10);

    await Staff.findOneAndUpdate(
      { _id: req.params.id, collegeId: req.user.collegeId },
      { password: hashed }
    );

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const newPass = generatePassword();
    const hashed = await bcrypt.hash(newPass, 10);

    await Staff.findOneAndUpdate(
      { _id: req.params.id, collegeId: req.user.collegeId },
      { password: hashed }
    );

    res.json({
      message: "Password reset",
      newPassword: newPass,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= STATUS =================
export const toggleStatus = async (req, res) => {
  const staff = await Staff.findOne({
    _id: req.params.id,
    collegeId: req.user.collegeId,
  });

  staff.isActive = !staff.isActive;
  await staff.save();

  res.json({ isActive: staff.isActive });
};

// ================= DOCUMENT =================
export const addDocument = async (req, res) => {
  const staff = await Staff.findOne({
    _id: req.params.id,
    collegeId: req.user.collegeId,
  });

  staff.documents.push(req.body);
  await staff.save();

  res.json(staff);
};

export const removeDocument = async (req, res) => {
  const staff = await Staff.findOne({
    _id: req.params.id,
    collegeId: req.user.collegeId,
  });

  staff.documents = staff.documents.filter(
    (doc) => doc._id.toString() !== req.params.docId
  );

  await staff.save();
  res.json(staff);
};

// ================= DELETE =================
export const deleteStaff = async (req, res) => {
  await Staff.findOneAndDelete({
    _id: req.params.id,
    collegeId: req.user.collegeId,
  });

  res.json({ message: "Deleted successfully" });
};