const { runTestService } = require("../services/testService");
const TestResult = require("../models/TestResult");

const runTest = async (req, res) => {
  try {
    const { url, method, vus, duration } = req.body;

    if (!url || !method || !vus || !duration) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({
        error: "Invalid URL"
      });
    }

    const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid HTTP method"
      });
    }

    if (vus <= 0 || vus > 100) {
      return res.status(400).json({
        error: "VUs must be between 1 and 100"
      });
    }

    const durationValue = parseInt(duration);
    if (durationValue <= 0 || durationValue > 60) {
      return res.status(400).json({
        error: "Duration must be between 1s and 60s"
      });
    }

    // 🔥 Run k6
    const result = await runTestService(req.body);

    // 🔥 Extract result
    const {
      avgResponseTime,
      maxResponseTime,
      failureRate,
      healthStatus
    } = result;

    // 🔥 Save to DB
    const savedResult = await TestResult.create({
      url,
      method,
      vus,
      duration,
      avgResponseTime,
      maxResponseTime,
      failureRate,
      healthStatus
    });

    // 🔥 Send response
    res.json({
      message: "Test executed and saved successfully",
      data: savedResult
    });

  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
      details: err.message
    });
  }
};

const getTestResults = async (req, res) => {
  try {
    const { url } = req.query;

    let query = {};

    if (url) {
      query.url = { $regex: url, $options: "i" };
    }

    const results = await TestResult
      .find(query)
      .sort({ createdAt: -1 });

    res.json({
      count: results.length,
      data: results
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch results",
      details: err.message
    });
  }
};

const getSingleTest = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: "Test not found"
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch test",
      details: err.message
    });
  }
};

const deleteTest = async (req, res) => {
  try {
    const result = await TestResult.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: "Test not found"
      });
    }

    res.json({
      message: "Test deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: "Delete failed",
      details: err.message
    });
  }
};

module.exports = {
  runTest,
  getTestResults,
  getSingleTest,
  deleteTest,
};