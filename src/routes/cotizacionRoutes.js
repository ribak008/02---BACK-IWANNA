const express = require('express');
const router = express.Router();

const cotizacionController = require('../controllers/cotizacionController');

router.post('/create-cotizacion', cotizacionController.createCotizacion);

module.exports = router;







