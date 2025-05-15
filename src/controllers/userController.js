const { select } = require('../utils/consultas');

const getUsuarios = async (req, res) => {
    try {
        const sql_usuarios = "SELECT * FROM usuario" 
        const usuarios = await select(sql_usuarios);
        res.json(usuarios);
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const getUsuarioPorEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const sql = `-- sql Usuario por email
                    SELECT u.id,
                        u.nombre,
                        u.email,
                        u.telefono,
                        u.rut,
                        u.edad,
                        u.id_sexo,
                        u.descripcion,
                        u.id_profesion,
                        u.id_estado,
                        u.id_tipo,
                        u.foto,
                        CONCAT(c.descripcion,' ',r.descripcion) as 'direccion'
                    FROM usuario u
                    JOIN comuna c ON c.id = u.id_comuna
                    JOIN region r ON r.id = c.id_region
                    WHERE u.email = ?`; 
        const usuario = await select(sql,email);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioPorEmail
}