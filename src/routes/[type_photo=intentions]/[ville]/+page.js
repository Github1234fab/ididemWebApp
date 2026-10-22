// src/routes/[type_photo=intentions]/[ville]/+page.js
import { error, redirect } from '@sveltejs/kit';
import { villesSEO, getRedirectTarget } from '$lib/data/villes.js';

export const prerender = true;

// Donne à SvelteKit uniquement la liste des 20 métropoles officielles du sitemap à pré-générer
export function entries() {
	return Object.keys(villesSEO).map(ville => ({
		type_photo: 'photo-identite-en-ligne',
		ville
	}));
}

/**
 * @typedef {Object} StepItem
 * @property {string} num
 * @property {string} title
 * @property {string} desc
 */

/**
 * @typedef {Object} FaqItem
 * @property {string} q
 * @property {string} a
 */

/**
 * @typedef {Object} SeoConfig
 * @property {string} title
 * @property {string} description
 * @property {string} h1
 * @property {string} badge
 * @property {string} heroSubtitle
 * @property {string} focusFormula
 * @property {string} ctaText
 * @property {string} stepsTitle
 * @property {StepItem[]} steps
 * @property {FaqItem[]} faqs
 * @property {string} specTitle
 * @property {string} specText
 */

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const slugVille = params.ville ? params.ville.toLowerCase() : '';
	const typePhoto = params.type_photo;

	// Redirection 301 pour les anciennes intentions ou URLs non-canoniques
	const redirectUrl = getRedirectTarget(typePhoto, slugVille);
	if (redirectUrl) {
		redirect(301, redirectUrl);
	}

	// Si la ville n'existe pas dans notre liste officielle, erreur 404
	const villeInfo = villesSEO[slugVille];
	if (!villeInfo) {
		throw error(404, 'Cette ville n\'est pas desservie');
	}

	/** @type {SeoConfig} */
	let seo;

	switch (typePhoto) {
		case 'e-photo-ants-en-ligne':
			seo = {
				title: `e-Photo ANTS en ligne ${villeInfo.prepArticle} (${villeInfo.depNum}) - Code Permis & Titre de Séjour`,
				description: `Obtenez votre e-photo officielle ANTS avec code photo-signature numérique ${villeInfo.prepArticle}. Pour permis de conduire et titre de séjour. Validation photographe agréé.`,
				h1: `Votre e-Photo ANTS Officielle avec Signature ${villeInfo.prepArticle}`,
				badge: `📜 PROCÉDURE OFFICIELLE ANTS – DÉPARTEMENT ${villeInfo.depNum}`,
				heroSubtitle: `Créez votre planche e-Photo biométrique agréée ANTS directement depuis chez vous ${villeInfo.prepArticle}. Vous recevez le code photo-signature numérique à 22 caractères obligatoire pour vos démarches en ligne sur ants.gouv.fr (Permis de conduire, Titre de séjour).`,
				focusFormula: 'e-photo',
				ctaText: 'Obtenir ma e-photo ANTS avec code',
				stepsTitle: `Comment obtenir votre code e-Photo ANTS ${villeInfo.prepArticle} ?`,
				steps: [
					{ num: '1', title: 'Prise de vue guidée', desc: 'Prenez votre cliché au smartphone avec notre cadrage biométrique interactif conforme aux exigences du ministère de l\'Intérieur.' },
					{ num: '2', title: 'Signature numérique', desc: 'Apposez votre signature directement sur l\'écran de votre smartphone en quelques secondes.' },
					{ num: '3', title: 'Code ANTS immédiat', desc: 'Recevez votre code e-Photo unique à 22 caractères transmis au serveur de traitement ANTS.' }
				],
				faqs: [
					{
						q: `Comment utiliser le code e-Photo ANTS pour une démarche ${villeInfo.prepArticle} ?`,
						a: `Lors de votre demande de permis de conduire ou de titre de séjour sur le site de l'ANTS, il vous suffit de saisir le code à 22 caractères fourni par IDidem. L'ANTS récupère automatiquement votre photo conforme et votre signature numérisée sans aucun envoi postal.`
					},
					{
						q: `Est-il nécessaire d'imprimer la e-photo pour le dossier ANTS ?`,
						a: `Non, la e-photo est un format 100% dématérialisé. Le code numérique à 22 caractères remplace l'envoi physique d'une photo papier.`
					},
					{
						q: `Où trouver un photographe agréé ANTS ${villeInfo.prepArticle} ?`,
						a: `Avec IDidem, inutile de vous déplacer en cabine ou chez un photographe à ${villeInfo.name}. Notre application est agréée par des photographes professionnels partenaires pour délivrer des e-photos conformes partout ${villeInfo.prepArticle}.`
					}
				],
				specTitle: `Normes ANTS & Démarches Numériques ${villeInfo.prepArticle}`,
				specText: `Les démarches de permis de conduire et de titre de séjour gérées par ${villeInfo.prefecture} exigent un code e-Photo officiel délivré par un professionnel agréé ANTS. Notre solution intègre la capture biométrique du visage et la signature électronique sécurisée.`
			};
			break;

		case 'photo-passeport-en-ligne':
			seo = {
				title: `Photo de Passeport en Ligne ${villeInfo.prepArticle} (${villeInfo.depNum}) - Conforme Mairie & Norme OACI`,
				description: `Réalisez vos photos de passeport biométriques conformes aux normes Mairie et OACI ${villeInfo.prepArticle}. Fichier HD et planche 6 photos 35x45mm certifiée.`,
				h1: `Vos Photos de Passeport Biométriques Conformes ${villeInfo.prepArticle}`,
				badge: `🛂 NORME BIOMÉTRIQUE OACI / MAIRIE – DÉPT ${villeInfo.depNum}`,
				heroSubtitle: `Préparez votre dossier de renouvellement ou première demande de passeport ${villeInfo.prepArticle}. Prenez votre photo d'identité biométrique conforme aux exigences strictes d'acceptation en Mairie (${villeInfo.mairie}).`,
				focusFormula: 'officielle',
				ctaText: 'Prendre ma photo de passeport',
				stepsTitle: `Comment réussir votre photo de passeport ${villeInfo.prepArticle} ?`,
				steps: [
					{ num: '1', title: 'Cadrage biométrique OACI', desc: 'Notre viseur interactif vérifie la hauteur des yeux (entre 32 et 36 mm) et le centrage du visage.' },
					{ num: '2', title: 'Détourage & fond réglementaire', desc: 'Suppression automatique du fond pour appliquer un fond uni gris clair ou bleu conforme aux normes Mairie.' },
					{ num: '3', title: 'Planche 6 photos 35x45mm', desc: 'Téléchargez immédiatement votre fichier planche prêt à être imprimé pour votre rdv en Mairie.' }
				],
				faqs: [
					{
						q: `Les photos IDidem sont-elles acceptées pour un passeport à ${villeInfo.mairie} ?`,
						a: `Oui. Nos photos respectent scrupuleusement la norme internationale ISO/IEC 19794-5 et les critères de la Préfecture pour le passeport biométrique.`
					},
					{
						q: `Quelles sont les règles essentielles pour la photo de passeport ?`,
						a: `Expression neutre (bouche fermée, sans sourire), yeux ouverts et fixant l'objectif, tête nue sans accessoire, visage dégagé sans ombre.`
					},
					{
						q: `Comment imprimer ma planche de photos de passeport ${villeInfo.prepArticle} ?`,
						a: `Vous pouvez l'imprimer sur du papier photo chez vous, dans une borne d'impression photo ou chez un imprimeur local ${villeInfo.prepArticle}.`
					}
				],
				specTitle: `Critères Biométriques pour le Passeport à ${villeInfo.name}`,
				specText: `Le passeport biométrique exige des photos de format exact 35×45 mm avec une hauteur de visage comprise entre 32 et 36 millimètres. Le fond doit être uni, de couleur claire (gris ou bleu), le fond blanc étant strictement interdit en France.`
			};
			break;

		case 'photo-carte-identite-en-ligne':
			seo = {
				title: `Photo Carte d'Identité en Ligne ${villeInfo.prepArticle} (${villeInfo.depNum}) - Conforme CNI`,
				description: `Photos pour carte nationale d'identité (CNI) certifiées conformes ${villeInfo.prepArticle}. Téléchargement immédiat de votre planche 6 photos pour ${villeInfo.mairie}.`,
				h1: `Vos Photos pour Carte d'Identité (CNI) ${villeInfo.prepArticle}`,
				badge: `🪪 CARTE NATIONALE D'IDENTITÉ – DÉPT ${villeInfo.depNum}`,
				heroSubtitle: `Réalisez votre photo d'identité officielle pour votre carte nationale d'identité (CNI) en ligne ${villeInfo.prepArticle}. Garantie d'acceptation pour votre dossier en Mairie ou en Préfecture (${villeInfo.prefecture}).`,
				focusFormula: 'officielle',
				ctaText: 'Faire ma photo de carte d\'identité',
				stepsTitle: `Étapes pour créer votre photo CNI ${villeInfo.prepArticle}`,
				steps: [
					{ num: '1', title: 'Capture smartphone', desc: 'Prenez votre photo face au smartphone avec un éclairage naturel et uniforme.' },
					{ num: '2', title: 'Contrôle des critères CNI', desc: 'Vérification de la posture, de l\'expression neutre et du dégagement des oreilles et du front.' },
					{ num: '3', title: 'Format officiel 35x45mm', desc: 'Récupérez votre fichier haute définition et votre planche de 6 clichés.' }
				],
				faqs: [
					{
						q: `Combien de photos d'identité faut-il fournir pour une CNI ${villeInfo.prepArticle} ?`,
						a: `Il faut fournir une photo récente de moins de 6 mois et parfaitement conforme aux normes officielles.`
					},
					{
						q: `Est-il possible de porter des lunettes sur la photo de carte d'identité ?`,
						a: `Les lunettes sont autorisées si les verres ne sont pas teintés et sans aucun reflet, mais il est vivement recommandé de les retirer pour garantir la validation.`
					},
					{
						q: `Que se passe-t-il si la photo est refusée par l'administration ?`,
						a: `Grâce à notre contrôle rigoureux et notre tutoriel conçu par des photographes, nos photos sont acceptées à 100%. En cas de doute, nous vous accompagnons.`
					}
				],
				specTitle: `Réglementation CNI dans le Département ${villeInfo.dep}`,
				specText: `Pour renouveler une Carte Nationale d'Identité (CNI) à ${villeInfo.name}, les photos d'identité présentées au guichet doivent dater de moins de 6 mois et répondre aux normes de contraste, de netteté et de centrage fixées par le ministère de l'Intérieur.`
			};
			break;

		case 'portrait-professionnel-en-ligne':
			seo = {
				title: `Portrait Professionnel & Photo CV en Ligne ${villeInfo.prepArticle}`,
				description: `Créez votre photo de profil LinkedIn et portrait professionnel pour votre CV ${villeInfo.prepArticle}. Détourage IA studio et fonds personnalisés en 2 minutes.`,
				h1: `Votre Portrait Professionnel & Photo de CV ${villeInfo.prepArticle}`,
				badge: `👔 PORTRAIT PRO & LINKEDIN – ${villeInfo.name.toUpperCase()}`,
				heroSubtitle: `Valorisez votre image professionnelle sur LinkedIn, votre CV et vos réseaux d'entreprise ${villeInfo.prepArticle}. Profitez d'un détourage studio haute qualité et d'une palette de fonds professionnels.`,
				focusFormula: 'casual',
				ctaText: 'Créer mon portrait professionnel',
				stepsTitle: `Comment réaliser un portrait pro de qualité ${villeInfo.prepArticle} ?`,
				steps: [
					{ num: '1', title: 'Photo simple au mobile', desc: 'Prenez une photo de vous avec une lumière naturelle, en posture professionnelle.' },
					{ num: '2', title: 'Détourage IA instantané', desc: 'Notre algorithme isole proprement votre silhouette sans déformer les contours du visage.' },
					{ num: '3', title: 'Arrière-plan personnalisé', desc: 'Sélectionnez parmi des dizaines de couleurs studio ou votre propre nuance pour un rendu impeccable.' }
				],
				faqs: [
					{
						q: `Pourquoi privilégier une photo pro pour LinkedIn et CV ${villeInfo.prepArticle} ?`,
						a: `Un portrait soigné et lumineux augmente jusqu'à 14 fois la visibilité de votre profil LinkedIn et renforce la crédibilité de votre candidature auprès des recruteurs.`
					},
					{
						q: `Quel arrière-plan choisir pour son portrait professionnel ?`,
						a: `Les fonds neutres (gris studio, bleu marine, blanc cassé ou teintes pastel) sont particulièrement recommandés pour un rendu élégant et professionnel.`
					},
					{
						q: `Puis-je réutiliser la photo sur plusieurs supports ?`,
						a: `Oui, vous téléchargez le fichier en haute résolution utilisable sur votre CV PDF, votre site web d'entreprise, votre signature mail et vos réseaux sociaux.`
					}
				],
				specTitle: `Valorisez votre personal branding ${villeInfo.prepArticle}`,
				specText: `Dans un bassin d'emploi dynamique comme ${villeInfo.name} et la région ${villeInfo.region}, une photo de profil professionnelle nette et bien éclairée est un atout indispensable pour capter l'attention.`
			};
			break;

		case 'photo-identite-en-ligne':
		default:
			seo = {
				title: `Photo d'Identité en Ligne ${villeInfo.prepArticle} (${villeInfo.depNum}) - Mairie & ANTS`,
				description: `Faites vos photos de carte d'identité, passeport et e-photo ANTS en ligne ${villeInfo.prepArticle}. Alternative rapide, économique et conforme aux cabines Photomaton.`,
				h1: `Votre Photo d'Identité Officielle en Ligne ${villeInfo.prepArticle}`,
				badge: `📍 SERVICE PHOTO OFFICIEL – ${villeInfo.name.toUpperCase()} (${villeInfo.depNum})`,
				heroSubtitle: `Évitez de chercher une cabine Photomaton ou un studio ${villeInfo.prepArticle}. Prenez vos photos d'identité biométriques ou votre e-photo ANTS directement depuis chez vous en 2 minutes.`,
				focusFormula: 'officielle',
				ctaText: 'Prendre ma photo d\'identité',
				stepsTitle: `Comment réaliser vos photos ${villeInfo.prepArticle} ?`,
				steps: [
					{ num: '1', title: 'Sélection de la formule', desc: 'Choisissez entre l\'e-photo ANTS (permis/titre de séjour), la photo officielle (CNI/passeport) ou le portrait pro.' },
					{ num: '2', title: 'Prise de vue interactive', desc: 'Laissez-vous guider par notre gabarit de cadrage intelligent.' },
					{ num: '3', title: 'Validation & Téléchargement', desc: 'Obtenez immédiatement vos fichiers et planches conformes aux normes administratives.' }
				],
				faqs: [
					{
						q: `Puis-je utiliser ces photos pour ma carte d'identité à la mairie de ${villeInfo.name} ?`,
						a: `Oui, absolument. Notre service produit des fichiers strictly conformes aux normes administratives françaises (norme ISO/IEC 19794-5) acceptés dans toutes les mairies de ${villeInfo.name}.`
					},
					{
						q: `Quelle est la différence avec une cabine Photomaton classique ${villeInfo.prepArticle} ?`,
						a: `Chez IDidem, vous prenez la photo chez vous au calme, vous pouvez recommencer autant de fois que vous le souhaitez gratuitement, et notre outil applique le fond réglementaire automatique.`
					},
					{
						q: `Comment fonctionne la e-photo pour le permis de conduire ?`,
						a: `Après capture et signature, vous recevez votre code photo-signature numérique à 22 caractères à reporter directement sur le site officiel de l'ANTS.`
					}
				],
				specTitle: `Service Photo Agréé pour ${villeInfo.name} et le Département ${villeInfo.depNum}`,
				specText: `Que ce soit pour ${villeInfo.mairie} ou ${villeInfo.prefecture}, nos outils sont développés en conformité avec les réglementations officielles pour garantir l'acceptation de vos clichés d'identité.`
			};
			break;
	}

	return {
		ville: villeInfo,
		typePhoto,
		seo
	};
}
