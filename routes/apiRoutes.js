const express = require('express');
const { updateJsonData } = require('../controllers/trelloController');
const router = express.Router();

router.get('/update-data', updateJsonData);

module.exports = router;
