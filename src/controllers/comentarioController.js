const { select, update } = require("../utils/consultas");
const { contienePalabraProhibida} = require('../utils/palabras_prohibidas');
const getComentarioByPost = async (req, res) => {
    const id = req.params.postId;
    try {
        const sql = `
            SELECT
                mp.id,
                mp.post_id,
                mp.usuario_id,
                mp.contenido,
                mp.fecha_creacion,
                CONCAT(u.nombre ,' ', u.apellido) AS "nombre_usuario",
                u.foto,
                (SELECT COUNT(*) FROM respuesta_comentario rc WHERE rc.comentario_id = mp.id) AS total_respuestas
            FROM comentario_post mp
            LEFT JOIN usuario u ON u.id = mp.usuario_id
            WHERE mp.post_id = ?
            ORDER BY 1 DESC`;
        const comentarios = await select(sql, [id]);
        if (comentarios.length === 0) {
            return res.status(404).json({ message: "Comentarios no encontrado" });
        }
        res.json(comentarios);
    } catch (err) {
        console.error("Error al consultar comentarios:", err);
        res.status(500).json({ error: "Error al obtener comentarios" });
    }
};

const crearComentario = async (req, res) => {
    const postId = req.params.postId;
    const { usuario_id, contenido } = req.body;

    if (!usuario_id || !contenido) {
        return res.status(400).json({exito:false, error: "Faltan datos requeridos" });
    }

    if (await contienePalabraProhibida(contenido)) {
        return res.status(400).json({exito:false, error: "El comentario contiene palabras no permitidas" });
    }

    try {
        const sql = `INSERT INTO comentario_post (post_id, usuario_id, contenido) VALUES (?, ?, ?)`;
        const result = await update(sql, [postId, usuario_id, contenido]);
        res.status(201).json({exito:true, message: "Comentario creado", id: result.insertId });
    } catch (err) {
        console.error("Error al crear comentario:", err);
        res.status(500).json({exito:false, error: "Error al crear comentario" });
    }
}; 

const crearRespuestaComentario = async (req, res) => {
    const comentarioId = req.params.comentarioId;
    const { usuario_id, contenido } = req.body;

    if (!usuario_id || !contenido) {
        return res.status(400).json({exito: false, error: "Faltan datos requeridos" });
    }
    
    if (await contienePalabraProhibida(contenido)) {
        return res.status(400).json({ exito: false, error: "Tu comentario no cumple con nuestras normas de comunidad" });
    }

    try {
        const sql = `INSERT INTO respuesta_comentario (comentario_id, usuario_id, contenido) VALUES (?, ?, ?)`;
        const result = await update(sql, [comentarioId, usuario_id, contenido]);
        res.status(201).json({exito: true, message: "Comentario creado", id: result.insertId });
    } catch (err) {
        console.error("Error al crear comentario:", err);
        res.status(500).json({exito: false, error: "Error al crear comentario" });
    }
}; 

const getRespuestaByComentario = async (req, res) => {
    const id = req.params.comentarioId;
    try {
        const sql = `
            SELECT
                mp.id,
                mp.comentario_id,
                mp.usuario_id,
                mp.contenido,
                mp.fecha_creacion,
                CONCAT(u.nombre ,' ', u.apellido) AS "nombre_usuario",
                u.foto
            FROM respuesta_comentario mp
            LEFT JOIN usuario u ON u.id = mp.usuario_id
            WHERE mp.comentario_id = ?
            ORDER BY 1 DESC`;
        const respuestas = await select(sql, [id]);
        if (respuestas.length === 0) {
            return res.status(404).json({ message: "Comentarios no encontrado" });
        }
        res.json(respuestas);
    } catch (err) {
        console.error("Error al consultar comentarios:", err);
        res.status(500).json({ error: "Error al obtener comentarios" });
    }
};

const getCantidadComentarios = async (req, res) => {
    const id = req.params.postId;
    try {
        const sql = `
            SELECT
                COUNT(*) AS cantidad_comentarios
            FROM comentario_post cp
            LEFT JOIN usuario u ON u.id = cp.usuario_id
            WHERE cp.post_id = ?
            ORDER BY 1 DESC`;
        const cantidadComentarios = await select(sql, [id]);
        if (cantidadComentarios.length === 0) {
            return res.status(404).json({ message: "Comentarios no encontrado" });
        }
        res.json(cantidadComentarios);
    } catch (err) {
        console.error("Error al consultar comentarios:", err);
        res.status(500).json({ error: "Error al obtener comentarios" });
    }

}

const getCantidadRespuestaComentarios = async (req, res) => {
    const id = req.params.comentarioId;
    try {
        const sql = `
            SELECT
                COUNT(*) AS cantidad_respuestas
            FROM respuesta_comentario rc
            WHERE rc.comentario_id = ?
            ORDER BY 1 DESC`;
        const cantidadRespuestas = await select(sql, [id]);
        if (cantidadRespuestas.length === 0) {
            return res.status(404).json({ message: "Comentarios no encontrado" });
        }
        res.json(cantidadRespuestas);
    } catch (err) {
        console.error("Error al consultar comentarios:", err);
        res.status(500).json({ error: "Error al obtener comentarios" });
    }

}

module.exports = {
    getComentarioByPost,
    crearComentario,
    getRespuestaByComentario,
    crearRespuestaComentario,
    getCantidadComentarios,
    getCantidadRespuestaComentarios,
};
