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

const insert = async (sql, params) => {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, resultados) => {
            if (err) return reject(err);
            resolve(resultados);
        });
    });
};

const update = (sql, params) => {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, resultados) => {
            if (err) return reject(err);
            resolve(resultados);
        });
    });
};

const deleteQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, resultados) => {
            if (err) return reject(err);
            resolve(resultados);
        });
    });
};
module.exports = { select, insert, update, deleteQuery };
