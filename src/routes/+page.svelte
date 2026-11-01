<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import childImg from '$lib/assets/enfant.jpg';

	let storeLink = $state("https://apps.apple.com/fr/iphone/search?term=ididem");
	let storeText = $state("Télécharger pour Apple");

	onMount(() => {
		const userAgent = navigator.userAgent || navigator.vendor;
		if (/android/i.test(userAgent)) {
			storeLink = "https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr";
			storeText = "Télécharger pour Android";
		}
	});

	// Data and references for the landing page
	let stats = [
		{ value: "190+", label: "Pays compatibles" },
		{ value: "100%", label: "Conforme OACI/ANTS" },
		{ value: "30s", label: "Prise de vue rapide" },
		{ value: "0", label: "Rejet signalé" }
	];

	let steps = [
		{
			num: "1",
			title: "Prise de vue guidée sur smartphone",
			desc: "Placez votre visage au centre du viseur biométrique interactif. Notre outil vérifie la posture, la neutralité du regard et applique le fond uni réglementaire conforme ANTS."
		},
		{
			num: "2",
			title: "Signature numérique & Contrôle de conformité",
			desc: "Signez directement avec votre doigt sur l'écran tactile de votre smartphone pour générer votre planche e-photo ANTS officielle avec signature intégrée."
		},
		{
			num: "3",
			title: "Code e-Photo à 22 caractères ou Planche 35×45mm",
			desc: "Recevez instantanément votre code e-photo par e-mail pour ants.gouv.fr (permis et titre de séjour) ou téléchargez votre planche 6 photos certifiée pour la Mairie."
		}
	];

	let advantages = [
		{
			title: "e-Photo ANTS officielle avec signature numérique",
			desc: "Obtenez en 2 minutes votre code officiel à 22 caractères obligatoire pour vos démarches en ligne de permis de conduire et titre de séjour sur ants.gouv.fr."
		},
		{
			title: "Photos certifiées Passeport, CNI & Mairie",
			desc: "Planches de photos d'identité haute définition conformes aux normes internationales OACI (ISO/IEC 19794-5) garanties acceptées en Mairie, Préfecture et Consulat."
		},
		{
			title: "Spécial Bébé, Nourrisson & Famille",
			desc: "Évitez le cauchemar des cabines Photomaton avec un nouveau-né. Prenez la photo chez vous au calme sur smartphone avec essais illimités gratuits jusqu'au cliché parfait."
		},
		{
			title: "Démarches 100% en ligne sans déplacement",
			desc: "Fini les files d'attente en cabine de gare ou supermarché. Réalisez vos photos officielles en ligne depuis votre canapé avec garantie Conforme ou Remboursé."
		}
	];

	let faqs = [
		{
			q: "Comment obtenir un code e-photo ANTS pour le permis de conduire ou le titre de séjour ?",
			a: "Prenez votre photo sur l'application IDidem au smartphone, signez sur l'écran tactile et validez. Vous recevez immédiatement par e-mail votre code sécurisé à 22 caractères transmis au serveur de l'ANTS, à reporter directement sur ants.gouv.fr ou sur la plateforme ANEF."
		},
		{
			q: "Les photos prises sur smartphone sont-elles acceptées en Mairie pour un passeport ou une CNI ?",
			a: "Oui, à 100%. Nos planches 6 photos respectent rigoureusement la norme internationale ISO/IEC 19794-5 (dimensions 35×45mm, hauteur du visage 32-36mm, fond uni gris clair sans ombre). Elles sont validées par nos photographes professionnels et garanties acceptées par toutes les mairies de France."
		},
		{
			q: "Comment fonctionne la signature numérique sur smartphone ?",
			a: "À la suite de la prise de vue, notre écran de signature vous permet d'apposer votre signature manuscrite avec le doigt ou un stylet. Cette signature est cryptée et intégrée à votre planche e-photo officielle pour l'administration."
		},
		{
			q: "Comment réussir la photo d'identité d'un bébé ou nourrisson à la maison ?",
			a: "Allongez votre bébé sur le dos sur un drap clair, à la lumière du jour (sans flash). Positionnez votre smartphone au-dessus de lui et prenez la photo lorsqu'il regarde vers vous. Notre IA détoure automatiquement le contour et applique le fond réglementaire sans laisser apparaître les mains des parents."
		},
		{
			q: "Peut-on utiliser les photos IDidem pour la Carte Vitale ou un visa étranger ?",
			a: "Absolument. Nos photos officielles 35×45mm sont conformes pour l'espace Ameli (Carte Vitale), les cartes de transport, et nous couvrons également tous les formats internationaux (visas USA, Canada, Chine, Inde, etc.) sur nos applications mobiles."
		},
		{
			q: "Quelle est la différence entre IDidem et une cabine Photomaton classique ?",
			a: "Avec IDidem, vous ne vous déplacez pas, vous faites autant d'essais gratuits que nécessaire pour être satisfait de votre photo, vous signez directement sur votre smartphone pour l'e-photo, et chaque cliché est contrôlé pour éviter tout rejet en mairie ou préfecture."
		}
	];

	const homeJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'name': 'IDidem',
				'url': 'https://ididem.com',
				'description': 'Photos d\'identité officielles et e-Photo ANTS en ligne sur smartphone en 2 minutes.'
			},
			{
				'@type': 'Organization',
				'name': 'IDidem',
				'url': 'https://ididem.com',
				'logo': 'https://ididem.com/logoIdidem_1024.png'
			},
			{
				'@type': 'Service',
				'name': 'Photos d\'identité en ligne et e-Photo ANTS officielle',
				'provider': {
					'@type': 'Organization',
					'name': 'IDidem'
				},
				'description': 'Service agréé de photos d\'identité et e-photo ANTS avec signature numérique pour permis de conduire, passeport, carte d\'identité, titre de séjour et carte vitale.',
				'areaServed': 'FR'
			},
			{
				'@type': 'FAQPage',
				'mainEntity': faqs.map(f => ({
					'@type': 'Question',
					'name': f.q,
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': f.a
					}
				}))
			}
		]
	});

	let co2Saved = 14280; // Example live counter representation
