const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one skill is required"
      }
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: [0, "Performance score cannot be less than 0"],
      max: [100, "Performance score cannot be greater than 100"]
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"]
    }
  },
  { timestamps: true }
);

employeeSchema.index({ department: 1 });
employeeSchema.index({ skills: 1 });
employeeSchema.index({ performanceScore: -1 });

module.exports = mongoose.model("Employee", employeeSchema);
