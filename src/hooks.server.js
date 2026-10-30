import { getRedirectTarget } from '$lib/data/villes.js';

const LEGACY_INTENTIONS = new Set([
	'e-photo-ants-en-ligne',
	'photo-carte-identite-en-ligne',
	'photo-passeport-en-ligne',
	'portrait-professionnel-en-ligne',
	'photo-identite-en-ligne'
]);

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;

	// Ne jamais intercepter les requêtes API, fichiers statiques ou routes spéciales
	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/_app') ||
		pathname.startsWith('/assets') ||
		pathname.startsWith('/admin') ||
		pathname.startsWith('/signer')
	) {
		return resolve(event);
	}

	// Nettoyer le slash final éventuel (sauf pour la racine '/')
	const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
	const parts = cleanPath.split('/').filter(Boolean);

	// Cas 1 : URL à 2 segments (ex: /e-photo-ants-en-ligne/paris ou /photo-carte-identite-en-ligne/nantes)
	// Uniquement si le premier segment est une intention photo SEO
	if (parts.length === 2) {
		const [typePhoto, slugVille] = parts;
		if (LEGACY_INTENTIONS.has(typePhoto.toLowerCase())) {
			const target = getRedirectTarget(typePhoto, slugVille);
			if (target && target !== pathname) {
				return new Response(null, {
					status: 301,
					headers: {
						Location: target,
						'Cache-Control': 'public, max-age=31536000, immutable'
					}
				});
			}
		}
	}

	// Cas 2 : Intention seule sans ville (ex: /e-photo-ants-en-ligne)
	if (parts.length === 1) {
		const segment = parts[0].toLowerCase();
		if (LEGACY_INTENTIONS.has(segment)) {
			return new Response(null, {
				status: 301,
				headers: {
					Location: '/photo',
					'Cache-Control': 'public, max-age=31536000, immutable'
				}
			});
		}
	}

	// Cas 3 : Trailing slash sur URL canonique (ex: /photo-identite-en-ligne/paris/)
	if (pathname.length > 1 && pathname.endsWith('/')) {
		return new Response(null, {
			status: 301,
			headers: {
				Location: cleanPath,
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	}

	return resolve(event);
}
