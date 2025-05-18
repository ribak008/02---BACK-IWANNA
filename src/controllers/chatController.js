const { select } = require('../utils/consultas');


const getChat = async (req, res) => {
    try {
        const sql_chat = "SELECT * FROM chat" 
        const chat = await select(sql_chat);
        res.json(chat);
    } catch (err) {
        console.error('Error al consultar chat:', err);
        res.status(500).json({ error: 'Error al obtener chat' });
    }
};

const getChatsByIdTrabajador = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `
            SELECT 
                ch.id,
                ch.id_cliente,
                ch.id_estado,
                DATE_FORMAT(ch.f_creacion, '%d/%m/%Y') AS f_creacion,
                u.nombre,
                u.id_profesion
            FROM chat ch
            JOIN usuario u ON u.id = ch.id_cliente
            WHERE ch.id_trabajador = ? AND ch.id_estado = 4;
        `;
        const chats = await select(sql, [id]);
        if (chats.length === 0) {
            return res.status(404).json({ message: 'Chats no encontrados' });
        }
        res.json(chats); // Devuelve todos los chats
    } catch (err) {
        console.error('Error al consultar chats:', err);
        res.status(500).json({ error: 'Error al obtener chats' });
    }
};


const getChatsByIdCliente = async (req, res) => {
    const id = req.params.id;
    try {
    
   const sql = 
        `select 
        ch.id_trabajador,
        ch.id_estado,
        DATE_FORMAT(ch.f_creacion, '%d/%m/%Y') AS f_creacion,
        u.nombre,
        u.id_profesion
        from chat ch
        join usuario u on u.id = ch.id_trabajador
        WHERE ch.id_cliente = ? AND ch.id_estado = 4;`;
        const chat = await select(sql, [id]);
        if (chat.length === 0) {
            return res.status(404).json({ message: 'Chat no encontrado' });
        }
        res.json(chat);
    } catch (err) {
        console.error('Error al consultar chat:', err);
        res.status(500).json({ error: 'Error al obtener chat' });
    }
};

//////////////////////////////////////////////////////////////

const getMensajes = async (req, res) => {
    const id = req.params.id;
    try {
    
   const sql = 
        `            SELECT  
        mj.id,
        mj.id_autor,
        mj.id_chat,
        mj.contenido,
        DATE_FORMAT(mj.f_creacion, '%H:%i') AS f_creacion,
        u.nombre,
        u.foto
          
        FROM mensaje_chat mj
        JOIN usuario u ON mj.id_autor = u.id
        JOIN chat ch ON ch.id = mj.id_chat
        WHERE ch.id = ?
        order by mj.id;`;
        const chat = await select(sql, [id]);
        console.log(chat);
        if (chat.length === 0) {
            return res.status(404).json({ message: 'mensajes no encontrados' });
        }
        res.json(chat);
    } catch (err) {
        console.error('Error al consultar los mensajes:', err);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
};

//////////////////////////////////////////////////////////////

const postMensaje = async (req, res) => {
    const { id_chat, id_autor, contenido } = req.body;
    try {
        const sql = `INSERT INTO mensaje_chat (id_chat, id_autor, contenido, f_creacion) VALUES (?, ?, ?, NOW())`;
        const mensaje = await select(sql, [id_chat, id_autor, contenido]);
        res.json(mensaje);
    } catch (err) {
        console.error('Error al insertar mensaje:', err);
        res.status(500).json({ error: 'Error al insertar mensaje' });
    }
};

module.exports = {
    getChat,
    getChatsByIdTrabajador,
    getChatsByIdCliente,
    getMensajes,
    postMensaje
}