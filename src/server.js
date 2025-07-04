const express = require("express");
const usuarioRutas = require("./routes/usuariosRoutes");
const paymentStripe = require("./routes/paymentStripe");
const categoryRoutes = require("./routes/categoryRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const direccionRoutes = require("./routes/direccionRoutes");
const favoritosRoutes = require("./routes/favoritosRoutes");
const s3Routes = require("./routes/s3/s3Routes");
const cotizacionRoutes = require("./routes/cotizacionRoutes");
const estadoRoutes = require("./routes/estadoRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const denunciaRoutes = require("./routes/denunciaRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

app.use(express.json());

//RUTAS
app.use("/estado", estadoRoutes);
app.use("/usuarios", usuarioRutas);
app.use("/payment", paymentStripe);
app.use("/category", categoryRoutes);
app.use("/post", postRoutes);
app.use("/chat", chatRoutes);
app.use("/direccion", direccionRoutes);
app.use("/fav", favoritosRoutes);
app.use("/cotizacion", cotizacionRoutes);
app.use("/s3", s3Routes);
app.use("/perfil", perfilRoutes);
app.use("/denuncia", denunciaRoutes);
app.use("/comentario", comentarioRoutes);
app.use("/rating", ratingRoutes);

//INICIA LA API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
