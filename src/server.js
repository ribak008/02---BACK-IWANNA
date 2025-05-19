const express = require('express');
const usuarioRutas = require('./routes/usuariosRoutes')
const paymentStripe = require('./routes/paymentStripe')
const categoryRoutes = require('./routes/categoryRoutes')
const postRoutes = require('./routes/postRoutes')
const chatRoutes = require('./routes/chatRoutes')
const direccionRoutes = require('./routes/direccionRoutes')
const s3Routes = require('./routes/s3/s3Routes')




const app = express();

app.use(express.json());

//RUTAS
app.use('/usuarios', usuarioRutas);
app.use('/payment', paymentStripe);
app.use('/category', categoryRoutes);
app.use('/post', postRoutes);
app.use('/chat', chatRoutes);
app.use('/direccion', direccionRoutes);
app.use("/s3", s3Routes);

//INICIA LA API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
