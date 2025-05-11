const conexion = require('../config/db');

function select(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, resultados) => {
            if (err) {
                return reject(err);
            }
            resolve(resultados);
        });
    });
}

module.exports = { select };
