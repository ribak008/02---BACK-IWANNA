const express = require('express');
const router = express.Router();

const postController = require('../controllers/comentarioController')

router.get('/post/:postId/', postController.getComentarioByPost);
router.post('/post/:postId/', postController.crearComentario);
router.get('/post/conteo/:postId/', postController.getCantidadComentarios);
router.get('/respuesta/:comentarioId/', postController.getRespuestaByComentario);
router.post('/respuesta/:comentarioId/', postController.crearRespuestaComentario);
router.get('/respuesta/conteo/:comentarioId/', postController.getCantidadRespuestaComentarios);




module.exports = router;