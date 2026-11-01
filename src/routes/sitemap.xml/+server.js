import { villesSEO } from '$lib/data/villes.js';

export async function GET() {
	const domain = 'https://ididem.com';
	
	// 1. Pages statiques principales & Démarches nationales
	const nationalPages = [
		{ path: '', priority: '1.0' },
		{ path: '/photo', priority: '0.8' },
		{ path: '/e-photo-ants', priority: '0.9' },
		{ path: '/photo-permis-de-conduire', priority: '0.9' },
		{ path: '/photo-titre-de-sejour', priority: '0.9' },
		{ path: '/photo-passeport-en-ligne', priority: '0.9' },
		{ path: '/photo-carte-identite-en-ligne', priority: '0.9' },
		{ path: '/photo-identite-bebe', priority: '0.9' }
	];

	const today = new Date().toISOString().split('T')[0];
	const entries = [];

	for (const page of nationalPages) {
		entries.push({
			loc: `${domain}${page.path}`,
			priority: page.priority,
			changefreq: 'weekly'
		});
	}

	// 2. Les 20 Vraies Pages Locales Dédiées aux Métropoles
	// Utilisation de la route canonique principale photo-identite-en-ligne
	const citySlugs = Object.keys(villesSEO);
	const primaryIntention = 'photo-identite-en-ligne';
	for (const city of citySlugs) {
		entries.push({
			loc: `${domain}/${primaryIntention}/${city}`,
			priority: '0.8',
			changefreq: 'weekly'
		});
	}

	// Générer l'XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${entries.map(entry => `
	<url>
		<loc>${entry.loc}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>${entry.changefreq}</changefreq>
		<priority>${entry.priority}</priority>
	</url>`).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
