const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { select } = require("../utils/consultas");

const PostCheckoutSession = async (req, res) => {
    try {
        const { priceId, customerId, userId } = req.body;

        // Verificar que el cliente exista
        let customer;
        try {
            customer = await stripe.customers.retrieve(customerId);
        } catch (error) {
            console.error('Error al recuperar el cliente:', error);
            return res.status(400).json({ 
                error: 'Cliente no encontrado en Stripe',
                details: error.message 
            });
        }

        // Verificar si el cliente ya tiene una suscripción activa
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,

            status: 'all',
            limit: 1
        });

        if (subscriptions.data.length > 0) {
            const activeSub = subscriptions.data.find(sub => 
                sub.status === 'active' || sub.status === 'trialing'
            );
            
            if (activeSub) {
                return res.status(400).json({
                    error: 'Ya tienes una suscripción activa',
                    subscriptionId: activeSub.id
                });
            }
        }

        // Crear la sesión de checkout
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
                platform: 'react-native',
                customer_id: customerId,
                user_id: userId
            }
        });

        // Actualizar el estado del usuario
        const sql = `UPDATE usuario SET id_estado = 2 WHERE id = ?`;
        const resultado = await select(sql, [userId]);
        if (!resultado) {
            return res.status(500).json({ exito: false });
        }

        res.json({ 
            url: session.url,
            sessionId: session.id
        });

    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({ 
            error: 'Error al procesar el pago',
            details: error.message 
        });
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


const getSuscriptionById = async (req, res) => {
    const appUserId = req.params.customerId;

    try {
        // 1. Buscar el cliente por el app_user_id en los metadatos
        const customers = await stripe.customers.search({
            query: `metadata['app_user_id']:'${appUserId}'`,
            limit: 1
        });

        if (customers.data.length === 0) {
            return res.status(404).json({ 
                subscribed: false, 
                message: 'No se encontró el cliente' 
            });
        }

        const customer = customers.data[0];
        
        // 2. Buscar suscripciones
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return res.json({ 
                subscribed: false, 
                customerId: customer.id 
            });
        }

        const subscription = subscriptions.data[0];
        
        // 3. Obtener detalles del precio
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId, {
            expand: ['product']
        });

        // 4. Formatear fechas
        const formatDate = (timestamp) => {
            if (!timestamp) return null;
            const date = new Date(timestamp * 1000);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        //formateo a peso chileno
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            });
    
        const amount = formatter.format(price.unit_amount);
        const currency = price.currency.toUpperCase();

        // 5. Construir respuesta
        const response = {
            subscribed: ['active', 'trialing'].includes(subscription.status),
            status: subscription.status,
            planId: price.id,
            productId: price.product.id,
            planName: price.product.name,
            price: `${amount} ${currency}`,
            currency: price.currency.toUpperCase(),
            // Usar las fechas formateadas
            dateStart: subscription.current_period_start,
            dateStartFormatted: formatDate(subscription.current_period_start),
            dateEnd: subscription.current_period_end,
            dateEndFormatted: formatDate(subscription.current_period_end),
            isActive: ['active', 'trialing'].includes(subscription.status),
            customerId: customer.id,
            billing_cycle_anchor: subscription.billing_cycle_anchor,
            billing_cycle_anchor_formatted: formatDate(subscription.billing_cycle_anchor),
            cancel_at_period_end: subscription.cancel_at_period_end,
            message: 'Suscripción encontrada'
        };

        res.json(response);

    } catch (error) {
        console.error('Error al obtener la suscripción:', error);
        res.status(500).json({ 
            subscribed: false,
            error: 'Error al verificar suscripción',
            details: error.message 
        });
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
    getSuscriptionById,
    getPrices,
    webhook,
}