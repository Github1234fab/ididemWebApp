import { villesSEO } from '$lib/data/villes.js';

export async function GET() {
	const domain = 'https://ididem.com';
	
	// Pages de base
	const staticPages = [
		'',
		'/photo'
	];

	// Intentions valides d'après le matcher params/intentions.js
	const intentions = [
		'photo-identite-en-ligne',
		'e-photo-ANTS-en-ligne',
		'photo-passeport-en-ligne',
		'photo-carte-identite-en-ligne',
		'portrait-professionnel-en-ligne'
	];

	const urls = [];

	// 1. Pages statiques
	for (const page of staticPages) {
		urls.push(`${domain}${page}`);
	}

	// 2. Pages d'intention x villes
	const citySlugs = Object.keys(villesSEO);
	for (const intention of intentions) {
		for (const city of citySlugs) {
			urls.push(`${domain}/${intention}/${city}`);
		}
	}

	// Générer l'XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls.map(url => `
	<url>
		<loc>${url}</loc>
		<changefreq>weekly</changefreq>
		<priority>${url === domain ? '1.0' : '0.8'}</priority>
	</url>`).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
