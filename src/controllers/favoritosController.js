const { select, insert, update } = require('../utils/consultas');


const getFavoritosPost = async (req, res) => {

    console.log('se llamo a favoritos post');
    const id = req.params.id;
    console.log(req.params);
    try {
      const sql = `SELECT
                  p.id,
                  p.detalle,
                  p.archivo,
                  p.fecha_creacion,
                  u.nombre,
                  u.apellido,
                  u.foto,
                  fp.id_estado
          
          FROM post p
          JOIN usuario u ON u.id = p.id_usuario  
          JOIN fav_post fp ON fp.id_post = p.id
          WHERE fp.id_estado = 2 AND fp.id_usuario = ?;`;
      const post = await select(sql, [id]);
      console.log(post);
      if (post.length === 0) {
        return res.status(404).json({ message: "Posts favoritos no encontrados" });
      }
      res.json(post);
    } catch (err) {
      console.error("Error al consultar post:", err);
      res.status(500).json({ error: "Error al obtener post" });
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
            return res.status(404).json({ message: 'Trabajadores favoritos no encontrados' });
        }
        res.json(favoritos);
    } catch (err) {
        console.error('Error al consultar favoritos:', err);
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }

};

const createFavoritosPost = async (req, res) => {
    console.log('Llamada a createFavoritosPost con:', req.params);
    const { idPost, idUser } = req.params;
    
    try {
        // First, verify if the post exists
        const postExists = await select('SELECT id FROM post WHERE id = ?', [idPost]);
        if (postExists.length === 0) {
            return res.status(404).json({ 
                exito: false,
                error: 'El post no existe',
                idPost
            });
        }

        // Check if the favorite already exists
        const checkSql = `SELECT * FROM fav_post WHERE id_post = ? AND id_usuario = ?`;
        const exists = await select(checkSql, [idPost, idUser]);
        
        if (exists && exists.length > 0) {
            // Toggle the status between 1 and 2
            const newStatus = exists[0].id_estado === 2 ? 1 : 2;
            const updateSql = `UPDATE fav_post SET id_estado = ? WHERE id_post = ? AND id_usuario = ?`;
            await update(updateSql, [newStatus, idPost, idUser]);
            
            return res.json({ 
                exito: true,
                accion: 'actualizado',
                estado: newStatus,
                idPost,
                idUser
            });
        } else {
            // Insert new favorite with status 1 (active)
            const insertSql = `INSERT INTO fav_post (id_post, id_usuario, id_estado) VALUES (?, ?, 1)`;
            await insert(insertSql, [idPost, idUser]);
            
            return res.json({ 
                exito: true,
                accion: 'creado',
                estado: 1,
                idPost,
                idUser
            });
        }
    } catch (err) {
        console.error('Error en createFavoritosPost:', err);
        return res.status(500).json({ 
            exito: false,
            error: 'Error al procesar la solicitud de favoritos',
            detalle: err.message 
        });
    }
};

const createFavoritosTrabajador = async (req, res) => {
    console.log('Llamada a createFavoritosTrabajador con:', req.params);
    const { idTrabajador, idUser } = req.params;

    try {
        const checkSql = `SELECT * FROM fav_trabajador WHERE id_trabajador = ? AND id_usuario = ?`;
        const favorito = await select(checkSql, [idTrabajador, idUser]);
        
        let result;
        if (favorito) {
            
            const nuevoEstado = favorito.id_estado === 2 ? 1 : 2;
            const updateSql = `UPDATE fav_trabajador SET id_estado = ? WHERE id_trabajador = ? AND id_usuario = ?`;
            result = await update(updateSql, [nuevoEstado, idTrabajador, idUser]);
            return res.json({ 
                exito: true,
                estado: nuevoEstado,
                mensaje: `Favorito ${nuevoEstado === 1 ? 'activado' : 'desactivado'} correctamente`
            });
        } else {
            
            const insertSql = `INSERT INTO fav_trabajador (id_trabajador, id_usuario, id_estado) VALUES (?, ?, 1)`;
            result = await insert(insertSql, [idTrabajador, idUser]);
            return res.json({ 
                exito: true,
                estado: 1,
                mensaje: 'Favorito creado correctamente'
            });
        }
    } catch (err) {
        console.error('Error en createFavoritosTrabajador:', err);
        return res.status(500).json({ 
            exito: false,
            error: 'Error al procesar la solicitud de favoritos',
            detalle: err.message
        });
    }
};

const likePost = async (req, res) => {
    const { idPost } = req.params;
    try {
        const sql = 
        `SELECT COUNT(*) as likes
        FROM fav_post 
        WHERE id_post = ? AND id_estado = 2`;
        const result = await select(sql, [idPost]);
        res.json({ likes: result[0].likes });
    } catch (err) {
        console.error('Error al traer likes:', err);
        res.status(500).json({ error: 'Error al traer likes' });
    }
};

const likeTrabajador = async (req, res) => {
    const { idTrabajador } = req.params;
    try {
        const sql = 
        `SELECT COUNT(*) as likes
        FROM fav_trabajador 
        WHERE id_trabajador = ? AND id_estado = 2`;
        const result = await select(sql, [idTrabajador]);
        res.json({ likes: result[0].likes });
    } catch (err) {
        console.error('Error al traer likes:', err);
        res.status(500).json({ error: 'Error al traer likes' });
    }
};

const likesUserPost = async (req, res) => {
    const { idUser, idPost } = req.params;
    try {
        const sql = 
        `SELECT * 
        FROM fav_post 
        WHERE id_usuario = ? AND id_post = ? AND id_estado = 2`;
        const result = await select(sql, [idUser, idPost]);

        if (result.length === 0) {
            return res.json({ exito: false });
        }
        res.json({ exito: true });
    } catch (err) {
        console.error('Error al traer likes:', err);
        res.status(500).json({ error: 'Error al traer likes' });
    }
};

const likesUserTrabajador = async (req, res) => {
    const { idUser, idTrabajador } = req.params;
    try {
        const sql = 
        `SELECT * 
        FROM fav_trabajador 
        WHERE id_usuario = ? AND id_trabajador = ? AND id_estado = 2`;
        const result = await select(sql, [idUser, idTrabajador]);
        if (result.length === 0) {
            return res.json({ exito: false });
        }
        res.json({ exito: true });
    } catch (err) {
        console.error('Error al traer likes:', err);
        res.status(500).json({ error: 'Error al traer likes' });
    }
};

module.exports = {
    getFavoritosPost,
    getFavoritosTrabajador,
    createFavoritosPost,
    createFavoritosTrabajador,
    likePost,
    likeTrabajador,
    likesUserPost,
    likesUserTrabajador
}
