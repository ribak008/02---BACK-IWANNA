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
                        d.descripcion as "direccion"
                    FROM usuario u
                    JOIN direccion_usuario d ON d.id = u.id
                    WHERE u.email = ?`; 
        const usuario = await select(sql,email);
        console.log(usuario);
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