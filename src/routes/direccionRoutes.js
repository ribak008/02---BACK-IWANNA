const express = require('express');
const router = express.Router();

const direccionController = require('../controllers/direccionController')

router.put('/:id', direccionController.insertDireccion);


module.exports = router;
