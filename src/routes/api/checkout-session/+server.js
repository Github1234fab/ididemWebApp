import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { formulaId, email, clientSessionId } = await request.json();
		if (!formulaId) {
			return json({ error: 'formulaId is required' }, { status: 400 });
		}

		// Initialiser Stripe avec la clé secrète dynamique issue du fichier .env
		const stripeSecretKey = env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) {
			throw new Error('STRIPE_SECRET_KEY is not defined in environment variables (.env)');
		}
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
			customer_email: email || undefined,
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
				formulaId: formulaId,
				clientSessionId: clientSessionId || 'unknown'
			},
			payment_intent_data: {
				capture_method: formulaId === 'e-photo' ? 'manual' : 'automatic',
				metadata: {
					application: 'ididem-web',
					formulaId: formulaId,
					clientSessionId: clientSessionId || 'unknown'
				}
			},
			success_url: `${origin}/photo/success?session_id=${clientSessionId || '{CHECKOUT_SESSION_ID}'}`,
			cancel_url: `${origin}/photo/cancel`
		});

		return json({ url: session.url });

	} catch (err) {
		console.error('Erreur de création de la session Stripe Checkout:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
