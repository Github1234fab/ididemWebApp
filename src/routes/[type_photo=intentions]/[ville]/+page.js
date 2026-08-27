import { error } from '@sveltejs/kit';
import { villesSEO } from '$lib/data/villes.js';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const slugVille = params.ville ? params.ville.toLowerCase() : '';
	const typePhoto = params.type_photo;

	// Si la ville n'existe pas dans notre liste officielle, on renvoie une vraie erreur 404
	const villeInfo = villesSEO[slugVille];
	if (!villeInfo) {
		throw error(404, 'Cette ville n\'est pas desservie');
	}

	// Définir les variables SEO selon l'intention de l'URL
	let seo = {
		title: '',
		description: '',
		h1: '',
		focusFormula: '' // 'e-photo', 'officielle', 'casual'
	};

	switch (typePhoto) {
		case 'e-photo-ANTS-en-ligne':
			seo.title = `e-Photo ANTS en ligne ${villeInfo.prepArticle} - Signature Permis & Titre de séjour`;
			seo.description = `Faites votre e-photo officielle ANTS en ligne ${villeInfo.prepArticle}. Obtenez votre code photo signature pour permis de conduire et titre de séjour.`;
			seo.h1 = `Votre e-photo ANTS officielle en ligne ${villeInfo.prepArticle}`;
			seo.focusFormula = 'e-photo';
			break;

		case 'photo-passeport-en-ligne':
			seo.title = `Photo de passeport en ligne ${villeInfo.prepArticle} - Conforme Mairie`;
			seo.description = `Prenez votre photo de passeport officiel en ligne ${villeInfo.prepArticle}. Conforme aux normes ISO/IEC 19794-5 et OACI pour vos démarches en mairie.`;
			seo.h1 = `Vos photos de passeport conformes en ligne ${villeInfo.prepArticle}`;
			seo.focusFormula = 'officielle';
			break;

		case 'photo-carte-identite-en-ligne':
			seo.title = `Photo de carte d'identité en ligne ${villeInfo.prepArticle} - Conforme Mairie`;
			seo.description = `Réalisez vos photos pour carte nationale d'identité en ligne ${villeInfo.prepArticle}. Service de détourage IA rapide et conforme à 100%.`;
			seo.h1 = `Vos photos de carte d'identité en ligne ${villeInfo.prepArticle}`;
			seo.focusFormula = 'officielle';
			break;

		case 'portrait-professionnel-en-ligne':
			seo.title = `Portrait professionnel & photo de CV en ligne ${villeInfo.prepArticle}`;
			seo.description = `Créez votre photo de profil LinkedIn et portrait professionnel pour votre CV en ligne ${villeInfo.prepArticle}. Détourage IA et fonds personnalisés.`;
			seo.h1 = `Votre portrait professionnel & photo de CV en ligne ${villeInfo.prepArticle}`;
			seo.focusFormula = 'casual';
			break;

		case 'photo-identite-en-ligne':
		default:
			seo.title = `Photo d'identité en ligne ${villeInfo.prepArticle} - Conforme Mairie & ANTS`;
			seo.description = `Faites vos photos de carte d'identité, passeport et e-photo ANTS en ligne ${villeInfo.prepArticle}. Alternative rapide et conforme aux cabines Photomaton.`;
			seo.h1 = `Votre photo de carte d'identité & passeport en ligne ${villeInfo.prepArticle}`;
			seo.focusFormula = 'officielle';
			break;
	}

	return {
		ville: villeInfo,
		typePhoto,
		seo
	};
}
