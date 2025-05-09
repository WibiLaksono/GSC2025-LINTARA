const { db } = require('../config/firebase');
const reportCollection = db.collection("Report");

// CREATE
const createReport = async (req, res) => {
  try {
    const { UserID, ImageURL, Category_trash, Location } = req.body;

    const newReport = {
      UserID,
      ImageURL,
      Category_trash,
      Location,
      Created_at: new Date(),
    };

    const docRef = await reportCollection.add(newReport);
    res.status(201).json({ id: docRef.id, message: "Report created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error: error.message });
  }
};

// READ
const getReports = async (req, res) => {
  try {
    const snapshot = await reportCollection.get();
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reports", error: error.message });
  }
};

// UPDATE
const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { UserID, ImageURL, Category_trash, Location } = req.body;

    const reportDoc = await reportCollection.doc(reportId).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ message: "Report not found" });
    }

    const reportData = reportDoc.data();
    if (reportData.UserID !== UserID) {
      return res.status(403).json({ message: "You are not allowed to update this report" });
    }

    const updatedData = { ImageURL, Category_trash, Location };
    await reportCollection.doc(reportId).update(updatedData);

    res.status(200).json({ message: "Report updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error: error.message });
  }
};

// DELETE
const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { UserID } = req.body;

    const reportDoc = await reportCollection.doc(reportId).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ message: "Report not found" });
    }

    const reportData = reportDoc.data();
    if (reportData.UserID !== UserID) {
      return res.status(403).json({ message: "You are not allowed to delete this report" });
    }

    await reportCollection.doc(reportId).delete();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReport,
  deleteReport
};
