import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { sessionId } = await request.json();
		if (!sessionId) {
			return json({ error: 'sessionId is required' }, { status: 400 });
		}

		const stripeSecretKey = env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) {
			throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
		}
		const stripe = new Stripe(stripeSecretKey);

		console.log(`Recherche du PaymentIntent Stripe pour la session client: ${sessionId}...`);
		
		// Rechercher le PaymentIntent via les métadonnées
		const searchResults = await stripe.paymentIntents.search({
			query: `metadata['clientSessionId']:'${sessionId}'`
		});

		if (searchResults.data.length === 0) {
			return json({ error: 'Aucun paiement Stripe trouvé pour cette session client' }, { status: 404 });
		}

		const paymentIntent = searchResults.data[0];
		
		if (paymentIntent.status === 'requires_capture') {
			console.log(`Capture du paiement Stripe ${paymentIntent.id} de 12.99 €...`);
			const capturedPI = await stripe.paymentIntents.capture(paymentIntent.id);
			return json({ success: true, paymentIntentId: capturedPI.id, status: capturedPI.status });
		} else if (paymentIntent.status === 'succeeded') {
			return json({ success: true, message: 'Paiement déjà capturé', paymentIntentId: paymentIntent.id, status: paymentIntent.status });
		} else {
			return json({ error: `Le paiement ne peut pas être capturé (Statut Stripe: ${paymentIntent.status})` }, { status: 400 });
		}
	} catch (err) {
		console.error('Erreur lors de la capture du paiement:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
