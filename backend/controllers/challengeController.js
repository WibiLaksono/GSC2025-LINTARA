const { db } = require('../config/firebase');
const challengeCollection = db.collection('Challenge');

// CREATE
const createChallenge = async (req, res) => {
  try {
    const {
      UserID,
      Description,
      Max_Participant,
      Location,
      Start_date,
      End_date,
      ImageURL,
      Requirements,
      E_certificate_URL,
      Goals
    } = req.body;

    const newChallenge = {
      UserID,
      Description,
      Max_Participant,
      Location,
      Start_date: new Date(Start_date),
      End_date: new Date(End_date),
      ImageURL,
      Requirements,
      E_certificate_URL,
      Goals,
      Created_at: new Date(),
      Deleted_at: null // ← soft delete field
    };

    const docRef = await challengeCollection.add(newChallenge);
    res.status(201).json({ id: docRef.id, message: 'Challenge created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create challenge', error: error.message });
  }
};

// READ (hanya challenge yang belum dihapus)
const getAllChallenges = async (req, res) => {
  try {
    const snapshot = await challengeCollection
      .where("Deleted_at", "==", null)
      .get();

    const challenges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get challenges', error: error.message });
  }
};

// UPDATE
const updateChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const {
      UserID,
      Description,
      Max_Participant,
      Location,
      Start_date,
      End_date,
      ImageURL,
      Requirements,
      E_certificate_URL,
      Goals
    } = req.body;

    const challengeDoc = await challengeCollection.doc(challengeId).get();

    if (!challengeDoc.exists) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const challengeData = challengeDoc.data();

    if (challengeData.Deleted_at) {
      return res.status(400).json({ message: 'Cannot update a deleted challenge' });
    }

    if (challengeData.UserID !== UserID) {
      return res.status(403).json({ message: 'You are not allowed to update this challenge' });
    }

    const updatedData = {
      Description,
      Max_Participant,
      Location,
      Start_date: new Date(Start_date),
      End_date: new Date(End_date),
      ImageURL,
      Requirements,
      E_certificate_URL,
      Goals
    };

    await challengeCollection.doc(challengeId).update(updatedData);
    res.status(200).json({ message: 'Challenge updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update challenge', error: error.message });
  }
};

// SOFT DELETE
const deleteChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const doc = await challengeCollection.doc(challengeId).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    await challengeCollection.doc(challengeId).update({
      Deleted_at: new Date()
    });

    res.status(200).json({ message: 'Challenge soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to soft-delete challenge', error: error.message });
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  updateChallenge,
  deleteChallenge
};
