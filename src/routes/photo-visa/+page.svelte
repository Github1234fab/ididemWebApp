<!-- src/routes/photo-visa/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photos Visa en Ligne sur Smartphone – USA, Chine, Inde, Schengen | IDidem",
		description: "Faites vos photos de visa en ligne sur smartphone en 2 minutes. Conforme visa USA (5×5 cm), Chine, Inde, Canada, Schengen. Garantie conformité ambassades et consulats via l'application IDidem.",
		canonical: "https://ididem.com/photo-visa",
		badge: "VISAS INTERNATIONAUX • DISPONIBLE SUR APPLICATION IDIDEM",
		h1: "Photos Visa Internationales sur Smartphone (Application IDidem)",
		heroSubtitle: "Besoin d'une photo conforme pour un visa étranger (USA, Chine, Inde, Canada, Schengen) ? Notre site web étant dédié aux démarches officielles françaises, tous les formats de visas internationaux sont pris en charge exclusivement sur l'application mobile IDidem (iOS & Android).",
		focusFormula: /** @type {'officielle'} */ ('officielle'),
		ctaText: "Télécharger l'application IDidem pour mon Visa →",
		ctaMode: /** @type {'stores'} */ ('stores'),
		storeNotice: "Précision importante : Notre plateforme web ididemWebApp est exclusivement dédiée aux démarches officielles françaises (CNI, passeport, e-photo ANTS permis et titre de séjour). Tous les formats de visas étrangers et internationaux (USA 5×5 cm, Chine, Inde, etc.) sont traités exclusivement sur notre application mobile IDidem (iOS & Android).",
		sampleImage: "/photo_homme.png",
		sampleCaption: "Photos Visa Internationales Conformes aux Normes Mondiales",
		specTitle: "Les exigences spécifiques des photos pour visas internationaux sur l'application",
		specText: "Contrairement aux titres français (qui interdisent le fond blanc), de nombreuses ambassades comme les États-Unis (visa américain B1/B2, formulaire DS-160, Green Card, loterie DV), l'Inde ou la Chine imposent un fond blanc pur et des dimensions spécifiques (comme le format carré 2×2 pouces / 51×51 mm). L'application mobile IDidem adapte automatiquement les ratios et fonds réglementaires de votre pays de destination.",
		specPoints: [
			"Format USA 51×51 mm (2×2 pouces) fond blanc pur pour formulaire DS-160 et visa américain (sur l'app mobile)",
			"Format Inde 50×50 mm conforme e-Visa touristique et démarches consulaires (sur l'app mobile)",
			"Format Chine 33×48 mm avec proportions spécifiques requises par le centre des visas chinois (sur l'app mobile)",
			"Format Canada 50×70 mm et 35×45 mm pour AVE, permis d'études ou résidence permanente (sur l'app mobile)",
			"Formats Schengen & pays du Maghreb (Algérie, Maroc, Tunisie) avec option fond blanc",
			"Fichier HD prêt à l'emploi pour téléversement en ligne ou impression planche 6 photos",
			"Application mobile traduite en 11 langues pour vos voyages dans le monde entier"
		],
		stepsTitle: "Comment faire vos photos de visa sur l'application mobile IDidem ?",
		steps: [
			{
				num: "1",
				title: "Téléchargez l'application IDidem",
				desc: "Disponible gratuitement sur l'App Store (iPhone) et Google Play (Android). Sélectionnez votre pays de destination pour activer le bon gabarit."
			},
			{
				num: "2",
				title: "Prenez votre photo face au smartphone",
				desc: "Notre outil adapte automatiquement les dimensions (5×5 cm, 35×45 mm, 33×48 mm) et applique le fond blanc pur ou clair réglementaire."
			},
			{
				num: "3",
				title: "Téléchargement immédiat et conformité garantie",
				desc: "Récupérez le fichier numérique HD prêt à être téléversé sur le site du consulat ou la planche prête à être imprimée."
			}
		],
		faqs: [
			{
				q: "Puis-je réaliser ma photo de visa étranger directement sur le site web ididemWebApp ?",
				a: "Non. Le site web ididemWebApp est spécialement calibré pour les démarches administratives françaises (passeport, carte d'identité, e-photo ANTS permis et séjour). Pour créer des photos de visas étrangers (format carré américain 5×5 cm, visa chinois, visa indien, etc.), vous devez utiliser notre application mobile IDidem sur smartphone iOS ou Android, qui prend en charge tous les formats internationaux et dispose d'une interface en 11 langues."
			},
			{
				q: "Quelles sont les dimensions d'une photo pour un visa américain (USA) ?",
				a: "Les États-Unis imposent un format carré de 2×2 pouces (soit 51×51 mm ou 5×5 cm), avec un fond blanc obligatoire et la tête occupant entre 50% et 69% de la hauteur totale de l'image. L'application mobile IDidem génère exactement ce ratio pour vos formulaires DS-160 ou loterie Green Card."
			},
			{
				q: "Le fond blanc est-il autorisé pour les visas ?",
				a: "Oui, et il est même obligatoire pour la plupart des pays hors Union Européenne (USA, Chine, Inde, etc.), alors qu'il est interdit pour les passeports et CNI français. L'application IDidem propose l'option Fond Blanc pour répondre à ces exigences internationales."
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

