<!-- src/routes/+page.svelte -->
<script>
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
			title: "Cadrez avec le guide",
			desc: "Le guide vert dynamique s'aligne automatiquement sur votre visage pour un cadrage biométrique parfait."
		},
		{
			num: "2",
			title: "Dérapage & Fond automatique",
			desc: "Notre IA de précision supprime le fond de votre pièce et crée le fond uni réglementaire (bleu, gris, blanc)."
		},
		{
			num: "3",
			title: "Imprimez ou Recevez",
			desc: "Téléchargez votre planche 10x15cm immédiatement, ou recevez-la chez vous par la poste avec un étui offert."
		}
	];

	let advantages = [
		{
			title: "Guidage en temps réel",
			desc: "Ne devinez plus. L'écran affiche un contour dynamique vert dès que la luminosité, la distance et l'expression sont idéales."
		},
		{
			title: "15 ans d'expertise photo",
			desc: "Créée par des photographes professionnels. Nous connaissons les moindres exigences des mairies et des consulats."
		},
		{
			title: "Idéal pour toute la famille",
			desc: "Plus de pleurs ou de contorsions en cabine. Prenez vos nourrissons, enfants et seniors tranquillement chez vous."
		},
		{
			title: "Accessibilité totale",
			desc: "Notre solution permet aux aidants et personnes à mobilité réduite de faire leurs démarches sans fatigue ni déplacement."
		}
	];

	let faqs = [
		{
			q: "Comment fonctionne la garantie Conforme ou Remboursé ?",
			a: "C'est simple : si votre photo est rejetée en mairie ou par l'ANTS, envoyez-nous une photo du courrier ou un screenshot du rejet à gralypho@gmail.com. Nous vous remboursons intégralement sous 48h."
		},
		{
			q: "Comment puis-je imprimer mes photos d'identité ?",
			a: "L'application génère une planche au format standard 10x15cm (contenant 6 photos d'identité). Vous pouvez l'imprimer pour quelques centimes dans n'importe quelle borne photo de supermarché ou pharmacie."
		},
		{
			q: "Les photos de bébé sont-elles acceptées ?",
			a: "Oui ! C'est même le point fort d'IDidem. Il est extrêmement difficile d'obtenir une photo conforme avec un bébé dans un photomaton classique. Chez vous, allongé ou assis, vous pouvez multiplier les essais."
		}
	];

	let co2Saved = 14280; // Example live counter representation
</script>

<svelte:head>
	<title>IDidem - Vos photos d'identité officielles et certifiées conformes</title>
	<meta name="description" content="Prenez vos photos d'identité conformes (passeport, carte d'identité, visa) en 30 secondes chez vous avec notre guidage biométrique intelligent. Conforme ANTS/OACI." />
</svelte:head>

