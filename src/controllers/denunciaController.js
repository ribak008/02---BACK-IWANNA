const { select } = require('../utils/consultas');

const validateDenuncia = (req) => {
    const { idPost, idUsuario, tipo_denuncia, detalle_denuncia } = req.body;
    if (!idPost || !idUsuario || !tipo_denuncia || !detalle_denuncia) {
        return 'Todos los campos son requeridos: idPost, idUsuario, tipo_denuncia, detalle_denuncia';
    }
    return null;
};

const createDenunciaPost = async (req, res) => {
    console.log('Creando denuncia con datos:', req.body);
    const validationError = validateDenuncia(req);
    if (validationError) {
        return res.status(400).json({ exito: false, mensaje: validationError });
    }

    const { idPost, idUsuario, tipo_denuncia, detalle_denuncia } = req.body;
    try {
        const sql = `INSERT INTO form_denuncia_post (id_post, id_usuario, tipo_denuncia, detalle_denuncia) VALUES (?, ?, ?, ?)`;
        const resultado = await select(sql, [idPost, idUsuario, tipo_denuncia, detalle_denuncia]);
        
        if (!resultado) {
            return res.status(500).json({ exito: false, mensaje: 'Error al crear la denuncia' });
        }
        
        res.json({ 
            exito: true, 
            mensaje: 'Denuncia creada exitosamente',
            id_post: idPost,
            id_usuario: idUsuario
        });
    } catch (err) {
        console.error('Error al crear denuncia:', err);
        res.status(500).json({ 
            exito: false, 
            mensaje: 'Error interno del servidor',
            error: err.message 
        });
    }
};

const createDenunciaTrabajador = async (req, res) => {
    console.log('Creando denuncia con datos:', req.body);
    const { idTrabajador, idUsuario, tipo_denuncia, detalle_denuncia } = req.body;
    
    // Validate required fields
    if (!idTrabajador || !idUsuario || !tipo_denuncia || !detalle_denuncia) {
        return res.status(400).json({ 
            exito: false, 
            mensaje: 'Todos los campos son requeridos: idTrabajador, idUsuario, tipo_denuncia, detalle_denuncia' 
        });
    }

    try {
        const sql = `INSERT INTO form_denuncia_trabajador (id_trabajador, id_usuario, tipo_denuncia, detalle_denuncia) VALUES (?, ?, ?, ?)`;
        const resultado = await select(sql, [idTrabajador, idUsuario, tipo_denuncia, detalle_denuncia]);
        
        if (!resultado) {
            return res.status(500).json({ exito: false, mensaje: 'Error al crear la denuncia' });
        }
        
        res.json({ 
            exito: true, 
            mensaje: 'Denuncia creada exitosamente',
            id_trabajador: idTrabajador,
            id_usuario: idUsuario
        });
    } catch (err) {
        console.error('Error al crear denuncia:', err);
        res.status(500).json({ 
            exito: false, 
            mensaje: 'Error interno del servidor',
            error: err.message 
        });
    }
};

module.exports = {
    createDenunciaPost,
    createDenunciaTrabajador
};
