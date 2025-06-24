const { select } = require("../utils/consultas");

// trar las categorias
const getCategory = async (req, res) => {
  try {
    const sql_category = "SELECT * FROM area_profesion;";
    const categorias = await select(sql_category);
    res.json(categorias);
  } catch (err) {
    console.error("Error al consultar categorias:", err);
    res.status(500).json({ error: "Error al obtener categorias" });
  }
};

// traer las categorias de los trabajadores
const getCategoryTrabajadores = async (req, res) => {
  const id = req.params.id;
  try {
    const sql_category = `SELECT	
        u.id,
        u.nombre,
        u.apellido,
        u.id_estado,
        u.id_auth,
        u.id_tipo,
        u.foto,
        p.descripcion

        FROM usuario u
        JOIN profesion p on p.id = u.id_profesion
        JOIN area_profesion ap on ap.id = p.id_area
        WHERE ap.id = ?
        ORDER BY u.id_estado DESC , u.id_auth DESC ;`;
    const categorias = await select(sql_category, [id]);
    res.json(categorias);
  } catch (err) {
    console.error("Error al consultar categorias:", err);
    res.status(500).json({ error: "Error al obtener categorias" });
  }
};

const getProfesiones = async (req, res) => {
  try {
    const sql_profesiones = "SELECT * FROM profesion;";
    const profesiones = await select(sql_profesiones);
    res.json(profesiones);
  } catch (err) {
    console.error("Error al consultar profesiones (BACKEND):", err);
    res.status(500).json({ error: "Error al obtener profesiones (BACKEND)" });
  }
};

// traer las categorias de los posts
const getCategoryPosts = async (req, res) => {
  const id = req.params.id;
  try {
    const sql_category = `	
    SELECT	
    p.id,
    p.detalle, 
    p.archivo,
    p.id_usuario,
    ap.id AS id_area_profesion,
    ap.descripcion AS descripcion_area, 
    prof.id AS id_profesion,
    u.id_estado,
    u.foto, 
    p.fecha_creacion,
    u.id_auth,
    u.nombre,
    u.apellido
FROM post p
JOIN usuario u ON u.id = p.id_usuario  
JOIN profesion prof ON prof.id = u.id_profesion 
JOIN area_profesion ap ON ap.id = prof.id_area
WHERE ap.id = ?
ORDER BY p.id DESC;`;
    const categorias = await select(sql_category, [id]);
    res.json(categorias);
  } catch (err) {
    console.error("Error al consultar categorias:", err);
    res.status(500).json({ error: "Error al obtener categorias" });
  }
};

module.exports = {
  getCategory,
  getCategoryTrabajadores,
  getCategoryPosts,
  getProfesiones,
};
