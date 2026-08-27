import { error } from '@sveltejs/kit';
import { villesSEO } from '$lib/data/villes.js';

export const prerender = true;

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
