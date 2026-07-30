import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { email, date, time, sessionId } = await request.json();
		
		const webappUrl = env.GOOGLE_SHEET_WEBAPP_URL;
		if (!webappUrl) {
			console.warn('GOOGLE_SHEET_WEBAPP_URL is not defined in .env. Skipping Google Sheets integration.');
			return json({ success: true, message: 'Google Sheet Webapp URL missing (local mock success)' });
		}

		console.log(`Sending booking to Google Sheet: ${email} - ${date} à ${time} (session: ${sessionId})...`);
		
		// Send request to Google Apps Script Web App
		const response = await fetch(webappUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'book-appointment',
				email,
				date,
				time,
				sessionId
			})
		});

		const resultText = await response.text();
		console.log('Google Apps Script response:', resultText);

		return json({ success: true });
	} catch (err) {
		console.error('Error booking appointment:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
