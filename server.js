// server.js
const express = require('express');
const app = express();
const port = 3000; // Puerto en el que estará corriendo tu API

// Middleware para manejar JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola desde la API!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`);
});

app.get('/usuarios', (req, res) => {
  const usuarios = [
    { id: 1, nombre: 'Juan' },
    { id: 2, nombre: 'Ana' },
  ];
  res.json(usuarios);  // Responde con un JSON de usuarios
});