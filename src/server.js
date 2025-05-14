const express = require('express');
const usuarioRutas = require('./routes/usuariosRoutes')
const paymentStripe = require('./routes/paymentStripe')
require('dotenv').config();

const app = express();

app.use(express.json());

//RUTAS
app.use('/usuarios', usuarioRutas);
app.use('/payment', paymentStripe);

//INICIA LA API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
