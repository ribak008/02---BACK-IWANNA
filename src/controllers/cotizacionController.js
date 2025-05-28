const { select } = require("../utils/consultas");

const createCotizacion = async (req, res) => {
  const { id_cliente, asunto, descripcion, direccion, id_trabajador } =
    req.body;
  try {
    const sql = `
        INSERT INTO cotizacion_usuario (id_cliente, asunto, descripcion, direccion, f_creacion, id_trabajador) 
        VALUES (?, ?, ?, ?, NOW(), ?)`;
    const cotizacion = await select(sql, [
      id_cliente,
      asunto,
      descripcion,
      direccion,
      id_trabajador,
    ]);
    res.json(cotizacion);
  } catch (err) {
    console.error("Error al crear cotización:", err);
    res.status(500).json({ error: "Error al crear cotización" });
  }
};

module.exports = {
  createCotizacion,
};
