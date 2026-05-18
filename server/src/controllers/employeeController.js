const Employee = require("../models/Employee");
const asyncHandler = require("../middleware/asyncHandler");

function normalizeEmployeeInput(body, partial = false) {
  const allowed = {};
  const fields = ["name", "email", "department", "skills", "performanceScore", "experience"];

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      allowed[field] = body[field];
    }
  });

  if (typeof allowed.skills === "string") {
    allowed.skills = allowed.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  if (Array.isArray(allowed.skills)) {
    allowed.skills = allowed.skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (allowed.email) {
    allowed.email = String(allowed.email).toLowerCase().trim();
  }

  if (allowed.performanceScore !== undefined) {
    allowed.performanceScore = Number(allowed.performanceScore);
  }

  if (allowed.experience !== undefined) {
    allowed.experience = Number(allowed.experience);
  }

  if (!partial) {
    const required = ["name", "email", "department", "skills", "performanceScore", "experience"];
    const missing = required.filter((field) => {
      if (field === "skills") {
        return !Array.isArray(allowed.skills) || allowed.skills.length === 0;
      }
      return allowed[field] === undefined || allowed[field] === "";
    });

    if (missing.length) {
      const error = new Error(`Missing required field(s): ${missing.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }
  }

  return allowed;
}

function buildSearchQuery(query) {
  const filter = {};
  const { q, department, skill, minScore, maxScore, experience } = query;

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { department: { $regex: q, $options: "i" } },
      { skills: { $regex: q, $options: "i" } }
    ];
  }

  if (department && department !== "All") {
    filter.department = department;
  }

  if (skill) {
    filter.skills = { $regex: skill, $options: "i" };
  }

  if (minScore || maxScore) {
    filter.performanceScore = {};
    if (minScore) filter.performanceScore.$gte = Number(minScore);
    if (maxScore) filter.performanceScore.$lte = Number(maxScore);
  }

  if (experience && experience !== "All") {
    const years = Number(experience);
    if (!Number.isNaN(years)) {
      filter.experience = { $gte: years };
    }
  }

  return filter;
}

const createEmployee = asyncHandler(async (req, res) => {
  const payload = normalizeEmployeeInput(req.body);
  const employee = await Employee.create(payload);
  res.status(201).json(employee);
});

const getEmployees = asyncHandler(async (_req, res) => {
  const employees = await Employee.find().sort({ performanceScore: -1, name: 1 });
  res.json(employees);
});

const searchEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find(buildSearchQuery(req.query)).sort({
    performanceScore: -1,
    name: 1
  });
  res.json(employees);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const payload = normalizeEmployeeInput(req.body, true);
  const employee = await Employee.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(employee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: "Employee removed successfully", id: req.params.id });
});

module.exports = {
  createEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee
};