</script>

<svelte:head>
	<title>Photo d'identité en ligne & e-Photo ANTS sur smartphone | IDidem</title>
	<meta name="description" content="Faites vos photos d'identité en ligne et e-photo ANTS sur smartphone en 2 minutes. Conforme passeport, carte d'identité, permis de conduire, titre de séjour et carte vitale." />
	<link rel="canonical" href="https://ididem.com" />
	<meta property="og:title" content="Photo d'identité en ligne & e-Photo ANTS sur smartphone | IDidem" />
	<meta property="og:description" content="Faites vos photos d'identité en ligne et e-photo ANTS sur smartphone en 2 minutes. Conforme passeport, carte d'identité, permis de conduire, titre de séjour et carte vitale." />
	<meta property="og:url" content="https://ididem.com" />
	<meta property="og:type" content="website" />

	<!-- Structured Data JSON-LD pour Google Search Rich Snippets (FAQPage + Service) -->
	{@html `<script type="application/ld+json">${homeJsonLd}</script>`}
</svelte:head>

<main class="landing">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container hero-grid">
			<div class="hero-text animate-fade-in-up">
				<div class="badge">🇫🇷 Technologie Française & Expertise Photographes professionnels</div>
				<h1>Vos photos d'identité et e-Photo ANTS <span class="highlight2">en ligne sur smartphone</span></h1>
				<p class="subtitle">Prenez votre photo d'identité officielle sur smartphone en 2 minutes. Conforme passeport, carte d'identité, permis de conduire, titre de séjour et carte vitale. Guidage biométrique intelligent 100% conforme ANTS & OACI.</p>
				
				<div class="cta-group">
					<a href={storeLink} class="primary-btn">{storeText}</a>
					<a href="/photo" class="secondary-btn" style="font-size: 1.25rem; padding: 1.1rem 2.5rem; display: inline-block; text-decoration: none; background: #ff7a00; color: var(--white); border: none; box-shadow: 0 4px 15px rgba(255, 122, 0, 0.35);">Prendre une photo</a>
				</div>

				<div class="trust-indicators">
					<span>✔️ ANTS & OACI Conforme</span>
					<span>🔒 Données 100% Privées</span>
				</div>
			</div>
			
			<div class="hero-visual">
				<div class="cards-fan">
					<!-- Carte 1 (arrière gauche) -->
					<div class="card-wrapper card-back-left">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder child" style="background-image: url({childImg})"></div>
							</div>
							<div class="card-badge">Passeport & CNI</div>
						</div>
					</div>
					
					<!-- Carte 2 (centrale / dessus) -->
					<div class="card-wrapper card-center">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder woman"></div>
							</div>
							<div class="card-badge primary">E-photo ANTS</div>
						</div>
					</div>
					
					<!-- Carte 3 (arrière droite) -->
					<div class="card-wrapper card-back-right">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder man"></div>
							</div>
							<div class="card-badge">Formats internationaux</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Grid -->
	<section class="stats-section">
		<div class="container stats-grid">
			{#each stats as stat}
				<div class="stat-card">
					<h3>{stat.value}</h3>
					<p>{stat.label}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Advantages / Features (Pourquoi choisir IDidem) -->
	<section id="features" class="features-section">
		<div class="container">
			<h2 class="section-title text-center">Pourquoi choisir <span class="highlight">IDidem</span> ?</h2>
			<p class="section-subtitle text-center">L'expertise de photographes professionnels d'identité depuis plus de 20 ans directement sur votre smartphone.</p>
			
			<div class="features-grid">
				{#each advantages as adv}
					<div class="feature-card">
						<h4>{adv.title}</h4>
						<p>{adv.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing (Tarifs) -->
	<section id="pricing" class="pricing-section">
		<div class="container">
			<h2 class="section-title text-center">Des tarifs simples et transparents</h2>
			<p class="section-subtitle text-center" style="margin-bottom: 2rem;">Toutes nos formules incluent la validation réglementaire de notre équipe.</p>
			
			<div class="pricing-grid">
				<!-- e-Photo ANTS -->
				<div class="price-card popular">
					<div class="popular-badge">Recommandé</div>
					<h3>e-Photo ANTS</h3>
					<div class="price">6,99 €</div>
					<p class="price-desc">Permis de conduire & Titre de séjour. Inclus le code ANTS et la signature en direct.</p>
					<ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
						<li>✓ Code officiel ANTS fourni</li>
						<li>✓ Garantie conformité 100%</li>
						<li>✓ Assistance guidée pas à pas</li>
					</ul>
					<a href="/photo?formula=e-photo" class="secondary-btn" style="display: block; text-align: center; text-decoration: none; background: #ff7a00; color: var(--white); box-shadow: 0 4px 15px rgba(255,122,0,0.25);">Choisir cette formule</a>
				</div>

				<!-- Officielle OACI -->
				<div class="price-card">
					<h3>Officielle OACI</h3>
					<div class="price">4,99 €</div>
					<p class="price-desc">Carte d'identité, Passeport, Visa, Carte vitale. Format planche 35x45mm.</p>
					<ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
						<li>✓ Planche de 6 photos d'identité HD</li>
						<li>✓ Option Fond Blanc (Maghreb)</li>
						<li>✓ Téléchargement numérique immédiat</li>
					</ul>
					<a href="/photo?formula=officielle" class="secondary-btn" style="display: block; text-align: center; text-decoration: none; border: 2px solid #ea580c; color: #ea580c; background: transparent; box-shadow: none; padding: 0.8rem 2rem;">Choisir cette formule</a>
				</div>

				<!-- Portrait Pro CV -->
				<div class="price-card">
					<h3>Portrait Pro LinkedIn</h3>
					<div class="price">2,99 €</div>
					<p class="price-desc">Pour vos CV, réseaux sociaux et profils professionnels. Rendu studio haut de gamme.</p>
					<ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
						<li>✓ Détourage de précision par IA</li>
						<li>✓ Palette de fonds de studio</li>
						<li>✓ Pipette de couleur sur mesure</li>
						<li>✓ Fichier HD haute résolution</li>
					</ul>
					<a href="/photo?formula=casual" class="secondary-btn" style="display: block; text-align: center; text-decoration: none; border: 2px solid #ea580c; color: #ea580c; background: transparent; box-shadow: none; padding: 0.8rem 2rem;">Choisir cette formule</a>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works (Comment ça marche) -->
	<section id="how-it-works" class="how-section">
		<div class="container">
			<h2 class="section-title text-center">Comment ça marche ?</h2>
			<div class="steps-grid">
				{#each steps as step}
					<div class="step-card">
						<div class="step-num">{step.num}</div>
						<h4>{step.title}</h4>
						<p>{step.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Section Application Mobile (International) -->
	<section class="app-mobile-section">
		<div class="container">
			<div class="app-mobile-card">
				<div class="app-mobile-text">
					<span class="app-badge">📱 APPLICATION MOBILE IOS & ANDROID • 11 LANGUES</span>
					<h2>Vos photos d'identité et e-Photo ANTS aussi sur notre application mobile</h2>
					<p>
						Vous préférez utiliser une application installée sur votre smartphone ? Retrouvez toute la puissance d'<strong>IDidem</strong> sur l'App Store et Google Play. 
						Générez votre <strong>e-photo officielle ANTS avec signature numérique</strong> pour le permis de conduire ou le titre de séjour, et vos photos d'identité conformes pour <strong>passeport, carte d'identité (CNI) et bébés</strong> en 2 minutes chrono.
					</p>
					<p class="app-details">
						<strong>Le + exclusif de l'application :</strong> elle prend en charge <strong>tous les formats officiels internationaux</strong> (visas USA, Canada, Chine, Inde, passeports étrangers) et est intégralement disponible en <strong>11 langues</strong> pour vous accompagner partout dans le monde.
					</p>
					
					<div class="store-buttons">
						<a href="https://apps.apple.com/fr/iphone/search?term=ididem" target="_blank" rel="noopener noreferrer" class="store-btn">
							<span class="store-icon">🍏</span>
							<div class="store-btn-text">
								<span class="sub-text">Télécharger dans l'</span>
								<span class="main-text">App Store</span>
							</div>
						</a>
						<a href="https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr" target="_blank" rel="noopener noreferrer" class="store-btn">
							<span class="store-icon">🤖</span>
							<div class="store-btn-text">
								<span class="sub-text">Disponible sur</span>
								<span class="main-text">Google Play</span>
							</div>
						</a>
					</div>
				</div>
				<div class="app-mobile-visual">
					<div class="phone-mockup-real">
						<img src="/assets/app-screenshot-1.png" alt="Application mobile IDidem pour démarches ANTS et titres d'identité" class="phone-main-screenshot" />
					</div>
					<div class="app-screenshots-strip">
						<img src="/assets/app-screenshot-2.png" alt="Guides biométriques de cadrage sur smartphone IDidem" />
						<img src="/assets/app-screenshot-3.png" alt="Détourage IA conforme et validation biométrique IDidem" />
						<img src="/assets/app-screenshot-4.png" alt="Génération de code officiel ANTS et planche 35x45mm IDidem" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Section Expertise Photographe vs IA -->
	<section class="expertise-section">
		<div class="container">
			<div class="expertise-content">
				<span class="expertise-badge">💡 EXPERTISE & AGRÉMENT OFFICIEL</span>
				<h2>Une application photo d'identité conçue par des artisans photographes</h2>
				<p class="lead-text">
					Faire une photo d'identité ou une e-photo officielle réglementaire est un métier de haute précision. 
					IDidem a été conçue par des artisans photographes cumulant <strong>plus de 20 ans d'expérience</strong> dans l'identité biométrique conforme aux exigences strictes de l'ANTS, des mairies et des préfectures.
				</p>
				<div class="expertise-arguments">
					<div class="arg-item">
						<h4>⚠️ Pourquoi une simple IA ne suffit pas pour un passeport ou un permis ?</h4>
						<p>
							Beaucoup d'applications se contentent d'un filtre automatique qui valide par erreur des photos non conformes (ombres légères, inclinaison du regard, reflet imperceptible). Résultat : votre dossier de passeport ou de permis de conduire est rejeté en mairie ou sur ants.gouv.fr après plusieurs semaines d'attente.
						</p>
					</div>
					<div class="arg-item">
						<h4>🎓 Double contrôle biométrique & Agrément ANTS officiel</h4>
						<p>
							Chez IDidem, vous bénéficiez du meilleur des deux mondes : un cadrage intelligent temps réel guidé au millimètre selon les normes OACI (ISO/IEC 19794-5), associé au contrôle rigoureux d'experts de l'identité. C'est l'assurance d'une acceptation à 100% pour vos titres sécurisés (CNI, passeport, permis, titre de séjour).
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Green impact (Application éco-responsable) -->
	<section class="eco-section">
		<div class="container text-center">
			<div class="eco-badge">🌱 Application Éco-Responsable</div>
			<h2>Zéro trajet, zéro CO₂ pour vos photos</h2>
			<p>En évitant les déplacements inutiles en voiture vers les cabines ou les studios de photographie, les utilisateurs d'IDidem ont déjà économisé plus de <strong>{co2Saved} kg de CO₂</strong>.</p>
		</div>
	</section>



	<!-- FAQ -->
	<section id="faq" class="faq-section">
		<div class="container">
			<h2 class="section-title text-center">Questions fréquentes</h2>
			<div class="faq-list">
				{#each faqs as faq}
					<div class="faq-item">
						<h4>{faq.q}</h4>
						<p>{faq.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	.landing {
		background-color: var(--gray-50);
	}
	
	/* Hero styling */
	.hero {
		background: var(--gradient-hero);
		color: var(--white);
		padding: 6rem 0;
		position: relative;
	}
	.hero-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 4rem;
		align-items: center;
	}
	.badge {
		background: rgba(255, 255, 255, 0.15);
		padding: 0.5rem 1rem;
		border-radius: var(--radius-full);
		font-size: 0.85rem;
		font-weight: 600;
		display: inline-block;
		margin-bottom: 1.5rem;
	}
	.hero h1 {
		color: var(--white);
		font-size: clamp(2.5rem, 5vw, 3.8rem);
		font-weight: 900;
		line-height: 1.15;
		margin-bottom: 1.5rem;
	}
	.highlight {
		color: #1D70C8;
		
	}
	.highlight2 {
		color: #ffde59;
		font-weight: 800;
		text-shadow: 0 0 10px rgba(255, 222, 89, 0.35);
	}
	.subtitle {
		font-size: 1.2rem;
		line-height: 1.7;
		opacity: 0.95;
		margin-bottom: 2.5rem;
		max-width: 600px;
	}
	.cta-group {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.secondary-btn {
		background: var(--white);
		color: var(--blue-700);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		box-shadow: 0 4px 15px rgba(0,0,0,0.15);
		transition: var(--transition-fast);
	}
	.secondary-btn:hover {	
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0,0,0,0.25);
	}
	.primary-btn {
		border: 2px solid rgba(255, 255, 255, 0.4);
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		transition: var(--transition-fast);
	}
	.primary-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	.trust-indicators {
		display: flex;
		gap: 1rem;
		font-size: 0.85rem;
		opacity: 0.85;
	}

	/* Cards fan styling */
	.cards-fan {
		position: relative;
		height: 380px;
		width: 100%;
		max-width: 320px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-wrapper {
		position: absolute;
		width: 200px;
		transition: z-index var(--transition-normal);
	}
	.id-card {
		width: 100%;
		background: var(--white);
		border-radius: var(--radius-md);
		padding: 1rem;
		box-shadow: var(--shadow-xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		transition: transform var(--transition-normal), box-shadow var(--transition-normal);
		border: 1px solid var(--gray-200);
	}
	/* Hover effect applied on parent wrapper but animates child card */
	.card-wrapper:hover {
		z-index: 10 !important;
	}
	.card-wrapper:hover .id-card {
		transform: scale(1.05) translateY(-20px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}
	.id-photo-frame {
		width: 140px;
		height: 180px;
		background: #f1f5f9;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 1px solid var(--gray-300);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.avatar-placeholder {
		width: 100%;
		height: 100%;
		position: relative;
		background-size: 180%;
		background-position: center 25%;
		background-repeat: no-repeat;
	}
	.avatar-placeholder.man {
		background-image: url('/photo_homme.png');
	}
	.avatar-placeholder.child {
		background-image: url('/photo_enfant.png');
		background-size: 115%;
		background-position: center 15%;
	}
	.avatar-placeholder.woman {
		background-image: url('/photo_femme.png');
		background-size: 185%;
		background-position: center 30%;
	}
	.card-badge {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--gray-600);
		background: var(--gray-100);
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
	}
	.card-badge.primary {
		color: var(--white);
		background: var(--blue-600);
	}
	
	/* Fan positions and rotations on the wrapper */
	.card-back-left {
		transform: rotate(-10deg) translateX(-140px) translateY(15px);
		z-index: 1;
	}
	.card-center {
		transform: rotate(0deg) translateY(-15px);
		z-index: 3;
	}
	.card-center .id-card {
		box-shadow: 0 15px 35px rgba(21, 101, 192, 0.2);
		border-color: var(--blue-200);
	}
	.card-back-right {
		transform: rotate(10deg) translateX(140px) translateY(15px);
		z-index: 2;
	}

	/* Stats section */
	.stats-section {
		background: var(--white);
		padding: 3rem 0;
		border-bottom: 1px solid var(--gray-200);
	}
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
		text-align: center;
	}
	.stat-card h3 {
		font-size: 2.5rem;
		color: var(--blue-600);
		font-weight: 800;
		margin-bottom: 0.25rem;
	}
	.stat-card p {
		color: var(--gray-500);
		font-weight: 600;
	}

	/* Features */
	.features-section {
		padding: 6rem 0;
		background: var(--gray-50);
	}
	.section-title {
		font-size: 2.2rem;
		font-weight: 800;
		margin-bottom: 1rem;
	}
	.section-subtitle {
		color: var(--gray-500);
		margin-bottom: 4rem;
	}
	.features-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2.5rem;
	}
	.feature-card {
		background: var(--white);
		border: 1px solid var(--gray-200);
		padding: 2rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}
	.feature-card h4 {
		font-size: 1.25rem;
		color: var(--blue-700);
		margin-bottom: 0.75rem;
	}

	/* How Section */
	.how-section {
		background: var(--white);
		padding: 6rem 0;
	}
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
		margin-top: 4rem;
	}
	.step-card {
		text-align: center;
		position: relative;
	}
	.step-num {
		background: var(--blue-50);
		color: var(--blue-700);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 800;
		margin: 0 auto 1.5rem auto;
	}
	.step-card h4 {
		margin-bottom: 0.75rem;
		font-size: 1.2rem;
	}

	/* Eco Section */
	.eco-section {
		background: #eaf6ec;
		color: #2e7d32;
		padding: 5rem 0;
	}
	.eco-badge {
		background: rgba(46, 125, 50, 0.1);
		color: #2e7d32;
		font-weight: 700;
		padding: 0.4rem 1rem;
		border-radius: var(--radius-full);
		display: inline-block;
		margin-bottom: 1rem;
	}
	.eco-section h2 {
		color: #1b5e20;
		margin-bottom: 1rem;
	}

	
	/* Pricing */
	.pricing-section {
		background: var(--gray-50);
		padding: 6rem 0;
	}
	.pricing-grid {
		display: flex;
		gap: 2.5rem;
		justify-content: center;
		margin-top: 4rem;
	}
	.price-card {
		background: var(--white);
		border: 1px solid var(--gray-200);
		padding: 3rem;
		border-radius: var(--radius-xl);
		flex: 1;
		max-width: 420px;
		position: relative;
	}
	.price-card.popular {
		border-color: var(--blue-500);
		box-shadow: var(--shadow-lg);
	}
	.popular-badge {
		position: absolute;
		top: -15px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--blue-500);
		color: var(--white);
		padding: 0.3rem 1rem;
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		font-weight: 700;
	}
	.price {
		font-size: 3rem;
		font-weight: 800;
		color: var(--blue-700);
		margin: 1rem 0;
	}
	.price-desc {
		color: var(--gray-500);
		margin-bottom: 2rem;
	}
	.price-card ul {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* FAQ */
	.faq-section {
		background: var(--white);
		padding: 6rem 0;
	}
	.faq-list {
		max-width: 800px;
		margin: 4rem auto 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.faq-item h4 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 992px) {
		.hero-grid {
			grid-template-columns: 1fr;
			text-align: center;
		}
		.hero-text {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.cta-group {
			justify-content: center;
		}
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.features-grid {
			grid-template-columns: 1fr;
		}
		.steps-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.pricing-grid {
			flex-direction: column;
			align-items: center;
		}
	}

	/* Expertise Section */
	.expertise-section {
		padding: 6rem 0;
		background: var(--white);
		border-top: 1px solid var(--gray-200);
		border-bottom: 1px solid var(--gray-200);
	}

	.expertise-badge {
		background: #fef3c7;
		color: #d97706;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.85rem;
		border-radius: var(--radius-full);
		letter-spacing: 0.05em;
		display: inline-block;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.expertise-content h2 {
		font-size: 2.2rem;
		font-weight: 800;
		color: var(--gray-900);
		margin-bottom: 1.5rem;
		line-height: 1.25;
		text-align: left;
	}

	.lead-text {
		font-size: 1.15rem;
		color: var(--gray-600);
		margin-bottom: 3rem;
		line-height: 1.6;
		text-align: left;
	}

	.expertise-arguments {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2.5rem;
		text-align: left;
	}

	.arg-item {
		background: var(--gray-50);
		padding: 2rem;
		border-radius: var(--radius-lg);
		border-left: 4px solid var(--blue-500);
		border-top: 1px solid var(--gray-200);
		border-right: 1px solid var(--gray-200);
		border-bottom: 1px solid var(--gray-200);
	}

	.arg-item h4 {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--gray-900);
		margin-bottom: 0.75rem;
	}

	.arg-item p {
		font-size: 0.95rem;
		color: var(--gray-600);
		margin: 0;
		line-height: 1.6;
	}

	/* App Mobile Section */
	.app-mobile-section {
		padding: 6rem 0;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
		color: #ffffff;
	}

	.app-mobile-card {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 4rem;
		align-items: center;
		text-align: left;
	}

	.app-badge {
		background: #2563eb;
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.85rem;
		border-radius: var(--radius-full);
		letter-spacing: 0.05em;
		display: inline-block;
		margin-bottom: 1.5rem;
	}

	.app-mobile-text h2 {
		font-size: 2.25rem;
		font-weight: 800;
		margin: 0 0 1.5rem 0;
		line-height: 1.25;
		color: #ffffff;
	}

	.app-mobile-text p {
		color: #cbd5e1;
		font-size: 1.1rem;
		margin: 0 0 1.25rem 0;
		line-height: 1.6;
	}

	.app-details {
		font-size: 0.95rem !important;
		color: #94a3b8 !important;
	}

	.store-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}

	.store-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #0f172a;
		border: 1px solid #334155;
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-md);
		color: #ffffff;
		text-decoration: none;
		transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
	}

	.store-btn:hover {
		transform: translateY(-2px);
		border-color: #475569;
		background: #1e293b;
	}

	.store-icon {
		font-size: 1.5rem;
	}

	.store-btn-text {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	.store-btn-text .sub-text {
		font-size: 0.6rem;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.2;
	}

	.store-btn-text .main-text {
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.2;
	}

	/* Phone Mockup with Real Screenshots */
	.phone-mockup-real {
		width: 280px;
		margin: 0 auto 1.5rem auto;
		border-radius: 1.75rem;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		border: 6px solid #334155;
		background: #000;
	}

	.phone-main-screenshot {
		width: 100%;
		height: auto;
		display: block;
	}

	.app-screenshots-strip {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: nowrap;
	}

	.app-screenshots-strip img {
		width: 90px;
		height: auto;
		border-radius: 0.5rem;
		border: 2px solid #334155;
		opacity: 0.8;
		transition: opacity 0.2s ease, transform 0.2s ease;
		cursor: pointer;
	}

	.app-screenshots-strip img:hover {
		opacity: 1;
		transform: scale(1.08);
	}

	@media (max-width: 768px) {
		.app-mobile-card {
			grid-template-columns: 1fr;
			text-align: center;
			gap: 2rem;
		}

		.app-mobile-text h2 {
			font-size: 1.75rem;
		}

		.store-buttons {
			justify-content: center;
		}

		.phone-mockup-real {
			width: 200px;
		}

		.app-screenshots-strip img {
			width: 70px;
		}
	}

	@media (max-width: 640px) {
		.cta-group {
			flex-direction: column;
			width: 100%;
			align-items: center;
			gap: 1rem;
		}
		.primary-btn, .secondary-btn {
			width: 100%;
			max-width: 300px;
			text-align: center;
			box-sizing: border-box;
		}
		.cards-fan {
			max-width: 260px;
			height: 280px;
			margin-top: 2rem;
		}
		.card-wrapper {
			width: 140px;
		}
		.id-photo-frame {
			width: 90px;
			height: 115px;
		}
		.card-back-left {
			transform: rotate(-10deg) translateX(-80px) translateY(10px);
		}
		.card-center {
			transform: rotate(0deg) translateY(-10px);
		}
		.card-back-right {
			transform: rotate(10deg) translateX(80px) translateY(10px);
		}
			.trust-indicators {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 0.65rem;
		opacity: 0.85;
		
	}
	.trust-indicators span{
	border: 1px solid grey;
	border-radius: var(--radius-full);
		padding: 0.5rem 1rem;
		text-align: center;
	}
	.hero-grid {
	
		gap: 0rem;
		
	}
	}
</style>
