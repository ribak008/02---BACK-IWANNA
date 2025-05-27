const express = require('express');
const router = express.Router();

const estadoController = require('../controllers/estadoController')

router.get('/success', estadoController.getSuccess);
router.get('/cancel', estadoController.getCancel);

module.exports = router;