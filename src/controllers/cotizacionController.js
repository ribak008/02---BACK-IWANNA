const { select } = require("../utils/consultas");

const createCotizacion = async (req, res) => {
  const { id_cliente, asunto, descripcion, direccion, id_trabajador } =
    req.body;
  try {
    const sql = `
        INSERT INTO cotizacion_usuario (id_cliente, id_trabajador, asunto, descripcion, direccion, f_creacion) 
        VALUES (?, ?, ?, ?, ?, NOW())`;
    const cotizacion = await select(sql, [
      id_cliente,
      id_trabajador,
      asunto,
      descripcion,
      direccion,
    ]);

    //Crear datos en la tabla chat
    try {
      const sql_chat = `
    SELECT id
    FROM chat
    WHERE id_cliente = ? AND id_trabajador = ?;
    `;
      const get_chat = await select(sql_chat, [id_cliente, id_trabajador]);
      console.log("chat encontrado: ", get_chat);

      if (get_chat.length == 0) {
        console.log(
          "no se encontro chat, insertando los datos: ",
          id_cliente,
          id_trabajador
        );
        try {
          const sql = `
        INSERT INTO chat (id_cliente, id_trabajador, f_creacion, id_estado) 
        VALUES (?, ?, NOW(), 1);`;
          const chat = await select(sql, [id_cliente, id_trabajador]);
          console.log("chat creado: ", chat);
        } catch (error) {
          console.error("Error al crear chat:", error);
          res.status(500).json({ error: "Error al crear chat" });
        }
      }
    } catch (err) {
      console.error("Error al crear chat:", err);
      res.status(500).json({ error: "Error al crear chat" });
    }

    res.json(cotizacion);
  } catch (err) {
    console.error("Error al crear cotización:", err);
    res.status(500).json({ error: "Error al crear cotización" });
  }
};

const createRespuestaCot = async (req, res) => {
  const { id_cotizacion, mensaje, valor_estimado } = req.body;

  try {
    const sql = `
      INSERT INTO respuesta_cotizacion (id_cotizacion, mensaje, valor_estimado, fecha_respuesta) 
      VALUES (?, ?, ?, NOW())`;

    const respuesta = await select(sql, [
      id_cotizacion,
      mensaje,
      valor_estimado,
    ]);

    res.status(201).json({
      message: "Respuesta a cotización creada exitosamente",
      respuesta,
    });
  } catch (err) {
    console.error("Error al crear respuesta de cotización:", err);
    res.status(500).json({ error: "Error al crear respuesta de cotización" });
  }
};

const createRechazoCot = async (req, res) => {
  const { id_cotizacion, motivo, rechazado_por } = req.body;

  try {
    const sql = `
      INSERT INTO rechazo_cotizacion (id_cotizacion, motivo, fecha_rechazo,rechazado_por)
      VALUES (?, ?, NOW(),?)`;

    const respuesta = await select(sql, [id_cotizacion, motivo, rechazado_por]);

    res.status(201).json({
      message: "Rechazo de cotización creado exitosamente",
      respuesta,
    });
  } catch (err) {
    console.error("Error al crear rechazo de cotización:", err);
    res.status(500).json({ error: "Error al crear rechazo de cotización" });
  }
};
//---------------------------------------------------------------------------------------
const updateRespondido = async (req, res) => {
  const { id } = req.params;
  const { id_estado } = req.body;

  console.log("id: ", id);
  console.log("id_estado: ", id_estado);

  if (!id_estado) {
    return res.status(400).json({
      message: "El id_estado es requerido",
    });
  }

  try {
    // activar el chat si id_estado es 4
    console.log("activando el chat");
    // Get chat data
    const sql_chat = `
        SELECT id_cliente, id_trabajador
        FROM cotizacion_usuario
        WHERE id = ?`;

    const datos_chat = await select(sql_chat, [id]);

    if (!datos_chat || datos_chat.length === 0) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    console.log("datos_chat: ", datos_chat[0]);

    if (id_estado === 4) {
      // activar el chat
      const sql = `
        UPDATE chat 
        SET id_estado = ?
        WHERE id_cliente = ? AND id_trabajador = ?`;

      await select(sql, [
        id_estado,
        datos_chat[0].id_cliente,
        datos_chat[0].id_trabajador,
      ]);
      console.log("Chat activado correctamente");
    }

    if (id_estado === 5) {
      // Desactivar el chat
      const sql = `
        UPDATE chat 
        SET id_estado = ?
        WHERE id_cliente = ? AND id_trabajador = ?`;

      await select(sql, [
        id_estado,
        datos_chat[0].id_cliente,
        datos_chat[0].id_trabajador,
      ]);
      console.log("Chat desactivado correctamente");
    }

    // activar la cotizacion
    const sql_update = `
      UPDATE cotizacion_usuario 
      SET id_estado = ?
      WHERE id = ?`;

    const resultado = await select(sql_update, [id_estado, id]);
    console.log("Cotización actualizada correctamente");

    res.json({
      success: true,
      message: "Estado actualizado correctamente",
      data: resultado,
    });
  } catch (err) {
    console.error("Error al actualizar el estado:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Error al actualizar el estado",
        details: err.message,
      });
    }
  }
};

// ------------------------------------------------------------------------------------------------------------------------

