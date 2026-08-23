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
		
		// Bypasser la latence d'indexation de Stripe Search en listant les derniers PaymentIntents
		const listResults = await stripe.paymentIntents.list({ limit: 50 });
		let paymentIntent = listResults.data.find(
			pi => pi.metadata && pi.metadata.clientSessionId === sessionId
		);

		// Si non trouvé, on cherche en secours dans les dernières Checkout Sessions
		if (!paymentIntent) {
			console.log(`[Capture Payment] PaymentIntent non trouvé en liste directe. Recherche dans les Checkout Sessions...`);
			const sessionList = await stripe.checkout.sessions.list({ limit: 50 });
			const session = sessionList.data.find(
				s => s.metadata && s.metadata.clientSessionId === sessionId
			);
			if (session && session.payment_intent) {
				paymentIntent = await stripe.paymentIntents.retrieve(
					typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id
				);
			}
		}

		if (!paymentIntent) {
			return json({ error: 'Aucun paiement Stripe trouvé pour cette session client' }, { status: 404 });
		}
		
		if (paymentIntent.status === 'requires_capture') {
			console.log(`Capture du paiement Stripe ${paymentIntent.id} de 6.99 €...`);
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
