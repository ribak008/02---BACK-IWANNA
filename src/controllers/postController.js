
const { select } = require('../utils/consultas');


const getPosts = async (req, res) => {
    try {
        const sql_posts = "SELECT * FROM post" 
        const posts = await select(sql_posts);
        res.json(posts);
    } catch (err) {
        console.error('Error al consultar posts:', err);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};

const getPostByCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = 
        `SELECT
            p.id,
            p.titulo,
            p.detalle, 
            p.imagen,
            p.video, 
            p.id_usuario,
            area.id,
            area.descripcion, 
            prof.id, 
            u.id_estado,
            u.foto, 
            p.fecha_creacion,
            u.nombre
        
        FROM post p
        JOIN usuario u ON u.id = p.id_usuario  
        JOIN profesion prof ON prof.id = u.id_profesion 
        JOIN area_profesion area ON area.id = prof.id_area
        WHERE area.id = ?;`;
        const post = await select(sql, [id]);
        if (post.length === 0) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }
        res.json(post);
    } catch (err) {
        console.error('Error al consultar post:', err);
        res.status(500).json({ error: 'Error al obtener post' });
    }
};

module.exports = {
    getPosts,
    getPostByCategory
}