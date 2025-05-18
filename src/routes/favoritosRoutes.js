const express = require('express');
const router = express.Router();

const favoritosController = require('../controllers/favoritosController')

router.get('/posts/:id', favoritosController.getFavoritosPost);
router.get('/trabajadores/:id', favoritosController.getFavoritosTrabajador);

module.exports = router;