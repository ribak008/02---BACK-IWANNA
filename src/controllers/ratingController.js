const { select, insert, update } = require("../utils/consultas");

const createRating = async (req, res) => {
  const { id_cotizacion, id_trabajador, puntuacion, comentario } = req.body;

  try {
    const sql = `
        INSERT INTO puntuacion_trabajador (
    id_cotizacion, 
    id_trabajador, 
    puntuacion, 
    comentario
) VALUES (
    ?, 
    ?, 
    ?, 
    ?
);`;

    const respuesta = await select(sql, [
      id_cotizacion,
      id_trabajador,
      puntuacion,
      comentario,
    ]);

    res.status(201).json({
      message: "Puntuación de trabajador creada exitosamente",
      respuesta,
    });
  } catch (err) {
    console.error("Error al crear puntuación de trabajador:", err);
    res.status(500).json({ error: "Error al crear puntuación de trabajador" });
  }
};

const getAverageRating = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
    id_trabajador,
    ROUND(AVG(puntuacion), 2) AS promedio_estrellas,
    COUNT(*) AS total_valoraciones
FROM puntuacion_trabajador
WHERE id_trabajador = ?
GROUP BY id_trabajador;
    `;

    const respuesta = await select(sql, [id]);

    if (respuesta.length === 0) {
      return res.status(200).json({
        id_trabajador: id,
        promedio_estrellas: 0,
        total_valoraciones: 0,
      });
    }

    res.status(200).json({
      id_trabajador: respuesta[0].id_trabajador,
      promedio_estrellas: Number(respuesta[0].promedio_estrellas),
      total_valoraciones: Number(respuesta[0].total_valoraciones),
    });
  } catch (err) {
    console.error("Error al obtener promedio de puntuación:", err);
    res.status(500).json({ error: "Error al obtener promedio de puntuación" });
  }
};

const getRating = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT puntuacion, comentario, fecha_valoracion
      FROM puntuacion_trabajador
      WHERE id_cotizacion = ?
    `;

    const respuesta = await select(sql, [id]);

    if (respuesta.length === 0) {
      return res.status(200).json({
        puntuada: false,
        mensaje: "La cotización no ha sido puntuada",
      });
    }

    res.status(200).json({
      puntuada: true,
      puntuacion: Number(respuesta[0].puntuacion),
      comentario: respuesta[0].comentario,
      fecha_valoracion: respuesta[0].fecha_valoracion,
    });
  } catch (err) {
    console.error("Error al verificar la puntuación:", err);
    res.status(500).json({ error: "Error al verificar la puntuación" });
  }
};

module.exports = {
  createRating,
  getAverageRating,
  getRating,
};
