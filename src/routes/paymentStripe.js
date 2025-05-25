const express = require('express');
const router = express.Router();

const PaymentController = require('../controllers/paymentStripeControoller')

// Endpoint para crear sesión de pago
router.post('/create-checkout-session', PaymentController.PostCheckoutSession);

// Endpoint para crear cliente
router.post('/create-customer',PaymentController.postCustomer);


// Endpoint para obtener productos
router.get('/products',PaymentController.getProducts );

// Endpoint para obtener producto por ID
router.get('/subscription/:customerId',PaymentController.getSuscriptionById );

// Endpoint para obtener precios
router.get('/prices',PaymentController.getPrices);

// Webhook para manejar eventos de Stripe
router.post('/webhook', express.raw({type: 'application/json'}), PaymentController.webhook);


module.exports = router;