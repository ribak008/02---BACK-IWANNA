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
                        d.descripcion as "direccion"
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
    id_auth,
    direccion,
  } = req.body;

  try {
    const sql = `INSERT INTO usuario (nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo,id_auth,direccion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,1,?)`;

    // Ejecutar la consulta
    const result = await select(sql, [
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
      direccion,
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
  console.log('Actualizando estado de la suscripción del usuario:', req.body);
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


module.exports = {
  getUsuarioPorEmail,
  createUser,
  updateUser,
  updateSuscripcion
};
