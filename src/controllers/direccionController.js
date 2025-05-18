const { select } = require('../utils/consultas');


const insertDireccion = async (req, res) => {
    const {descripcion,latitud,longitud} = req.body;
    const id = req.params.id;

    // Validación mínima de datos
    if (!id || !descripcion || latitud === undefined || longitud === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const sql = `-- sql nombre
            INSERT INTO direccion_usuario (id,descripcion,latitud, longitud)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                descripcion = VALUES(descripcion),
                latitud = VALUES(latitud),
                longitud = VALUES(longitud);
            `; 
        const respuesta = await select(sql,[id,descripcion,latitud,longitud]);
        
        if (respuesta?.affectedRows > 0) {
            return res.json({ mensaje: 'Dirección guardada correctamente' });
        } else {
            return res.status(200).json({ mensaje: 'No se realizaron cambios' });
        }
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};






module.exports = {
    insertDireccion
}