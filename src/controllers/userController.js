const { select, insert, update } = require("../utils/consultas");

const getUsuarioPorEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const sql = `
                    SELECT u.id,
                        u.nombre,
                        u.apellido,
                        u.email,
                        u.telefono,
                        u.rut,
                        u.edad,
                        u.id_sexo,
                        u.descripcion,
                        p.descripcion as "profesion",
                        u.id_profesion,
                        u.id_estado,
                        u.id_tipo,
                        u.id_auth,
                        u.foto,
                        d.descripcion as "direccion",
                        u.fecha_creacion
                    FROM usuario u
                    LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
                    LEFT JOIN profesion p ON p.id = u.id_profesion
                    WHERE u.email = ?`;
    const usuario = await select(sql, email);
    console.log(usuario);
    if (usuario.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario[0]);
  } catch (err) {
    console.error("Error al consultar usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getUsuarioIdDatos = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `
    SELECT 
        u.id,
        u.email,
        u.edad,
        u.descripcion as descripcion_usuario,
        pr.descripcion as profesion,
        eu.descripcion as estado_usuario,
        tu.descripcion as tipo_usuario,
        s.descripcion as sexo,
        u.fecha_creacion,
        d.descripcion as "direccion"
      FROM usuario u 
      LEFT JOIN profesion pr ON pr.id = u.id_profesion
      JOIN estado_usuario eu ON eu.id = u.id_estado
      JOIN tipo_usuario tu ON tu.id = u.id_tipo
      join sexo s on s.id = u.id_sexo
      LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
      WHERE u.id = ?;
    `;

    const usuario = await select(sql, [id]);

    if (usuario.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado con el id proporcionado",
      });
    }

    res.status(200).json({
      usuario: usuario[0],
      mensaje: "Usuario encontrado exitosamente",
    });
  } catch (err) {
    console.error("Error al consultar usuario por id:", err);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
};

const createUser = async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    rut,
    edad,
    id_sexo,
    descripcion,
    id_profesion,
    id_estado,
    id_tipo,
    id_auth
  } = req.body;

  try {
    const sql = `INSERT INTO usuario (nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo,id_auth) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,1)`;

    // Ejecutar la consulta
    const result = await insert(sql, [
      nombre,
      apellido,
      email,
      telefono,
      rut,
      edad,
      id_sexo,
      descripcion,
      id_profesion,
      id_estado,
      id_tipo,
      id_auth,
    ]);

    // Enviar respuesta con el ID insertado
    res.json({
      success: true,
      userId: result.insertId, // Asegúrate de que tu función select devuelva el insertId
      message: "Usuario creado exitosamente",
    });
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({
      success: false,
      error: "Error al crear usuario",
      details: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  const {
    id,
    nombre,
    apellido,
    email,
    telefono,
    rut,
    edad,
    id_sexo,
    descripcion,
    id_profesion,
    id_estado,
    id_tipo,
    id_auth,
    foto,
  } = req.body;
  try {
    const sql = `-- sql Actualiza usuario
                    UPDATE 
                        usuario 
                    SET 
                        nombre = ?, 
                        apellido = ?, 
                        email = ?, 
                        telefono = ?, 
                        rut = ?, 
                        edad = ?, 
                        id_sexo = ?, 
                        descripcion = ?, 
                        id_profesion = ?, 
                        id_estado = ?, 
                        id_tipo = ?, 
                        foto = ?
                    WHERE 
                        id = ?`;
    const resultado = await select(sql, [
      nombre,
      apellido,
      email,
      telefono,
      rut,
      edad,
      id_sexo,
      descripcion,
      id_profesion,
      id_estado,
      id_tipo,
      foto,
      id,
    ]);

    if (!resultado) {
      return res.status(500).json({ exito: false });
    }
    res.json({ exito: true });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const updateSuscripcion = async (req, res) => {
  console.log("Actualizando estado de la suscripción del usuario:", req.body);
  const { userId } = req.body;
  try {
    const sql = `UPDATE usuario SET id_estado = 2 WHERE id = ?`;
    const resultado = await select(sql, [userId]);
    if (!resultado) {
      return res.status(500).json({ exito: false });
    }
    res.json({ exito: true });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const verificacion = async (req, res) => {
  const { userId } = req.body;

  console.log("Verificando usuario:", userId);
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const insertSql = `INSERT INTO form_solicitud_verificado (id_trabajador, id_estado) VALUES (?, 3)`;
    const insertResult = await select(insertSql, [userId]);
    
    if (!insertResult) {
      return res.status(500).json({ exito: false, error: "Failed to create verification request" });
    }

    const updateSql = `UPDATE usuario SET id_auth = 3 WHERE id = ?`;
    const updateResult = await select(updateSql, [userId]);
    
    if (!updateResult) {
      return res.status(500).json({ exito: false, error: "Failed to update user status" });
    }

    res.json({ exito: true });
    
  } catch (error) {
    console.error("Error in verificacion:", error);
    res.status(500).json({ 
      exito: false, 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUsuarioPorEmail,
  createUser,
  updateUser,
  getUsuarioIdDatos,
  updateSuscripcion,
  verificacion,
};
