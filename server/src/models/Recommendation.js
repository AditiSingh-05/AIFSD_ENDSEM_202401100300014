const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    mode: {
      type: String,
      enum: ["employee", "rankings"],
      required: true
    },
    model: {
      type: String,
      required: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    source: {
      type: String,
      enum: ["openrouter", "local-fallback"],
      default: "openrouter"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