const getRespuestaId = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `
      SELECT 
        rc.id,
        rc.id_cotizacion,
        rc.mensaje,
        rc.valor_estimado,
        rc.fecha_respuesta
      FROM respuesta_cotizacion rc
      WHERE rc.id_cotizacion = ?
      LIMIT 1`;

    const [respuesta] = await select(sql, [id]);

    if (!respuesta) {
      return res.status(404).json({
        message: "No se encontró la respuesta con el ID especificado",
      });
    }

    res.json(respuesta);
  } catch (err) {
    console.error("Error al consultar la respuesta:", err);
    res.status(500).json({ error: "Error al obtener la respuesta" });
  }
};

const getRechazo = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `
      SELECT 
        rc.id AS id_rechazo,
        rc.motivo,
        rc.fecha_rechazo,
        cu.id AS id_cotizacion,
        cu.id_cliente,
        u.nombre AS nombre_cliente,
        u.apellido AS apellido_cliente,
        cu.id_trabajador,
        cu.asunto,
        cu.descripcion,
        cu.direccion,
        cu.f_creacion,
        cu.id_estado,
        rc.rechazado_por
      FROM rechazo_cotizacion rc
      JOIN cotizacion_usuario cu ON rc.id_cotizacion = cu.id
      JOIN usuario u ON cu.id_cliente = u.id
      WHERE cu.id = ?`;

    const [rechazo] = await select(sql, [id]);

    if (!rechazo) {
      return res.status(404).json({
        message: "No se encontró el rechazo para la cotización especificada",
      });
    }

    res.json(rechazo);
  } catch (err) {
    console.error("Error al consultar el rechazo:", err);
    res.status(500).json({ error: "Error al obtener el rechazo" });
  }
};

const getCotizaciones = async (req, res) => {
  const id_trabajador = req.params.trabajador;
  try {
    const sql = `
      SELECT 
        cu.id,
        cu.id_cliente,
        u.nombre AS nombre_cliente,
        u.apellido AS apellido_cliente,
        cu.id_trabajador,
        cu.asunto,
        cu.descripcion,
        cu.direccion,
        cu.f_creacion,
        cu.id_estado
      FROM cotizacion_usuario cu
      JOIN usuario u ON cu.id_cliente = u.id
      WHERE cu.id_trabajador = ?
      ORDER BY cu.f_creacion DESC`;

    const cotizaciones = await select(sql, [id_trabajador]);

    if (cotizaciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron cotizaciones" });
    }

    res.json(cotizaciones);
  } catch (err) {
    console.error("Error al consultar cotizaciones:", err);
    res.status(500).json({ error: "Error al obtener cotizaciones" });
  }
};

const getCotizacionesCli = async (req, res) => {
  const id_cliente = req.params.cliente;
  try {
    const sql = `
      SELECT 
    cu.id AS id_cotizacion,
    cu.asunto,
    cu.descripcion,
    cu.direccion,
    cu.f_creacion,
    cu.id_estado,
    
    u.id AS id_cliente,
    u.nombre,
    u.apellido,
    u.email,
    u.telefono,
    u.rut,
    u.edad,
    d.descripcion AS direccion_cliente

FROM cotizacion_usuario cu
JOIN usuario u ON cu.id_cliente = u.id
LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
WHERE cu.id_cliente = ?
ORDER BY cu.f_creacion DESC;`;

    const cotizaciones = await select(sql, [id_cliente]);

    if (cotizaciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron cotizaciones" });
    }

    res.json(cotizaciones);
  } catch (err) {
    console.error("Error al consultar cotizaciones:", err);
    res.status(500).json({ error: "Error al obtener cotizaciones" });
  }
};

const getCotizacionesId = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `
      SELECT 
        cu.id,
        cu.id_cliente,
        u.nombre AS nombre_cliente,
        u.apellido AS apellido_cliente,
        cu.id_trabajador,
        cu.asunto,
        cu.descripcion,
        cu.direccion,
        cu.f_creacion,
        cu.id_estado
      FROM cotizacion_usuario cu
      JOIN usuario u ON cu.id_cliente = u.id
      WHERE cu.id = ?
      LIMIT 1`;

    const [cotizacion] = await select(sql, [id]);

    if (!cotizacion) {
      return res.status(404).json({
        message: "No se encontró la cotización con el ID especificado",
      });
    }

    res.json(cotizacion);
  } catch (err) {
    console.error("Error al consultar la cotización:", err);
    res.status(500).json({ error: "Error al obtener la cotización" });
  }
};

const getTrabajosTerminados = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `
      SELECT COUNT(id) as total_trabajos_terminados 
      FROM cotizacion_usuario 
      WHERE id_trabajador = ? AND id_estado = 5`;

    const [respuesta] = await select(sql, [id]);

    res.status(200).json({
      id_trabajador: id,
      total_trabajos_terminados: Number(
        respuesta.total_trabajos_terminados || 0
      ),
      mensaje: "Conteo de trabajos terminados obtenido exitosamente",
    });
  } catch (err) {
    console.error("Error al obtener conteo de trabajos terminados:", err);
    res
      .status(500)
      .json({ error: "Error al obtener conteo de trabajos terminados" });
  }
};

module.exports = {
  createCotizacion,
  getCotizaciones,
  getCotizacionesId,
  createRespuestaCot,
  updateRespondido,
  getRespuestaId,
  getCotizacionesCli,
  createRechazoCot,
  getRechazo,
  getTrabajosTerminados,
};
