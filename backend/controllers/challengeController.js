// controllers/challengeController.js
const { db } = require('../config/firebase');
const challengeCollection = db.collection('Challenge');

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
      Created_at: new Date()
    };

    const docRef = await challengeCollection.add(newChallenge);
    res.status(201).json({ id: docRef.id, message: 'Challenge created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create challenge', error: error.message });
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const snapshot = await challengeCollection.get();
    const challenges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get challenges', error: error.message });
  }
};

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

const deleteChallenge = async (req, res) => {
  try {
    await challengeCollection.doc(req.params.id).delete();
    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete challenge', error: error.message });
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  updateChallenge,
  deleteChallenge
};
