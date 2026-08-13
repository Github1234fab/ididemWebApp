import { json } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const sessionId = url.searchParams.get('sessionId');
	if (!sessionId) {
		return json({ error: 'sessionId is required' }, { status: 400 });
	}

	const safeSessionId = sessionId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
	const filePath = join(process.cwd(), 'src', 'lib', 'server', 'data', `${safeSessionId}.json`);

	console.log(`[API coords] Lecture des coordonnées pour: ${safeSessionId} (${filePath})`);

	if (!existsSync(filePath)) {
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
