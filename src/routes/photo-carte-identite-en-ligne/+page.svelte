<!-- src/routes/photo-carte-identite-en-ligne/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photo Carte d'Identité en Ligne sur Smartphone – Conforme CNI | IDidem",
		description: "Réalisez vos photos pour carte nationale d'identité (CNI) en ligne sur smartphone en 2 minutes. Conforme Mairie et pré-demande ANTS. Planche 6 photos certifiée 35×45mm.",
		canonical: "https://ididem.com/photo-carte-identite-en-ligne",
		badge: "🪪 CARTE NATIONALE D'IDENTITÉ (CNI) • CONFORME MAIRIE & ANTS",
		h1: "Photo Carte d'Identité en Ligne sur Smartphone",
		heroSubtitle: "Créez vos photos d'identité certifiées conformes pour votre première demande ou renouvellement de Carte Nationale d'Identité (CNI). Directement sur smartphone, validé par des photographes professionnels.",
		focusFormula: /** @type {'officielle'} */ ('officielle'),
		ctaText: "Créer ma photo pour carte d'identité →",
		sampleImage: "/photo_homme.png",
		sampleCaption: "Photo Officielle pour Carte Nationale d'Identité (CNI)",
		specTitle: "Normes obligatoires pour la Carte Nationale d'Identité",
		specText: "Pour votre dossier de Carte Nationale d'Identité (format carte bancaire ou ancien format), l'administration exige des photos récentes de moins de 6 mois parfaitement ressemblantes et répondant aux critères du Ministère de l'Intérieur.",
		specPoints: [
			"Format réglementaire 35×45 mm avec visage centré",
			"Fond uni de couleur claire (gris clair ou bleu pastel)",
			"Visage entièrement dégagé : front, sourcils et oreilles visibles",
			"Bouche fermée, regard droit face à l'objectif sans pencher la tête",
			"Éclairage homogène sans ombres sur le visage ni à l'arrière-plan",
			"Planche officielle de 6 photos certifiées conformes pour la Mairie"
		],
		stepsTitle: "Les étapes pour votre photo de carte d'identité au smartphone",
		steps: [
			{
				num: "1",
				title: "Posez face à votre smartphone",
				desc: "Regardez droit dans l'objectif de votre téléphone avec une expression neutre. Notre guide interactif aligne automatiquement vos yeux et votre menton."
			},
			{
				num: "2",
				title: "Vérification biométrique instantanée",
				desc: "Notre technologie contrôle la conformité des contrastes, supprime l'arrière-plan de votre pièce et crée le fond réglementaire."
			},
			{
				num: "3",
				title: "Téléchargez et imprimez votre planche",
				desc: "Obtenez immédiatement votre planche haute résolution à imprimer pour votre rendez-vous en mairie, ou choisissez la livraison à domicile."
			}
		],
		faqs: [
			{
				q: "Combien de photos d'identité faut-il déposer pour une CNI ?",
				a: "En Mairie, vous devez fournir 1 photo d'identité récente (moins de 6 mois) non découpée issue d'une planche conforme. IDidem vous fournit une planche complète de 6 photos, vous permettant de conserver des exemplaires de réserve."
			},
			{
				q: "Peut-on utiliser le code e-photo ANTS pour une carte d'identité ?",
				a: "Non. Comme pour le passeport, le dépôt de la demande de CNI en Mairie exige une photo physique imprimée. Même avec une pré-demande en ligne sur ants.gouv.fr, vous devez présenter votre tirage papier lors de la prise d'empreintes."
			},
			{
				q: "Les photos IDidem sont-elles valables pour la nouvelle carte d'identité électronique ?",
				a: "Oui, à 100%. La nouvelle CNI au format carte bancaire suit exactement les mêmes normes biométriques ISO/IEC 19794-5 que le passeport et l'ancienne carte d'identité."
			},
			{
				q: "Comment imprimer ma planche photo IDidem ?",
				a: "Vous pouvez imprimer le fichier haute résolution sur n'importe quelle imprimante photo domestique, sur une borne d'impression en magasin ou supermarché, ou opter pour notre option d'expédition postale à 2 €."
			}
		]
	};
</script>

<LandingNational {...landingData} />
