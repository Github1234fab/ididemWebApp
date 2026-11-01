<!-- src/routes/photo-identite-bebe/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photo d'Identité Bébé & Nourrisson en Ligne sur Smartphone | IDidem",
		description: "Prenez la photo d'identité de votre bébé ou nourrisson en ligne sur smartphone à la maison sans stress. 100% conforme passeport et CNI en mairie. Essais illimités.",
		canonical: "https://ididem.com/photo-identite-bebe",
		badge: "👶 SPÉCIAL NOURRISSON & ENFANT EN BAS ÂGE • SANS STRESS",
		h1: "Photo d'Identité Bébé & Nourrisson en Ligne sur Smartphone",
		heroSubtitle: "Évitez le cauchemar des cabines Photomaton avec un bébé qui pleure ou ne tient pas sa tête. Réalisez la photo de passeport ou carte d'identité de votre nourrisson tranquillement chez vous au smartphone, avec essais illimités.",
		focusFormula: /** @type {'officielle'} */ ('officielle'),
		ctaText: "Photographier mon bébé au smartphone →",
		sampleImage: "/photo_enfant.png",
		sampleCaption: "Photo d'Identité Bébé Biométrique Conforme 35×45mm",
		specTitle: "La solution idéale pour les bébés et jeunes enfants",
		specText: "Faire une photo d'identité officielle pour un bébé en cabine automatique est une épreuve : l'assise est inadaptée, le flash effraie l'enfant, et les parents doivent tenir le bébé sans que leurs mains n'apparaissent dans le cadre. Avec IDidem, vous prenez la photo chez vous au calme pendant son moment d'éveil.",
		specPoints: [
			"Essais illimités gratuits : prenez votre temps jusqu'au cliché parfait",
			"Bébé peut être allongé confortablement sur le dos sur un drap clair",
			"Détourage IA de pointe : supprime les plis du lit ou les ombres",
			"Suppression automatique des mains des parents si elles soutiennent la tête",
			"Conforme aux normes spécifiques tolérées pour les nourrissons",
			"Validé par des photographes professionnels spécialisés"
		],
		stepsTitle: "Comment réussir la photo de votre bébé à la maison ?",
		steps: [
			{
				num: "1",
				title: "Allongez bébé sur un drap ou dans son transat",
				desc: "Placez votre nourrisson sur le dos sous une lumière douce du jour (près d'une fenêtre, sans flash direct). Attendez qu'il regarde en l'air les yeux ouverts."
			},
			{
				num: "2",
				title: "Prenez la photo au smartphone à hauteur",
				desc: "Positionnez votre smartphone bien parallèle au visage de bébé à environ 1 mètre. Notre gabarit intelligent vous guide pour cadrer sans forcer."
			},
			{
				num: "3",
				title: "Validation et planche 6 photos prête",
				desc: "Notre outil nettoie le fond, vérifie la conformité biométrique et vous délivre la planche 35×45mm garantie acceptée en Mairie."
			}
		],
		faqs: [
			{
				q: "Quelles sont les règles spécifiques pour la photo d'identité d'un bébé ?",
				a: "Pour les bébés de moins de 1 an, les mairies tolèrent une légère inclinaison de la tête. En revanche, les yeux doivent impérativement être ouverts, la bouche fermée (sans tétine), et aucune main ou personne tierce ne doit apparaître dans le champ de la photo."
			},
			{
				q: "Peut-on utiliser le flash pour photographier un nourrisson ?",
				a: "Non, il est fortement déconseillé d'utiliser le flash, d'abord pour le confort des yeux de votre bébé, ensuite parce que le flash crée des ombres dures et des reflets qui rendent la photo non conforme. Privilégiez une pièce lumineuse en journée."
			},
			{
				q: "Les photos de bébé faites avec IDidem sont-elles acceptées en Mairie ?",
				a: "Oui, à 100%. Des milliers de parents ont obtenu le passeport ou la carte d'identité de leur nourrisson grâce à IDidem. Notre garantie 'Conforme ou Remboursé' vous protège sans condition."
			},
			{
				q: "Mon bébé a la bouche légèrement entrouverte, est-ce un motif de rejet ?",
				a: "Pour les nourrissons de quelques mois, les agents de mairie font preuve de bienveillance si la bouche est légèrement entrouverte. L'essentiel est que le regard soit bien dirigé vers l'objectif et les deux yeux parfaitement visibles."
			}
		]
	};
</script>

<LandingNational {...landingData} />
