const { select } = require('../utils/consultas');

// trar las categorias
const getCategory = async (req, res) => {
    try {
        const sql_category = "SELECT * FROM area_profesion;" 
        const categorias = await select(sql_category);
        console.log(categorias);
        res.json(categorias);
    } catch (err) {
        console.error('Error al consultar categorias:', err);
        res.status(500).json({ error: 'Error al obtener categorias' });
    }
};

module.exports = {
    getCategory
}
