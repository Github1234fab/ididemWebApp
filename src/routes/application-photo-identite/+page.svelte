<!-- src/routes/application-photo-identite/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Application Photo d'Identité & e-Photo ANTS sur Smartphone | IDidem",
		description: "Découvrez la meilleure application de photos d'identité et e-photo ANTS officielle sur smartphone. Conforme passeport, carte d'identité, permis et visa. Disponible sur iOS, Android et Web.",
		canonical: "https://ididem.com/application-photo-identite",
		badge: "APPLICATION OFFICIELLE IOS, ANDROID & WEB • 11 LANGUES",
		h1: "Application Photo d'Identité et e-Photo ANTS sur Smartphone",
		heroSubtitle: "Transformez votre smartphone en studio photo d'identité certifié. Réalisez votre e-photo ANTS avec signature numérique et vos planches 35×45mm pour passeport, CNI et carte de séjour en 2 minutes chrono avec notre application mobile et web.",
		focusFormula: /** @type {'e-photo'} */ ('e-photo'),
		ctaText: "Télécharger l'application IDidem →",
		ctaMode: /** @type {'stores'} */ ('stores'),
		showWebFallback: true,
		sampleImage: "/photo_femme.png",
		sampleCaption: "Application Biométrique Conforme ANTS & Normes Internationales",
		specTitle: "Pourquoi choisir l'application IDidem pour vos photos officielles ?",
		specText: "Développée en collaboration avec des artisans photographes cumulant plus de 20 ans d'expérience, l'application IDidem allie un guidage biométrique intelligent en temps réel et un contrôle humain expert. Fini les cabines Photomaton en panne, les déplacements inutiles et les photos rejetées en mairie.",
		specPoints: [
			"Prise de vue interactive avec viseur biométrique OACI (hauteur des yeux, centrage, éclairage)",
			"Signature électronique manuscrite sécurisée sur l'écran tactile du smartphone",
			"Génération immédiate du code officiel e-Photo ANTS à 22 caractères pour permis et séjour",
			"Suppression automatique de l'arrière-plan et application du fond uni réglementaire",
			"Essais illimités et 100% gratuits jusqu'au cliché idéal avant paiement",
			"Prise en charge de tous les formats internationaux (visas USA, Chine, Inde, Schengen)",
			"Interface disponible en 11 langues pour une utilisation universelle",
			"Garantie 100% Conforme ou Remboursé sans discussion sous 24h"
		],
		stepsTitle: "Comment fonctionne l'application photo d'identité IDidem ?",
		steps: [
			{
				num: "1",
				title: "Prenez votre photo sur l'app",
				desc: "Positionnez votre visage dans le gabarit virtuel. L'application vérifie la posture, la neutralité du regard et la netteté."
			},
			{
				num: "2",
				title: "Signez sur l'écran tactile",
				desc: "Pour les e-photos ANTS (permis, titre de séjour), apposez votre signature numérique directement avec votre doigt."
			},
			{
				num: "3",
				title: "Recevez votre code ou planche HD",
				desc: "Votre code officiel ANTS ou votre planche 35×45 mm est généré instantanément et expédié par e-mail ou par voie postale (+2 €)."
			}
		],
		faqs: [
			{
				q: "L'application IDidem est-elle disponible sur iPhone et Android ?",
				a: "Oui, IDidem est disponible sous forme d'application mobile sur l'App Store (iOS) et Google Play Store (Android), ainsi que directement sur le web depuis n'importe quel navigateur mobile sans installation préalable."
			},
			{
				q: "Les photos prises sur smartphone sont-elles acceptées en Mairie et Préfecture ?",
				a: "Oui, à 100%. Nos planches respectent strictement la norme internationale ISO/IEC 19794-5 et nos e-photos répondent au cahier des charges de l'ANTS. Chaque photo est contrôlée par des professionnels agréés."
			},
			{
				q: "Comment l'application assure-t-elle la confidentialité de mes données biométriques ?",
				a: "Vos photos et signatures sont exclusivement utilisées pour générer vos documents officiels. Nous appliquons un chiffrement de bout en bout et ne revendons aucune donnée personnelle, conformément au RGPD."
			},
			{
				q: "Puis-je utiliser l'application pour la photo d'un bébé ou nourrisson ?",
				a: "Absolument. L'application IDidem est plébiscitée par les jeunes parents : allongez simplement bébé sur un lit ou un drap clair et prenez la photo au-dessus de lui. Notre algorithme efface les plis du drap et crée le fond réglementaire."
			}
		]
	};
</script>

<LandingNational {...landingData} />

