<!-- src/routes/photo-passeport-en-ligne/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photo Passeport en Ligne sur Smartphone – Conforme Mairie & OACI | IDidem",
		description: "Faites vos photos de passeport biométrique en ligne sur smartphone en 2 minutes. Conforme norme OACI et Mairie. Planche 6 photos 35×45mm certifiée conforme.",
		canonical: "https://ididem.com/photo-passeport-en-ligne",
		badge: "🛂 NORME INTERNATIONALE OACI / ISO 19794-5 • CONFORME MAIRIE",
		h1: "Photo Passeport en Ligne Conforme sur Smartphone",
		heroSubtitle: "Réalisez vos photos biométriques pour passeport français directement sur smartphone depuis chez vous. Planche de 6 photos 35×45mm certifiée conforme pour votre rendez-vous en Mairie ou Consulat.",
		focusFormula: /** @type {'officielle'} */ ('officielle'),
		ctaText: "Créer mes photos de passeport →",
		sampleImage: "/photo_femme.png",
		sampleCaption: "Photo Passeport Biométrique 35×45mm Norme OACI",
		specTitle: "Les critères stricts pour la photo de passeport biométrique",
		specText: "Le passeport est le document d'identité le plus exigeant en matière de conformité. Les services de l'état civil en Mairie refusent systématiquement tout cliché non conforme aux normes internationales ISO/IEC 19794-5 de l'OACI (Organisation de l'Aviation Civile Internationale). IDidem intègre tous les points de contrôle automatiquement.",
		specPoints: [
			"Dimensions obligatoires : 35 mm de large sur 45 mm de haut",
			"Hauteur du visage réglementaire : entre 32 et 36 mm (du menton au sommet du crâne)",
			"Fond uni clair obligatoire : gris clair ou bleu pastel (fond blanc interdit en France)",
			"Expression neutre : bouche fermée sans sourire, yeux ouverts et fixant l'objectif",
			"Tête nue : sans bandeau, chapeau, serre-tête ou foulard",
			"Planche haute définition de 6 clichés prêts à l'impression"
		],
		stepsTitle: "Comment réussir votre photo de passeport sur smartphone ?",
		steps: [
			{
				num: "1",
				title: "Cadrage biométrique guidé au smartphone",
				desc: "Placez votre visage dans l'ovale virtuel. Notre algorithme vérifie la distance, la verticalité du visage et la luminosité."
			},
			{
				num: "2",
				title: "Détourage automatique et fond réglementaire",
				desc: "IDidem détoure proprement votre silhouette et applique automatiquement le fond gris clair conforme exigé par le Ministère de l'Intérieur."
			},
			{
				num: "3",
				title: "Téléchargement immédiat de la planche 35×45mm",
				desc: "Récupérez votre planche 6 photos prête pour votre rendez-vous en mairie, avec option d'impression papier livrée par la poste (+2 €)."
			}
		],
		faqs: [
			{
				q: "Les photos IDidem sont-elles acceptées en Mairie pour un passeport ?",
				a: "Oui, à 100%. Nos planches respectent rigoureusement les normes biométriques de l'OACI et sont validées par notre équipe de photographes professionnels avant délivrance. En cas de refus rarissime en mairie, nous vous remboursons intégralement."
			},
			{
				q: "Pourquoi le fond blanc est-il interdit pour un passeport français ?",
				a: "L'administration française interdit formellement le fond blanc pour le passeport et la carte d'identité, car il manque de contraste avec le visage et la chemise lors de la numérisation. IDidem applique un fond gris clair ou bleu clair parfaitement réglementaire."
			},
			{
				q: "Puis-je porter mes lunettes sur la photo de passeport ?",
				a: "Bien que tolérées si la monture est discrète et les verres sans reflet, la majorité des rejets en Mairie proviennent des reflets ou d'une monture masquant un œil. Nous recommandons vivement de retirer vos lunettes pendant la photo."
			},
			{
				q: "Faut-il une e-photo avec code à 22 caractères pour le passeport ?",
				a: "Non. Contrairement au permis de conduire et au titre de séjour, la demande de passeport en Mairie nécessite une photo physique imprimée au format 35×45mm que vous déposez lors de votre rendez-vous, même si vous avez fait une pré-demande en ligne."
			}
		]
	};
</script>

<LandingNational {...landingData} />
