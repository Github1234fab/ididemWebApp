import { villesSEO } from '$lib/data/villes.js';

export async function GET() {
	const domain = 'https://ididem.com';
	
	// Pages statiques principales
	const staticPages = [
		'',
		'/photo'
	];

	const today = new Date().toISOString().split('T')[0];
	const urls = [];

	// 1. Pages statiques
	for (const page of staticPages) {
		urls.push(`${domain}${page}`);
	}

	// 2. Les 20 Vraies Pages Locales Dédiées aux Métropoles
	// Utilisation de la route canonique principale photo-identite-en-ligne
	const citySlugs = Object.keys(villesSEO);
	const primaryIntention = 'photo-identite-en-ligne';
	for (const city of citySlugs) {
		urls.push(`${domain}/${primaryIntention}/${city}`);
	}

	// Générer l'XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls.map(url => `
	<url>
		<loc>${url}</loc>
		<lastmod>${today}</lastmod>
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
