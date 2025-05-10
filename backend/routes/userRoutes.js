const express = require('express');
const { editUser, getUserById } = require('../controllers/userControllers');

const router = express.Router();

router.get('/:uid', getUserById);
router.put('/:uid', editUser);

module.exports = router;