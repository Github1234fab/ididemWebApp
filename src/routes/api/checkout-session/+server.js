import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { formulaId } = await request.json();
		if (!formulaId) {
			return json({ error: 'formulaId is required' }, { status: 400 });
		}

		// Initialiser Stripe avec la clé secrète dynamique
		const stripeSecretKey = env.STRIPE_SECRET_KEY || 'sk_test_51PqLwERpQW2B1A2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6';
		const stripe = new Stripe(stripeSecretKey);

		// Déterminer le tarif et les détails selon la formule
		let productName = 'Photo d\'identité';
		let unitAmount = 499; // 4.99 € par défaut
		let description = 'Fichier photo HD conforme aux normes';

		if (formulaId === 'e-photo') {
			productName = 'e-Photo Officielle (ANTS)';
			unitAmount = 499; // 4.99 €
			description = 'Planche e-Photo conforme ANTS pour permis de conduire et titre de séjour avec code unique';
		} else if (formulaId === 'officielle') {
			productName = 'Photo d\'identité standard';
			unitAmount = 499; // 4.99 €
			description = 'Planche photo d\'identité officielle pour passeport, CNI et visas';
		} else if (formulaId === 'casual') {
			productName = 'Portrait Professionnel';
			unitAmount = 999; // 9.99 €
			description = 'Portrait optimisé et recadré pour LinkedIn, CV et profils en ligne';
		}

		// Obtenir l'origine de la requête pour les redirections de Stripe
		const origin = new URL(request.url).origin;

		console.log(`Création d'une session Stripe Checkout pour la formule : ${formulaId}...`);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: productName,
							description: description
						},
						unit_amount: unitAmount
					},
					quantity: 1
				}
			],
			mode: 'payment',
			metadata: {
				application: 'ididem-web',
				formulaId: formulaId
			},
			payment_intent_data: {
				metadata: {
					application: 'ididem-web',
					formulaId: formulaId
				}
			},
			success_url: `${origin}/photo/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/photo/cancel`
		});

		return json({ url: session.url });

	} catch (err) {
		console.error('Erreur de création de la session Stripe Checkout:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
