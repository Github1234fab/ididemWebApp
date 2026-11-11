<!-- src/routes/e-photo-ants/+page.svelte -->
<script>
	import LandingNational from '$lib/components/LandingNational.svelte';

	const landingData = {
		title: "e-Photo ANTS & Ephoto en ligne – Photo d'identité ANTS officielle | IDidem",
		description: "Obtenez votre e-photo et photo ANTS officielle en ligne sur smartphone en 2 min. Code ephoto à 22 caractères avec signature numérique pour permis de conduire et titre de séjour.",
		canonical: "https://ididem.com/e-photo-ants",
		badge: "📜 PROCÉDURE OFFICIELLE ANTS (ANTS.GOUV.FR) • EPHOTO 100% EN LIGNE",
		h1: "Votre e-Photo ANTS Officielle & Ephoto en Ligne sur Smartphone",
		heroSubtitle: "Prenez votre photo ANTS aux normes biométriques sur votre smartphone, signez directement sur votre écran tactile et recevez votre code e-photo à 22 caractères transmis au serveur ANTS en 2 minutes chrono.",
		focusFormula: /** @type {'e-photo'} */ ('e-photo'),
		ctaText: "Obtenir mon code e-Photo ANTS →",
		sampleImage: "/photo_homme.png",
		sampleCaption: "e-Photo ANTS Biométrique avec Signature Numérique",
		specTitle: "Qu'est-ce que la e-Photo ANTS (Ephoto) et comment fonctionne le code à 22 caractères ?",
		specText: "La e-photo (ou Ephoto) est le format officiel dématérialisé exigé par le Ministère de l'Intérieur pour les téléprocédures sur ants.gouv.fr (demande ou renouvellement de permis de conduire, titre de séjour pour étrangers sur l'ANEF). Elle associe une photo d'identité biométrique rigoureusement contrôlée et votre signature numérique dans une planche numérique sécurisée.",
		specPoints: [
			"Code sécurisé unique à 22 caractères pour ants.gouv.fr et démarche ANEF",
			"Ephoto officielle certifiée conforme aux normes biométriques ISO/IEC 19794-5",
			"Signature électronique manuscrite apposée directement sur l'écran tactile",
			"Zéro papier : aucun envoi postal nécessaire pour l'administration",
			"Planche 4 photos d'identité certifiées 35×45mm incluse en téléchargement PDF",
			"Valable pour les auto-écoles, permis auto/moto et préfectures partout en France",
			"Contrôlé et validé par un photographe professionnel agréé ANTS"
		],
		stepsTitle: "Comment obtenir votre e-photo ANTS en ligne sur smartphone ?",
		steps: [
			{
				num: "1",
				title: "Prise de vue guidée sur smartphone",
				desc: "Placez votre visage au centre du gabarit biométrique interactif. Notre outil vérifie la posture, la neutralité du regard et applique le fond réglementaire uni conforme ANTS."
			},
			{
				num: "2",
				title: "Signature numérique sur votre écran",
				desc: "Signez facilement avec votre doigt ou un stylet directement sur l'écran de votre smartphone dans notre cadre sécurisé pour lier votre photo ANTS et votre signature."
			},
			{
				num: "3",
				title: "Code ANTS immédiat à 22 caractères",
				desc: "Recevez instantanément votre code e-photo par e-mail. Il vous suffit de le coller sur ants.gouv.fr ou la plateforme ANEF pour valider votre dossier."
			}
		],
		faqs: [
			{
				q: "Qu'est-ce qu'une e-photo (ou Ephoto) agréée ANTS ?",
				a: "Une e-photo (parfois écrite Ephoto) est une photo d'identité numérique couplée à une signature électronique. Elle donne lieu à un code unique à 22 caractères que l'ANTS et la préfecture utilisent pour récupérer instantanément vos éléments biométriques de manière sécurisée."
			},
			{
				q: "Où et comment utiliser le code e-photo ANTS à 22 caractères ?",
				a: "Lors de votre téléprocédure sur le site de l'ANTS (permis de conduire ou titre de séjour sur la plateforme ANEF), une étape vous demande votre code e-photo. Il vous suffit de taper ou coller les 22 caractères fournis par IDidem. L'administration récupère automatiquement votre photo conforme et votre signature sans aucun document papier."
			},
			{
				q: "Faut-il quand même imprimer la photo pour le permis ou le titre de séjour ?",
				a: "Non ! C'est tout l'intérêt de la e-photo ANTS : elle est 100% dématérialisée. Le code numérique à 22 caractères remplace l'envoi physique d'une photo papier. Vous conservez toutefois le fichier PDF de la planche pour vos archives ou une éventuelle convocation."
			},
			{
				q: "IDidem est-il agréé pour délivrer des e-photos officielles ANTS ?",
				a: "Oui. Nos e-photos sont traitées en conformité avec le cahier des charges de l'ANTS et validées par nos photographes professionnels partenaires agréés. Votre code est reconnu par tous les serveurs de téléprocédures du Ministère de l'Intérieur."
			},
			{
				q: "Combien de temps le code e-photo est-il valable ?",
				a: "Le code e-photo ANTS est valable pendant 6 mois à compter de sa date d'émission, et peut être utilisé pour valider votre démarche administrative en ligne."
			},
			{
				q: "Que se passe-t-il si ma photo est rejetée par l'ANTS ?",
				a: "Nos contrôles biométriques avancés garantissent un taux de validation de 100%. Dans l'éventualité exceptionnelle d'un refus de l'administration, nous vous proposons une nouvelle prise de vue gratuite ou un remboursement intégral immédiat."
			}
		]
	};
</script>

<LandingNational {...landingData} />
