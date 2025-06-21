const express = require("express");
const router = express.Router();

const cotizacionController = require("../controllers/cotizacionController");

router.post("/create-cotizacion", cotizacionController.createCotizacion);
router.post("/create-respuesta-cot", cotizacionController.createRespuestaCot);
router.post("/create-rechazo-cot", cotizacionController.createRechazoCot);
router.get("/trabajador/:trabajador", cotizacionController.getCotizaciones);
router.get("/cliente/:cliente", cotizacionController.getCotizacionesCli);
router.get("/id/:id", cotizacionController.getCotizacionesId);
router.get("/rechazo/:id", cotizacionController.getRechazo);
router.put("/responder/:id", cotizacionController.updateRespondido);
router.get("/respuesta/:id", cotizacionController.getRespuestaId);
router.get("/done/:id", cotizacionController.getTrabajosTerminados);

module.exports = router;
