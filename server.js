// server.js
const express = require('express');
const app = express();
const port = 3000; // Puerto en el que estará corriendo tu API
const { select } = require('./models/consultas');
// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola desde la API!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`);
});

app.get('/usuarios', async (req, res) => {
  try {
    const sql_usuarios = "SELECT u.nombre FROM usuario u" 
    const usuarios = await select(sql_usuarios);
    res.json(usuarios);
  } catch (err) {
    console.error('Error al consultar usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});