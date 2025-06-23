// services/filtroPalabras.js
const { select } = require('../utils/consultas');

const contienePalabraProhibida = async (texto) => {
    try {
        const palabras = await select("SELECT palabra FROM palabras_prohibidas");

        const textoNormalizado = texto.toLowerCase();

        for (const row of palabras) {
            const palabra = row.palabra.toLowerCase();

            const regex = new RegExp(`\\b${palabra}\\b`, 'i');

            if (regex.test(textoNormalizado)) {
                return true; 
            }
        }

        return false; 
    } catch (error) {
        console.error('Error al verificar palabras prohibidas:', error);
        return true; 
    }
};

module.exports = { contienePalabraProhibida };
