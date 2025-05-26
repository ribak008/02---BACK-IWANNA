
const { select } = require('../utils/consultas');


const getPosts = async (req, res) => {
    try {
        const sql_posts = `-- sql getPosts
        SELECT 
            p.id,
            p.detalle,
            p.archivo,
            p.fecha_creacion,
            CONCAT(u.nombre,' ',u.apellido) as "nombre",
            u.foto
        FROM post p 
        JOIN usuario u ON u.id = p.id_usuario`;
        const posts = await select(sql_posts);
        res.json(posts);
    } catch (err) {
        console.error('Error al consultar posts:', err);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};

const getPostByUser = async (req, res) => {
    try {
        const id_usuario = req.params.userId;
        console.log(req.params)
        const sql_posts = `-- sql getPostsById
            SELECT 
                p.id,
                p.detalle,
                p.archivo,
                p.fecha_creacion,
                CONCAT(u.nombre,' ',u.apellido) as "nombre",
                u.foto
            FROM post p 
            JOIN usuario u ON u.id = p.id_usuario
            WHERE u.id = ?`;
        const posts = await select(sql_posts,[id_usuario]);
        res.json(posts);
    } catch (err) {
        console.error('Error al consultar posts:', err);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};

const getPostByCategory = async (req, res) => {
    const id = req.params.categoryId;
    console.log(req.params)
    try {
        const sql = 
        `SELECT
            p.id,
                p.detalle,
                p.archivo,
                p.fecha_creacion,
                CONCAT(u.nombre,' ',u.apellido) as "nombre",
                u.foto
        
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
    getPostByUser,
    getPostByCategory
}