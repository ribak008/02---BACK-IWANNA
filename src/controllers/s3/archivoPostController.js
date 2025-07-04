const { insert, select, deleteQuery} = require('../../utils/consultas');
const { contienePalabraProhibida} = require('../../utils/palabras_prohibidas');

require("dotenv").config();
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { tmpdir } = require('os');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

function convertirVideoAH264(inputBuffer, outputPath) {
    return new Promise((resolve, reject) => {
        const tempInput = path.join(tmpdir(), `input_${Date.now()}.mp4`);
        fs.writeFileSync(tempInput, inputBuffer);

        ffmpeg(tempInput)
            .videoCodec('libx264')
            .format('mp4')
            .on('end', () => {
                const convertedBuffer = fs.readFileSync(outputPath);
                fs.unlinkSync(tempInput); // Borra temporal
                fs.unlinkSync(outputPath); // Borra temporal
                resolve(convertedBuffer);
            })
            .on('error', reject)
            .save(outputPath);
    });
}

const postPublicacion = async (req, res) => {
    let id_publicacion = null;

    try {
        const archivo = req.file;
        const { id_user, descripcion } = req.body;

        if (!archivo || !descripcion || !id_user) {
            return res.status(400).json({ exito: false, error: "Faltan datos" });
        }

        const tieneProhibida = await contienePalabraProhibida(descripcion);
        if (tieneProhibida) {
            return res.status(400).json({ exito: false, error: "Tu post no cumple con nuestras normas de comunidad" });
        }


        id_publicacion  = await crearPublicacion(descripcion, id_user);

        const extension = archivo.originalname.split('.').pop();
        const nombreArchivo = `${id_user}_${id_publicacion}_publicacion.${extension}`;
        const ruta = `publicaciones/${nombreArchivo}`;

        const bucket = process.env.NOMBRE_BUCKET;
        const region = process.env.AWS_REGION;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${ruta}`;

        let bufferFinal = archivo.buffer;

        if (archivo.mimetype.includes('video')) {
            const outputPath = path.join(tmpdir(), `output_${Date.now()}.mp4`);
            bufferFinal = await convertirVideoAH264(archivo.buffer, outputPath);
        }

        const response = await axios.put(url, bufferFinal, {
            headers: {
                'Content-Type': archivo.mimetype,
                'Content-Length': bufferFinal.length
            },
            maxBodyLength: Infinity,
        });

        if (response.status !== 200) {
            return res.status(500).json({ exito: false, error: "Falló subida a S3" });
        }

        await actualizarPublicacion(nombreArchivo, id_publicacion);

        return res.status(200).json({ exito: true, url });

    } catch (error) {
        if (id_publicacion) {
            try {
                await eliminaPublicacion(id_publicacion);
            } catch (err) {
                console.error("Error al intentar eliminar publicación fallida:", err.message);
            }
        }
        console.error("Error al subir directo sin SDK:", error.response?.data || error.message);
        return res.status(500).json({ exito: false, error: "Error interno al subir archivo" });
    }
};

async function actualizarPublicacion(urlArchivo, id_archivo) {
    const sql = `UPDATE post SET archivo = ? WHERE id = ?`;
    const resultado = await select(sql, [urlArchivo, id_archivo]);
    return resultado;
}

async function eliminaPublicacion(id_archivo) {
    const sql = `DELETE 
                FROM 
                    post
                WHERE 
                    id = ?`;
    const resultado = await deleteQuery(sql, [id_archivo]);
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
