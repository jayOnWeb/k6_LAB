const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    // 🔹 Input fields
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    vus: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    // 🔹 Output fields
    avgResponseTime: {
      type: Number,
      required: true,
    },
    maxResponseTime: {
      type: Number,
      required: true,
    },
    failureRate: {
      type: Number,
      required: true,
    },
    healthStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt auto
  }
);

module.exports = mongoose.model("TestResult", testResultSchema);