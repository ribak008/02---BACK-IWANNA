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

const updateUser = async (req, res) => {
    const { id, nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna } = req.body;
    try {
        const sql = `UPDATE usuario SET nombre = ?, email = ?, telefono = ?, rut = ?, edad = ?, id_sexo = ?, descripcion = ?, id_profesion = ?, id_estado = ?, id_tipo = ?, foto = ?, id_comuna = ? WHERE id = ?`;
        const usuario = await select(sql, [nombre, email, telefono, rut, edad, id_sexo, descripcion, id_profesion, id_estado, id_tipo, foto, id_comuna, id]);
        res.json(usuario);
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};



module.exports = {
    getUsuarios,
    getUsuarioPorEmail,
    createUser,
    updateUser
}