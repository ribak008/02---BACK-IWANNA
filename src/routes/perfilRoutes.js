const express = require("express");
const router = express.Router();

const perfilController = require("../controllers/perfilControler");

router.get("/:id", perfilController.getPerfil);

module.exports = router;
