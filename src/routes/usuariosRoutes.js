const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/userController')

router.get('/usuarios', usuarioController.getUsuarios);

module.exports = router;