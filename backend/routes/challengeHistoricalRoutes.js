const express = require('express');
const { getParticipants, joinChallenge } = require('../controllers/challengeHistoricalController');

const router = express.Router();

// Route: GET list of participants
router.get('/:id/participants', getParticipants);

// Route: POST user joins challenge
router.post('/join', joinChallenge);

module.exports = router;
