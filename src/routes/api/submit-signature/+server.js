import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { name, email, phone, birthdate, sessionId, signatureData, photoData } = await request.json();

		if (!name || !email || !sessionId || !signatureData) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const webappUrl = env.GOOGLE_SHEET_WEBAPP_URL;
		if (!webappUrl) {
			console.warn('GOOGLE_SHEET_WEBAPP_URL is not defined in .env. Skipping Google Sheets integration.');
			return json({ success: true, message: 'Google Sheet Webapp URL missing' });
		}

		console.log(`[Submit Signature] Relay signature for session ${sessionId} (${email})...`);

		// Envoyer la requête au Google Apps Script Web App
		const response = await fetch(webappUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'submit-signature',
				name,
				email,
				phone: phone || '',
				birthdate: birthdate || '',
				sessionId,
				signatureData,
				photoData: photoData || '' // Image Base64 de la photo
			})
		});

		const resultText = await response.text();
		console.log('[Submit Signature] Google Apps Script response:', resultText);

		return json({ success: true });
	} catch (err) {
		console.error('[Submit Signature] Error submitting signature:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
