const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController')

router.get('/', postController.getPosts);
router.get('/:categoryId', postController.getPostByCategory);
router.get('/usuario/:userId', postController.getPostByUser);

module.exports = router;
