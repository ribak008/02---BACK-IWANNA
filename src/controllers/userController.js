const { select } = require('../utils/consultas');


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
                        p.descripcion as "profesion",
                        u.id_profesion,
                        u.id_estado,
                        u.id_tipo,
                        u.foto,
                        d.descripcion as "direccion"
                    FROM usuario u
                    LEFT JOIN direccion_usuario d ON d.id = u.id
                    LEFT JOIN profesion p ON p.id = u.id_profesion
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

const createUser = async (req, res) => {
    const { nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna } = req.body;
    
    try {
        const sql = `INSERT INTO usuario (nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Ejecutar la consulta
        const result = await select(sql, [nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna]);
        
        // Enviar respuesta con el ID insertado
        res.json({
            success: true,
            userId: result.insertId, // Asegúrate de que tu función select devuelva el insertId
            message: 'Usuario creado exitosamente'
        });
        
    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear usuario',
            details: err.message 
        });
    }
};

const createUserPrueba = async (req, res) => {
    const { nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo } = req.body;
    
    try {
        // Corregir el número de parámetros (10 valores = 10 ?)
        const sql = `INSERT INTO usuario (nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Asegurarse de que la función select devuelva el resultado de la inserción
        const result = await select(sql, [nombre, apellido, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo]);
        
        // Devolver el ID del usuario creado
        res.json({
            success: true,
            userId: result.insertId, // Asegúrate de que tu función select devuelva el insertId
            message: 'Usuario creado exitosamente'
        });

    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear usuario',
            details: err.message 
        });
    }
}

const updateUser = async (req, res) => {
    const { id, nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_direccion } = req.body;
    try {
        const sql = `-- sql Actualiza usuario
                    UPDATE 
                        usuario 
                    SET 
                        nombre = ?, 
                        email = ?, 
                        telefono = ?, 
                        rut = ?, 
                        edad = ?, 
                        id_sexo = ?, 
                        descripcion = ?, 
                        id_profesion = ?, 
                        id_estado = ?, 
                        id_tipo = ?, 
                        foto = ?, 
                        id_direccion = ? 
                    WHERE 
                        id = ?`;
        const resultado = await select(sql, [nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_direccion, id]);
        
        if (!resultado) {
            return res.status(500).json({ exito: false});
        }
        res.json({exito: true});
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const getUsuarioPorEmailPrueba = async (req, res) => {
    const email = req.params.email;
    try {
        const sql = `SELECT 
                        nombre,
                        apellido,
                        email,
                        telefono,
                        rut,
                        id_sexo,
                        id_estado,
                        id_tipo,
                        edad
                    FROM usuario 
                    WHERE email = ?`; 
        const usuario = await select(sql, email);
        console.log('Usuario encontrado:', usuario); // Log para debugging
        
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (err) {
        console.error('Error al consultar usuario:', err);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

module.exports = {
    getUsuarioPorEmail,
    createUser,
    updateUser,
    createUserPrueba,
    getUsuarioPorEmailPrueba
}