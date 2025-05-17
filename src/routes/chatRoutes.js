const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController')

router.get('/', chatController.getChats);
router.get('/:id', chatController.getChatById);
router.get('/mensajes/:id', chatController.getMensajes);

module.exports = router;
