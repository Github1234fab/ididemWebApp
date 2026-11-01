<!-- src/routes/photo-permis-de-conduire/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "Photo Permis de Conduire en Ligne – e-Photo ANTS sur Smartphone | IDidem",
		description: "Faites votre photo pour permis de conduire et e-photo ANTS en ligne sur smartphone en 2 minutes. Code photo-signature à 22 caractères agréé pour auto-école et permis.",
		canonical: "https://ididem.com/photo-permis-de-conduire",
		badge: "🚗 PERMIS DE CONDUIRE AUTO & MOTO • AGRÉMENT ANTS",
		h1: "Photo Permis de Conduire en Ligne avec e-Photo ANTS sur Smartphone",
		heroSubtitle: "Obtenez immédiatement le code e-photo officiel à 22 caractères indispensable pour votre inscription en auto-école, renouvellement de permis de conduire ou duplicata après perte/vol. Prise de vue guidée et signature numérique sur smartphone.",
		focusFormula: /** @type {'e-photo'} */ ('e-photo'),
		ctaText: "Créer ma e-photo Permis de conduire →",
		sampleImage: "/photo_femme.png",
		sampleCaption: "e-Photo Officielle Permis de Conduire ANTS",
		specTitle: "La e-photo ANTS obligatoire pour le Permis de Conduire",
		specText: "Depuis la dématérialisation des démarches de permis de conduire par l'ANTS (permis.ants.gouv.fr), toutes les inscriptions en auto-école (numéro NEPH), les examens du permis et les demandes de fabrication de titre imposent une e-photo avec signature numérique intégrée.",
		specPoints: [
			"Reconnue par 100% des auto-écoles et des centres d'examen",
			"Valable pour tous les permis : B (voiture), A (moto), C/D (poids lourds), BSR/AM",
			"Code à 22 caractères accepté pour la création du numéro NEPH",
			"Idéal pour le renouvellement du permis (fin de validité des 15 ans)",
			"Signature électronique manuscrite sécurisée réalisée au doigt",
			"Transmission directe au serveur national de fabrication des permis"
		],
		stepsTitle: "Les étapes pour votre photo de permis sur smartphone",
		steps: [
			{
				num: "1",
				title: "Prenez votre cliché au smartphone",
				desc: "Suivez nos repères visuels interactifs. Le visage doit être neutre, les yeux bien ouverts et la tête droite. Le fond est détouré et remplacé automatiquement."
			},
			{
				num: "2",
				title: "Signez sur l'écran tactile",
				desc: "Apposez votre signature avec votre doigt ou un stylet dans l'espace prévu à cet effet pour l'associer à votre e-photo."
			},
			{
				num: "3",
				title: "Renseignez le code sur permis.ants.gouv.fr",
				desc: "Saisissez votre code photo-signature à 22 caractères dans votre formulaire en ligne ou transmettez-le directement à votre auto-école."
			}
		],
		faqs: [
			{
				q: "L'auto-école peut-elle utiliser mon code e-photo IDidem ?",
				a: "Oui, parfaitement. Il vous suffit de donner votre code à 22 caractères à votre auto-école. Elle pourra l'enregistrer dans votre dossier d'inscription au permis pour créer votre numéro NEPH."
			},
			{
				q: "Comment utiliser le code pour un renouvellement de permis de conduire ?",
				a: "Sur le site permis.ants.gouv.fr, lancez la démarche de renouvellement de permis (pour changement d'état civil, fin de validité ou perte). À l'étape 'Photo d'identité', cochez 'J'ai une e-photo' et renseignez le code à 22 caractères reçu d'IDidem."
			},
			{
				q: "Faut-il retirer ses lunettes pour la photo du permis ?",
				a: "Les lunettes sont tolérées si la monture est fine et les verres sans reflet ni teinte. Cependant, pour éviter tout risque de rejet par le système biométrique de l'ANTS, nous recommandons fortement de les enlever lors de la prise de vue."
			},
			{
				q: "Recevrai-je aussi une planche photo imprimable ?",
				a: "Oui. En plus de votre code numérique à 22 caractères, vous recevez par e-mail votre planche officielle en haute résolution au format PDF. Vous pouvez également choisir l'option envoi postal pour la recevoir imprimée à domicile."
			}
		]
	};
</script>

<LandingNational {...landingData} />
