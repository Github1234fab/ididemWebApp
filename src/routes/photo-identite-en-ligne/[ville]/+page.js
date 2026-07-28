// src/routes/photo-identite-en-ligne/[ville]/+page.js
import { villesSEO, villeGenerique } from '$lib/data/villes.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const slug = params.ville ? params.ville.toLowerCase() : 'france';
	const villeInfo = villesSEO[slug] || {
		...villeGenerique,
		// Si la ville n'est pas dans notre liste officielle, on génère un nom propre propre à partir du slug
		name: params.ville ? params.ville.charAt(0).toUpperCase() + params.ville.slice(1).replace(/-/g, ' ') : 'France',
		prep: 'à',
		prepArticle: `à ${params.ville ? params.ville.charAt(0).toUpperCase() + params.ville.slice(1).replace(/-/g, ' ') : 'France'}`
	};

	return {
		ville: villeInfo
	};
}
