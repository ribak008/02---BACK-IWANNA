const axios = require("axios");
require("dotenv").config();
const { select } = require('../../utils/consultas');


const postFotoPerfil = async (req, res) => {
    try {
        const archivo = req.file;
        const id_user = req.body.id_user;
        
        const bucket = process.env.NOMBRE_BUCKET;
        const nombreUnico = `${id_user}-foto-perfil`;
        const urlS3 = `https://${bucket}.s3.amazonaws.com/foto-perfil/${nombreUnico}`;

        await axios.put(urlS3, archivo.buffer, {
            headers: {
                "Content-Type": archivo.mimetype,
            }
        });

        const resultado = await actualizarFotoUsuario(id_user, nombreUnico);
        if (!resultado) {
        return res.status(500).json({ exito: false, error: "No se pudo actualizar la BD" });
        }

        res.status(200).json({ exito: true, url: urlS3 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al subir imagen" });
    }
};

async function actualizarFotoUsuario(id_user, urlFoto) {
    const sql = `
        UPDATE usuario
        SET foto = ?
        WHERE id = ?
    `;
    const resultado = await select(sql, [urlFoto, id_user]);
    return resultado;
}

module.exports = {
    postFotoPerfil
}