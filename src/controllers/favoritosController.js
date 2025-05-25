const { select } = require('../utils/consultas');


const getFavoritosPost = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `SELECT * FROM favoritos WHERE id_post = ?`;
        const favoritos = await select(sql, [id]);
        if (favoritos.length === 0) {
            return res.status(404).json({ message: 'favoritos no encontrados' });
        }
        res.json(favoritos);
    } catch (err) {
        console.error('Error al consultar favoritos:', err);
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }
};

const getFavoritosTrabajador = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = 
        `
        SELECT 

        u.id,
        u.nombre,
        u.foto,
        p.descripcion,
        ft.id_estado 
        FROM usuario u
        JOIN profesion p on p.id = u.id_profesion 
        JOIN fav_trabajador ft on ft.id_trabajador = u.id
        WHERE ft.id_estado = 2 AND ft.id_usuario = ?
        ;
        `;
        const favoritos = await select(sql, [id]);
        if (favoritos.length === 0) {
            return res.status(404).json({ message: 'favoritos no encontrados' });
        }
        res.json(favoritos);
    } catch (err) {
        console.error('Error al consultar favoritos:', err);
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }
};

module.exports = {
    getFavoritosPost,
    getFavoritosTrabajador
}
