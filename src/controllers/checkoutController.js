const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Comanda = require('../models/Comanda');
const Product = require('../models/Product');

// Funció auxiliar per marcar la comanda com a pagada i reduir l'stock
async function marcarComandaComAPagada(comanda) {
    comanda.estat = 'pagat';
    await comanda.save();
    for (const item of comanda.productes) {
        await Product.findByIdAndUpdate(item.producte, {
            $inc: { stock: -item.quantitat }
        });
    }
}

const createCheckoutSession = async (req, res) => {
    try {
        const { productes, adreca } = req.body;

        if (!productes || productes.length === 0) {
            // Sessió 17 - Exercici 4.6: Validacions i gestió d’errors (Carret buit)
            return res.status(400).json({ status: 'error', message: 'El carret està buit' });
        }

        // Sessió 17 - Exercici 4.6: Validacions i gestió d’errors (Validar productes, preus i stock)
        // 1. Validar productes, preus i stock
        const line_items = [];
        let totalCalculat = 0;

        for (const item of productes) {
            const dbProduct = await Product.findById(item.producte);
            if (!dbProduct) {
                return res.status(404).json({ status: 'error', message: `Producte no trobat: ${item.nom}` });
            }

            if (dbProduct.stock < item.quantitat) {
                return res.status(400).json({ status: 'error', message: `No hi ha prou stock per ${dbProduct.nom}` });
            }

            // Stripe només accepta imatges amb URLs absolutes i públiques
            const images = [];
            if (dbProduct.imatge && dbProduct.imatge.startsWith('http')) {
                images.push(dbProduct.imatge);
            }

            // No confiem en el preu del frontend
            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: dbProduct.nom,
                        images: images,
                    },
                    unit_amount: Math.round(dbProduct.preu * 100), // Stripe usa cèntims
                },
                quantity: item.quantitat,
            });

            totalCalculat += dbProduct.preu * item.quantitat;
        }

        // Sessió 17 - Exercici 4.2: Creació de comanda al backend
        // 2. Crear la comanda en estat pendent_pagament
        const novaComanda = new Comanda({
            usuari: req.usuari._id,
            productes: productes.map(p => ({
                producte: p.producte,
                nom: p.nom,
                quantitat: p.quantitat,
                preuUnitari: line_items.find(li => li.price_data.product_data.name === p.nom).price_data.unit_amount / 100,
                imatge: p.imatge
            })),
            adreca: adreca,
            total: totalCalculat,
            estat: 'pendent_pagament'
        });

        await novaComanda.save();

        // Sessió 17 - Exercici 4.3: Integració amb Stripe (backend)
        // 3. Crear sessió de Stripe
        const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
        console.log('DEBUG: Usant CLIENT_URL:', clientUrl);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/checkout/cancel`,
            metadata: {
                comandaId: novaComanda._id.toString()
            }
        });
        console.log('DEBUG: Sessió de Stripe creada:', session.id);

        res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error('Error createCheckoutSession:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Sessió 17 - Exercici 4.5: Confirmació de pagament (Webhook)
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const comandaId = session.metadata.comandaId;

        try {
            const comanda = await Comanda.findById(comandaId);
            if (comanda && comanda.estat !== 'pagat') {
                await marcarComandaComAPagada(comanda);
                console.log(`Comanda ${comandaId} marcada com a pagada via webhook.`);
            }
        } catch (error) {
            console.error('Error actualitzant comanda post-webhook:', error);
        }
    }

    res.json({ received: true });
};

// Sessió 17 - Exercici 4.5: Confirmació de pagament via session_id (fallback per a dev local)
// Stripe redirigeix a /checkout/success?session_id=xxx, i el frontend crida aquest endpoint
// per confirmar el pagament quan el webhook no pot arribar (entorn local).
const confirmPaymentBySession = async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) {
        return res.status(400).json({ status: 'error', message: 'Falta session_id' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ status: 'error', message: 'El pagament no s\'ha completat' });
        }

        const comandaId = session.metadata.comandaId;
        const comanda = await Comanda.findById(comandaId);

        if (!comanda) {
            return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
        }

        if (comanda.estat !== 'pagat') {
            await marcarComandaComAPagada(comanda);
            console.log(`Comanda ${comandaId} marcada com a pagada via confirm-payment.`);
        }

        res.json({ status: 'ok', message: 'Pagament confirmat', comandaId });
    } catch (error) {
        console.error('Error confirmant pagament:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createCheckoutSession,
    handleWebhook,
    confirmPaymentBySession
};
