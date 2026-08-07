import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { email, sessionId, delivery, address, formulaId, photoData } = await request.json();
		
		const webappUrl = env.GOOGLE_SHEET_WEBAPP_URL;
		if (!webappUrl) {
			console.warn('GOOGLE_SHEET_WEBAPP_URL is not defined in .env. Skipping Google Sheets integration.');
			return json({ success: true, message: 'Google Sheet Webapp URL missing' });
		}

		console.log(`Sending delivery alert to Google Sheet: ${email} (session: ${sessionId}, formule: ${formulaId})...`);
		
		// Envoyer la requête au Google Apps Script Web App
		const response = await fetch(webappUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'send-delivery-alert',
				email,
				sessionId,
				delivery,
				address,
				formulaId,
				photoData
			})
		});

		const resultText = await response.text();
		console.log('Google Apps Script delivery response:', resultText);

		return json({ success: true });
	} catch (err) {
		console.error('Error sending delivery alert:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
