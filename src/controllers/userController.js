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

module.exports = {
    getUsuarios
}