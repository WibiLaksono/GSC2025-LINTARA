const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
  deleteReport,
  countReportsByUserInChallenge
} = require("../controllers/reportController");

router.post("/createReport", createReport);
router.get("/getReports", getReports);
router.put("/updateReport/:id", updateReport);
router.delete("/deleteReport/:id", deleteReport);
router.get("/countByUser/:userId", countReportsByUserInChallenge);

module.exports = router;
