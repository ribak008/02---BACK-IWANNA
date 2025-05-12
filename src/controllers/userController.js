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
                    SELECT * 
                    FROM usuario u
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