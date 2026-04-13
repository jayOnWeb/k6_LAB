const express = require("express");
const router = express.Router();

const { runTest, getTestResults, getSingleTest, deleteTest } = require("../controllers/testController");

// NEW ROUTE
router.post("/run-test", runTest);
router.get("/test/results", getTestResults);
router.get("/test/:id", getSingleTest);
router.delete("/test/:id", deleteTest);

module.exports = router;