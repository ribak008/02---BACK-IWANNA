const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/userController");

//RUTAS
router.get("/:email", usuarioController.getUsuarioPorEmail);
router.post("/create-user", usuarioController.createUser);
router.put("/update-user/:id", usuarioController.updateUser);
router.get("/datos/:id", usuarioController.getUsuarioIdDatos);

module.exports = router;
