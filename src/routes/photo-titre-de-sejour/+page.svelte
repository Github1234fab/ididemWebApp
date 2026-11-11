<!-- src/routes/photo-titre-de-sejour/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photo Carte de Séjour & Titre de Séjour en Ligne – e-Photo ANTS ANEF | IDidem",
		description: "Faites votre photo pour carte de séjour et titre de séjour en ligne sur smartphone en 2 min. Code e-photo ANTS officiel à 22 caractères agréé préfecture et plateforme ANEF.",
		canonical: "https://ididem.com/photo-titre-de-sejour",
		badge: "CARTE DE SÉJOUR & TITRE DE SÉJOUR • PLATEFORME ANEF / PRÉFECTURE",
		h1: "Photo Carte de Séjour et Titre de Séjour en Ligne – e-Photo ANTS ANEF",
		heroSubtitle: "Obtenez votre e-photo officielle avec signature électronique et code à 22 caractères agréé pour vos demandes de carte de séjour et titre de séjour sur le portail ANEF (administration-etrangers-en-france.interieur.gouv.fr) ou en préfecture.",
		focusFormula: /** @type {'e-photo'} */ ('e-photo'),
		ctaText: "Faire ma photo Carte de Séjour / ANEF →",
		sampleImage: "/photo_homme.png",
		sampleCaption: "e-Photo Carte de Séjour & Titre de Séjour Conforme Préfecture & ANEF",
		specTitle: "La e-photo ANTS pour la Carte de Séjour, Titre de Séjour et l'ANEF",
		specText: "Pour toutes les démarches de carte de séjour, titre de séjour, carte de résident, passeport talent ou demande de naturalisation, le Ministère de l'Intérieur impose l'utilisation d'une e-photo certifiée par l'ANTS comportant un code numérique de photo-signature à 22 caractères. Aucun déplacement en cabine n'est nécessaire : tout se fait depuis votre smartphone.",
		specPoints: [
			"Code à 22 caractères 100% compatible avec le téléservice ANEF et préfectures",
			"Valable pour première demande ou renouvellement de carte de séjour",
			"Accepté par toutes les préfectures et sous-préfectures de France",
			"Signature électronique manuscrite sécurisée sur l'écran tactile",
			"Planche 4 photos d'identité certifiées 35×45mm fournie en PDF pour votre dossier",
			"Contrôle de conformité garanti par des photographes professionnels agréés"
		],
		stepsTitle: "Comment faire votre e-photo de carte de séjour sur smartphone ?",
		steps: [
			{
				num: "1",
				title: "Prenez votre photo sur votre mobile",
				desc: "Placez-vous face à la lumière naturelle avec une expression neutre. L'application IDidem vérifie la netteté et supprime automatiquement l'arrière-plan."
			},
			{
				num: "2",
				title: "Signez sur votre écran",
				desc: "Tracez votre signature manuscrite sur l'écran du smartphone pour l'intégrer à la planche sécurisée."
			},
			{
				num: "3",
				title: "Intégrez le code sur le site de l'ANEF",
				desc: "Indiquez votre code unique à 22 caractères lors du dépôt de votre dossier de carte de séjour sur administration-etrangers-en-france.interieur.gouv.fr."
			}
		],
		faqs: [
			{
				q: "Faut-il une e-photo avec code pour renouveler une carte de séjour ?",
				a: "Oui. Pour toutes les téléprocédures sur la plateforme ANEF (renouvellement de carte de séjour, changement d'adresse ou statut, passeport talent), le code e-photo ANTS à 22 caractères est obligatoire et dispense d'envoyer des photos papier."
			},
			{
				q: "Le code e-photo IDidem fonctionne-t-il sur le site de l'ANEF ?",
				a: "Oui, parfaitement. Le portail officiel ANEF est directement connecté aux serveurs de l'ANTS. Votre code photo-signature à 22 caractères émis par IDidem est reconnu immédiatement par la plateforme."
			},
			{
				q: "Puis-je utiliser cette e-photo pour un rendez-vous physique en préfecture ?",
				a: "Oui. Si votre démarche nécessite un passage physique au guichet de la préfecture, vous recevez également la planche numérique officielle à imprimer, ou vous pouvez souscrire à l'envoi postal pour la recevoir directement chez vous."
			},
			{
				q: "Le port du voile religieux est-il autorisé sur la photo de carte de séjour ?",
				a: "Selon la réglementation officielle française, la tête doit être nue sur la photo d'identité officielle : aucun couvre-chef, foulard ou turban ne doit dissimuler le visage, la racine des cheveux, les oreilles ou le menton."
			},
			{
				q: "Combien de temps le code e-photo est-il valable ?",
				a: "Le code e-photo ANTS est valable 6 mois à compter de sa génération. Vous pouvez l'utiliser dès réception pour finaliser votre dossier."
			}
		]
	};
</script>

<LandingNational {...landingData} />