<main class="landing">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container hero-grid">
			<div class="hero-text animate-fade-in-up">
				<div class="badge">🇫🇷 Technologie Française & Expertise Photographe</div>
				<h1>Vos photos d'identité en <span class="highlight">2 minutes</span></h1>
				<p class="subtitle">Plus de 190 normes officielles. Prenez votre photo chez vous avec notre guide intelligent en temps réel. Simple, rapide et 100% conforme.</p>
				
				<div class="cta-group">
					<a href="https://apps.apple.com/fr/app/ididem" class="primary-btn">Télécharger sur l'App Store</a>
					<a href="#how-it-works" class="secondary-btn">Comment ça marche ?</a>
				</div>

				<div class="trust-indicators">
					<span>✔️ ANTS & OACI Conforme</span>
					<span>•</span>
					<span>🔒 Données 100% Privées</span>
				</div>
			</div>
			
			<div class="hero-visual">
				<div class="cards-fan">
					<!-- Carte 1 (arrière gauche) -->
					<div class="card-wrapper card-back-left">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder child"></div>
							</div>
							<div class="card-badge">Passeport FR</div>
						</div>
					</div>
					
					<!-- Carte 2 (centrale / dessus) -->
					<div class="card-wrapper card-center">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder woman"></div>
							</div>
							<div class="card-badge primary">Conforme ANTS</div>
						</div>
					</div>
					
					<!-- Carte 3 (arrière droite) -->
					<div class="card-wrapper card-back-right">
						<div class="id-card">
							<div class="id-photo-frame">
								<div class="avatar-placeholder man"></div>
							</div>
							<div class="card-badge">Visa US</div>
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

	<!-- Advantages / Features -->
	<section id="features" class="features-section">
		<div class="container">
			<h2 class="section-title text-center">Pourquoi choisir <span class="highlight">IDidem</span> ?</h2>
			<p class="section-subtitle text-center">L'expertise de photographes d'identité de plus de 15 ans directement sur votre smartphone.</p>
			
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

	<!-- How It Works -->
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

	<!-- Green impact -->
	<section class="eco-section">
		<div class="container text-center">
			<div class="eco-badge">🌱 Application Éco-Responsable</div>
			<h2>Zéro trajet, zéro CO₂ pour vos photos</h2>
			<p>En évitant les déplacements inutiles en voiture vers les cabines ou les studios de photographie, les utilisateurs d'IDidem ont déjà économisé plus de <strong>{co2Saved} kg de CO₂</strong>.</p>
		</div>
	</section>

	<!-- Guarantee -->
	<section class="guarantee-section">
		<div class="container guarantee-card">
			<div class="badge-shield">🛡️</div>
			<h2>Garantie Conforme ou Remboursé</h2>
			<p>
				Notre guidage intelligent en temps réel garantit la conformité de votre pose. Si, malgré tout, votre photo était refusée au guichet administratif, nous vous remboursons instantanément. Il vous suffit d'envoyer votre justificatif de refus par e-mail.
			</p>
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="pricing-section">
		<div class="container">
			<h2 class="section-title text-center">Des prix justes et transparents</h2>
			<div class="pricing-grid">
				<div class="price-card">
					<h3>Fichier Digital seul</h3>
					<div class="price">1,99 €</div>
					<p class="price-desc">Générez votre planche HD en 30 secondes et imprimez-la en borne photo ou chez vous.</p>
					<ul>
						<li>✓ Planche 6 photos d'identité certifiées</li>
						<li>✓ Conforme ANTS / OACI</li>
						<li>✓ Téléchargement instantané</li>
					</ul>
				</div>
				<div class="price-card popular">
					<div class="popular-badge">Recommandé</div>
					<h3>Livraison par la poste</h3>
					<div class="price">9,99 €</div>
					<p class="price-desc">Idéal si vous n'avez pas d'imprimante ou de borne photo à proximité.</p>
					<ul>
						<li>✓ 6 photos imprimées sur papier photo labo</li>
						<li>✓ Étui de protection carte d'identité offert</li>
						<li>✓ Livraison gratuite en boîte aux lettres</li>
					</ul>
				</div>
			</div>
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
		color: #e3f2fd;
		text-shadow: 0 2px 10px rgba(0,0,0,0.15);
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
	.primary-btn {
		background: var(--white);
		color: var(--blue-700);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		box-shadow: 0 4px 15px rgba(0,0,0,0.15);
		transition: var(--transition-fast);
	}
	.primary-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0,0,0,0.25);
	}
	.secondary-btn {
		border: 2px solid rgba(255, 255, 255, 0.4);
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		transition: var(--transition-fast);
	}
	.secondary-btn:hover {
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
		background-size: 150%;
		background-position: center 30%;
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

	/* Guarantee Section */
	.guarantee-section {
		background: var(--white);
		padding: 6rem 0;
	}
	.guarantee-card {
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		padding: 3rem;
		border-radius: var(--radius-xl);
		text-align: center;
		max-width: 800px;
	}
	.badge-shield {
		font-size: 3rem;
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
</style>
