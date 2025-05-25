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
                    LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
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
    const { nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna } = req.body;
    try {
        const sql = `INSERT INTO usuario (nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const usuario = await select(sql, [nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna]);
        res.json(usuario);
    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const createUserPrueba = async (req, res) => {
    const {nombre,apellido,email,telefono,rut,id_sexo,id_estado,id_tipo,edad} = req.body;
    try {
        const sql = `insert into usuario (nombre,apellido,email,telefono,rut,id_sexo,id_estado,id_tipo,edad) values (?,?,?,?,?,?,?,?,?);`;
        const usuario = await select(sql,[nombre,apellido,email,telefono,rut,id_sexo,id_estado,id_tipo,edad]);
        res.json(usuario);
    } catch (err) {
        console.error('Error al crear usuario desde userprueba:', err);
        res.status(500).json({ error: 'Error al crear usuario' });
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