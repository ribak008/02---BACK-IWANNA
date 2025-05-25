const express = require("express");
const multer = require("multer");
const fotoPerfilController = require("../../controllers/s3/fotoPerfilController");
const archivoPostController = require("../../controllers/s3/archivoPostController");


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['video/mp4', 'image/jpeg', 'image/png'];
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de archivo no permitido"));
        }
    }
});

router.post("/foto-perfil", upload.single("foto-perfil"), fotoPerfilController.postFotoPerfil);
router.post("/publicacion", upload.single("publicacion"), archivoPostController.postPublicacion);


module.exports = router;