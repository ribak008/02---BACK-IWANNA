const express = require('express');
const router = express.Router();

const favoritosController = require('../controllers/favoritosController')

router.get('/posts/:id', favoritosController.getFavoritosPost);
router.get('/trabajadores/:id', favoritosController.getFavoritosTrabajador);
router.get('/create/post/:idPost/user/:idUser', favoritosController.createFavoritosPost);
router.get('/create/trabajador/:idTrabajador/user/:idUser', favoritosController.createFavoritosTrabajador);
router.get('/likes/post/:idPost', favoritosController.likePost);
router.get('/likes/trabajador/:idTrabajador', favoritosController.likeTrabajador);
router.get('/isliked/user/:idUser/post/:idPost', favoritosController.likesUserPost);
router.get('/isliked/user/:idUser/trabajador/:idTrabajador', favoritosController.likesUserTrabajador);
module.exports = router;