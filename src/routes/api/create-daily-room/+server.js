import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Clé API Daily.co (récupérée de .env ou hardcodée en secours)
const DAILY_API_KEY = env.DAILY_API_KEY || 'b49fdc130d26f44391842205b903e4e045abb9b8c11775df436fd0b8f49f2819';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { sessionId } = await request.json();
		if (!sessionId) {
			return json({ error: 'sessionId is required' }, { status: 400 });
		}

		const roomName = `ididem_${sessionId.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`;

		console.log(`[Daily API] Vérification/Création de la room: ${roomName}`);

		// 1. Tenter de récupérer la room si elle existe déjà
		const getRes = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${DAILY_API_KEY}`
			}
		});

		if (getRes.ok) {
			const roomData = await getRes.json();
			console.log(`[Daily API] Room existante trouvée: ${roomData.url}`);
			return json({ url: roomData.url });
		}

		// 2. Si elle n'existe pas (404), on la crée avec une expiration d'une heure (3600 secondes)
		const expTime = Math.floor(Date.now() / 1000) + 3600;

		const createRes = await fetch('https://api.daily.co/v1/rooms', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DAILY_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: roomName,
				properties: {
					exp: expTime,
					start_audio_muted: false,
					start_video_muted: false,
					enable_chat: false,
					enable_people_ui: false,
					enable_pip_ui: true
				}
			})
		});

		if (!createRes.ok) {
			const errorData = await createRes.json();
			console.error('[Daily API] Erreur lors de la création de la room:', errorData);
			throw new Error(errorData.info || 'Erreur lors de la création de la salle de visioconférence.');
		}

		const roomData = await createRes.json();
		console.log(`[Daily API] Nouvelle room créée avec succès: ${roomData.url}`);
		return json({ url: roomData.url });

	} catch (err) {
		console.error('[Daily API] Erreur serveur:', err);
		return json({ error: err instanceof Error ? err.message : 'Erreur lors de l\'initialisation de l\'appel.' }, { status: 500 });
	}
}
