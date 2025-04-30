// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 4000; // Usa el puerto definido en el entorno o el 3000 por defecto

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});