const { insert, select } = require('../../utils/consultas');
require("dotenv").config();
const axios = require('axios');

const postPublicacion = async (req, res) => {
    try {
        const archivo = req.file;
        const { id_user, descripcion } = req.body;

        if (!archivo || !descripcion || !id_user) {
            return res.status(400).json({ exito: false, error: "Faltan datos" });
        }

        // 1. Crear publicación en la base de datos
        const id_publicacion = await crearPublicacion(descripcion, id_user);

        // 2. Generar nombre y ruta del archivo
        const extension = archivo.originalname.split('.').pop();
        const nombreArchivo = `${id_user}_${id_publicacion}_publicacion.${extension}`;
        const ruta = `publicaciones/${nombreArchivo}`;

        // 3. Construir la URL pública en S3
        const bucket = process.env.NOMBRE_BUCKET;
        const region = process.env.AWS_REGION;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${ruta}`;

        // 4. Subir archivo a S3 público
        const response = await axios.put(url, archivo.buffer, {
            headers: {
                'Content-Type': archivo.mimetype,
                'Content-Length': archivo.size
            },
            maxBodyLength: Infinity,
        });

        if (response.status !== 200) {
            return res.status(500).json({ exito: false, error: "Falló subida a S3" });
        }

        // 5. Actualizar publicación con el nombre del archivo
        await actualizarPublicacion(nombreArchivo, id_publicacion);

        // 6. Responder con URL pública
        return res.status(200).json({ exito: true, url });

    } catch (error) {
        console.error("Error al subir directo sin SDK:", error.response?.data || error.message);
        return res.status(500).json({ exito: false, error: "Error interno al subir archivo" });
    }
};

async function actualizarPublicacion(urlArchivo, id_archivo) {
    const sql = `UPDATE post SET archivo = ? WHERE id = ?`;
    const resultado = await select(sql, [urlArchivo, id_archivo]);
    return resultado;
}

async function crearPublicacion(detalle, id_user) {
    const sql = `INSERT INTO post (detalle, fecha_creacion, id_usuario) VALUES (?, CURDATE(), ?)`;
    const resultado = await insert(sql, [detalle, id_user]);
    return resultado.insertId;
}

module.exports = {
    postPublicacion
};
