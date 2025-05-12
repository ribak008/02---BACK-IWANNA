const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/userController')

//RUTAS
router.get('/', usuarioController.getUsuarios);
router.get('/:email', usuarioController.getUsuarioPorEmail);

module.exports = router;