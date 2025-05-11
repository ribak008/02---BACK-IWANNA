const express = require('express');
const usuarioRutas = require('./routes/usuariosRoutes')
require('dotenv').config();

const app = express();

app.use(express.json());

//RUTAS
app.use('/api', usuarioRutas);

//INICIA LA API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
