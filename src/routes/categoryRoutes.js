const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategory);
router.get("/trabajadores/:id", categoryController.getCategoryTrabajadores);
router.get("/posts/:id", categoryController.getCategoryPosts);
router.get("/profesiones", categoryController.getProfesiones);

module.exports = router;
