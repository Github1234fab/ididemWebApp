<!-- src/routes/photo-visa/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photos Visa en Ligne sur Smartphone – USA, Chine, Inde, Schengen | IDidem",
		description: "Faites vos photos de visa en ligne sur smartphone en 2 minutes. Conforme visa USA (5×5 cm), Chine, Inde, Canada, Schengen. Garantie conformité ambassades et consulats.",
		canonical: "https://ididem.com/photo-visa",
		badge: "✈️ VISAS INTERNATIONAUX • CONFORME AMBASSADES & CONSULATS",
		h1: "Photos Visa en Ligne Conformes sur Smartphone",
		heroSubtitle: "Réalisez vos photos pour demande de visa étranger depuis votre salon : format 50×50mm (USA, Inde), 33×48mm (Chine), 35×45mm (Schengen, Maghreb) avec fond uni ou blanc selon la réglementation stricte de chaque pays.",
		focusFormula: /** @type {'officielle'} */ ('officielle'),
		ctaText: "Créer mes photos de visa →",
		sampleImage: "/photo_homme.png",
		sampleCaption: "Photos Visa Internationales Conformes aux Normes Mondiales",
		specTitle: "Les exigences spécifiques des photos pour visas internationaux",
		specText: "Contrairement aux titres français (qui interdisent le fond blanc), de nombreuses ambassades comme les États-Unis (visa américain B1/B2, formulaire DS-160, Green Card, loterie DV), l'Inde ou la Chine imposent un fond blanc pur et des dimensions spécifiques (comme le format carré 2×2 pouces / 51×51 mm). IDidem s'adapte automatiquement aux spécificités de votre pays de destination.",
		specPoints: [
			"Format USA 51×51 mm (2×2 pouces) fond blanc pur pour formulaire DS-160 et visa américain",
			"Format Inde 50×50 mm conforme e-Visa touristique et démarches consulaires",
			"Format Chine 33×48 mm avec proportions spécifiques requises par le centre des visas chinois",
			"Format Canada 50×70 mm et 35×45 mm pour AVE, permis d'études ou résidence permanente",
			"Formats Schengen & pays du Maghreb (Algérie, Maroc, Tunisie) avec option fond blanc",
			"Fichier HD prêt à l'emploi pour téléversement en ligne ou impression planche 6 photos"
		],
		stepsTitle: "Comment faire vos photos de visa sur smartphone ?",
		steps: [
			{
				num: "1",
				title: "Prenez votre photo face à votre smartphone",
				desc: "Regardez droit dans l'objectif avec une expression neutre, dans une pièce éclairée à la lumière naturelle."
			},
			{
				num: "2",
				title: "Recadrage automatique & fond adapté par pays",
				desc: "Notre outil adapte les dimensions (5×5 cm, 35×45 mm, 33×48 mm) et applique le fond adéquat (fond blanc pur ou fond clair)."
			},
			{
				num: "3",
				title: "Téléchargement immédiat et impression",
				desc: "Récupérez le fichier numérique HD prêt à être téléversé sur le site du consulat ou la planche prête à être imprimée."
			}
		],
		faqs: [
			{
				q: "Quelles sont les dimensions d'une photo pour un visa américain (USA) ?",
				a: "Les États-Unis imposent un format carré de 2×2 pouces (soit 51×51 mm ou 5×5 cm), avec un fond blanc obligatoire et la tête occupant entre 50% et 69% de la hauteur totale de l'image. IDidem génère exactement ce ratio pour vos formulaires DS-160 ou loterie Green Card."
			},
			{
				q: "Le fond blanc est-il autorisé pour les visas ?",
				a: "Oui, et il est même obligatoire pour la plupart des pays hors Union Européenne (USA, Chine, Inde, etc.), alors qu'il est interdit pour les passeports et CNI français. IDidem propose l'option Fond Blanc pour répondre à ces exigences internationales."
			},
			{
				q: "Puis-je téléverser directement la photo sur le site de l'ambassade ?",
				a: "Oui, vous téléchargez votre photo en format numérique haute résolution (JPEG) respectant les contraintes de poids en kilo-octets et de pixels demandées pour les formulaires en ligne (ex: DS-160 américain, e-Visa Inde, portail visa chinois)."
			},
			{
				q: "Que se passe-t-il si la photo de visa est refusée par le consulat ?",
				a: "Tous nos clichés sont garantis acceptés par les consulats et ambassades. Dans le cas rarissime d'un rejet, nous vous offrons un nouveau cliché corrigé ou un remboursement intégral immédiat."
			}
		]
	};
</script>

<LandingNational {...landingData} />

