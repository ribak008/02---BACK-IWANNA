const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/userController')

//RUTAS
router.get('/:email', usuarioController.getUsuarioPorEmail);
router.get('/prueba/:email', usuarioController.getUsuarioPorEmailPrueba);
router.post('/create-user', usuarioController.createUser);
router.put('/update-user/:id', usuarioController.updateUser);
router.post('/create-user-prueba', usuarioController.createUserPrueba);

module.exports = router;