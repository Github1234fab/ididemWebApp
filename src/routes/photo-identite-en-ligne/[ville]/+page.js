import { error } from '@sveltejs/kit';
import { villesSEO } from '$lib/data/villes.js';

export const prerender = true;

// Donne à SvelteKit la liste de toutes les villes à pré-générer
export function entries() {
	return Object.keys(villesSEO).map((ville) => ({ ville }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const slug = params.ville ? params.ville.toLowerCase() : '';
	const villeInfo = villesSEO[slug];
	
	if (!villeInfo) {
		throw error(404, 'Cette ville n\'est pas desservie');
	}

	return {
		ville: villeInfo
	};
}
