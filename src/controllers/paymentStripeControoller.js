const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PostCheckoutSession = async (req, res) => {
    try {
        const { priceId, customerId } = req.body;

        const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
            price: priceId, 
            quantity: 1
        }],
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        metadata: {
            platform: 'react-native'
        }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
};

const postCustomer = async (req, res) => {
    // Validar que vengan los campos requeridos
    if (!req.body.userId || !req.body.email || !req.body.nombre) {
        return res.status(400).json({ 
            success: false,
            error: 'Faltan campos requeridos: userId, email, nombre' 
        });
    }

    const { userId, email, nombre } = req.body;

    try {
        console.log('Creando cliente en Stripe con datos:', { email, nombre, userId });
        
        const customer = await stripe.customers.create({
            email,
            name: nombre,
            metadata: { app_user_id: userId }
        });

        console.log('Cliente creado exitosamente:', customer.id);
        
        res.status(200).json({ 
            success: true,
            customerId: customer.id 
        });

    } catch (error) {
        console.error('Error creando cliente en Stripe:', error);
        res.status(500).json({ 
            success: false,
            error: 'No se pudo crear el cliente',
            details: error.message 
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price'], 
        });
        const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        });

        const formatted = products.data.map(product => {
        const price = product.default_price;
        const amount = formatter.format(price.unit_amount);
        const currency = price.currency.toUpperCase();

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: `${amount} ${currency}`,
            priceId: price.id,
            active: product.active,
            type: price.type, 
            created: product.created,
            updated: product.updated,
            object: product.object
        };
        });

        res.json(formatted);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'No se pudieron obtener los productos' });
    }
};


const getProductsById = async (req, res) => {
    const customerId = req.params.customerId;
  
    try {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all', // puedes filtrar por 'active' si solo quieres suscripciones activas
          expand: ['data.default_payment_method', 'data.items.data.price.product'],
        });
    
        if (subscriptions.data.length === 0) {
          return res.json({ subscribed: false });
        }
    
        const activeSub = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');
    
        if (!activeSub) {
          return res.json({ subscribed: false });
        }
    
        const planName = activeSub.items.data[0].price.product.name;
        const planPrice = activeSub.items.data[0].price.unit_amount / 100;
    
        res.json({
          subscribed: true,
          status: activeSub.status,
          planId: activeSub.items.data[0].price.id,
          productId: activeSub.items.data[0].price.product.id,
          planName,
          price: planPrice,
          currency: activeSub.items.data[0].price.currency,
          current_period_end: activeSub.current_period_end, // fecha fin del ciclo
        });
      } catch (error) {
        console.error('Error al obtener la suscripción:', error);
        res.status(500).json({ error: 'Error al verificar suscripción' });
      }
};

const getPrices =  async (req, res) => {
    try {
        const prices = await stripe.prices.list();
        res.json(prices.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener precios' });
    }
};

const webhook =async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
        case 'payment_intent.succeeded':
        // Aquí puedes manejar el éxito del pago
        break;
        case 'payment_intent.payment_failed':
        // Aquí puedes manejar el fallo del pago
        break;
        default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
};

module.exports = {
    PostCheckoutSession,
    postCustomer,
    getProducts,
    getPrices,
    webhook,
    getProductsById
}