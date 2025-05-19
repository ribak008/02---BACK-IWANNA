const express = require("express");
const multer = require("multer");

const fotoPerfilController = require("../../controllers/s3/fotoPerfilController");

const router = express.Router();
const upload = multer();

router.post("/foto-perfil", upload.single("foto-perfil"), fotoPerfilController.postFotoPerfil);

module.exports = router;