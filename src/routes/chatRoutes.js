const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController')

router.get('/', chatController.getChat);
router.get('/trabajador/:id', chatController.getChatsByIdTrabajador);
router.get('/cliente/:id', chatController.getChatsByIdCliente);
router.get('/mensajes/:id', chatController.getMensajes);
router.post('/mensajes/enviar', chatController.postMensaje);

module.exports = router;
