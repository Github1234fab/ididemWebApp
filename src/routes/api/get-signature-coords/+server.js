import { json } from '@sveltejs/kit';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch }) {
	const sessionId = url.searchParams.get('sessionId');
	if (!sessionId) {
		return json({ error: 'sessionId is required' }, { status: 400 });
	}

	const safeSessionId = sessionId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
	const filePath = join(process.cwd(), 'src', 'lib', 'server', 'data', `${safeSessionId}.json`);

	console.log(`[API coords] Lecture des coordonnées pour: ${safeSessionId} (${filePath})`);

	if (!existsSync(filePath)) {
		const webappUrl = env.GOOGLE_SHEET_WEBAPP_URL;
		if (webappUrl) {
			console.log(`[API coords] Fichier local introuvable. Récupération depuis Google Sheets...`);
			try {
				const response = await fetch(webappUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						action: 'get-signature-coords',
						sessionId: safeSessionId
					})
				});
				const result = await response.json();
				if (result && result.coords) {
					console.log(`[API coords] Tracé récupéré avec succès de Google Sheets.`);
					const coords = typeof result.coords === 'string' ? JSON.parse(result.coords) : result.coords;
					// Mettre en cache localement
					try {
						writeFileSync(filePath, JSON.stringify(coords));
					} catch (writeErr) {
						console.error('[API coords] Impossible de mettre en cache le tracé:', writeErr);
					}
					return json({ sessionId: safeSessionId, coords });
				} else {
					console.warn(`[API coords] Aucun tracé trouvé dans Google Sheets pour ${safeSessionId}`);
				}
			} catch (sheetErr) {
				console.error('[API coords] Échec de la récupération depuis Google Sheets:', sheetErr);
			}
		}
		return json({ error: 'Signature coordinates not found for this session' }, { status: 404 });
	}

	try {
		const rawData = readFileSync(filePath, 'utf-8');
		const coords = JSON.parse(rawData);
		return json({ sessionId: safeSessionId, coords });
	} catch (err) {
		console.error('[API coords] Erreur lors de la lecture des coordonnées:', err);
		return json({ error: 'Failed to read signature coordinates' }, { status: 500 });
	}
}
