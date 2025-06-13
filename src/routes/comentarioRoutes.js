const express = require('express');
const router = express.Router();

const postController = require('../controllers/comentarioController')

router.get('/post/:postId/', postController.getComentarioByPost);
router.post('/post/:postId/', postController.crearComentario);
router.get('/respuesta/:comentarioId/', postController.getRespuestaByComentario);
router.post('/respuesta/:comentarioId/', postController.crearRespuestaComentario);

module.exports = router;