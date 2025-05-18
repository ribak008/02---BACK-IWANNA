const { select } = require('../utils/consultas');


const getChats = async (req, res) => {
    try {
        const sql_chat = "SELECT * FROM chat" 
        const chat = await select(sql_chat);
        res.json(chat);
    } catch (err) {
        console.error('Error al consultar chat:', err);
        res.status(500).json({ error: 'Error al obtener chat' });
    }
};

const getChatById = async (req, res) => {
    const id = req.params.id;
    try {
    
    const sql = 
        `SELECT  
        ch.id_usuario,
        ch.id_chat,
        ch.id_estado,
        u.nombre,
        u.foto
        
        FROM chat ch
        JOIN usuario u ON ch.id_usuario = u.id_usuario 
        WHERE ch.id_usuario = ? AND ch.id_estado = 4;`;
        const chat = await select(sql, [id]);
        if (chat.length === 0) {
            return res.status(404).json({ message: 'Chat no encontrado' });
        }
        res.json(chat[0]);
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
        `SELECT  
        ch.id_usuario,
        ch.id_chat,
        ch.id_estado,
        u.nombre,
        u.foto
          
        FROM chat ch
        JOIN usuario u ON ch.id_usuario = u.id_usuario 
        WHERE ch.id_usuario = ? AND ch.id_estado = 4;`;
        const chat = await select(sql, [id]);
        if (chat.length === 0) {
            return res.status(404).json({ message: 'Chat no encontrado' });
        }
        res.json(chat[0]);
    } catch (err) {
        console.error('Error al consultar chat:', err);
        res.status(500).json({ error: 'Error al obtener chat' });
    }
};

module.exports = {
    getChats,
    getChatById,
    getMensajes
}