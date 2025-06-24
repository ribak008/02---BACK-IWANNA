const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController')

router.get('/', postController.getPosts);
router.get('/categoria/:categoryId', postController.getPostByCategory);
router.get('/usuario/:userId', postController.getPostByUser);
router.get('/usuario/:userId', postController.getPostByUser);
router.get('/:postId', postController.getPostByPost);
router.patch('/:postId', postController.patchPost);
router.delete('/:postId', postController.deletePost);
router.get('/contador/:id_usuario/:fecha_creacion', postController.contadorPostUser);


module.exports = router;
