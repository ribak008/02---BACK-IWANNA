
const express = require('express');
const router = express.Router();

const denunciaController = require('../controllers/denunciaController');

// Remove the 'denuncia' base path since it's already handled in server.js
router.post('/post', denunciaController.createDenunciaPost);
router.post('/trabajador', denunciaController.createDenunciaTrabajador);

module.exports = router;
