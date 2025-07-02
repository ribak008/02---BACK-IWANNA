const { select } = require("../utils/consultas");

const getPerfil = async (req, res) => {
  const id_usuario = req.params.id;
  try {
    const sql_perfil = `SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.telefono,
    u.rut,
    u.edad,
    u.id_sexo,
    s.descripcion as sexo,
    u.descripcion AS descripcion_usuario,
    u.id_profesion,
    pr.descripcion AS profesion,
    u.id_estado,
    u.id_tipo,
    u.foto,
    u.id_auth,
    d.descripcion as "direccion",
    u.fecha_creacion
FROM usuario u
LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
LEFT JOIN profesion pr ON u.id_profesion = pr.id
LEFT JOIN sexo s ON u.id_sexo = s.id
WHERE u.id = ?`;

    const [perfil] = await select(sql_perfil, [id_usuario]);

    if (!perfil) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(perfil);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

module.exports = {
  getPerfil,
};
