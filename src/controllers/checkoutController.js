const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Comanda = require('../models/Comanda');
const Product = require('../models/Product');

const createCheckoutSession = async (req, res) => {
    try {
        const { productes, adreca } = req.body;

        if (!productes || productes.length === 0) {
            return res.status(400).json({ status: 'error', message: 'El carret està buit' });
        }

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

            // No confiem en el preu del frontend
            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: dbProduct.nom,
                        images: dbProduct.imatge ? [dbProduct.imatge] : [],
                    },
                    unit_amount: Math.round(dbProduct.preu * 100), // Stripe usa cèntims
                },
                quantity: item.quantitat,
            });

            totalCalculat += dbProduct.preu * item.quantitat;
        }

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

        // 3. Crear sessió de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/cancel`,
            metadata: {
                comandaId: novaComanda._id.toString()
            }
        });

        res.json({ id: session.id });

    } catch (error) {
        console.error('Error createCheckoutSession:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // Necessita el raw body
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
            // Actualitzar comanda
            const comanda = await Comanda.findById(comandaId);
            if (comanda) {
                comanda.estat = 'pendent'; // O 'pagat' si prefereixes
                await comanda.save();

                // Reduir stock
                for (const item of comanda.productes) {
                    await Product.findByIdAndUpdate(item.producte, {
                        $inc: { stock: -item.quantitat }
                    });
                }
            }
        } catch (error) {
            console.error('Error actualitzant comanda post-webhook:', error);
        }
    }

    res.json({ received: true });
};

module.exports = {
    createCheckoutSession,
    handleWebhook
};
