<!-- src/routes/[type_photo=intentions]/[ville]/+page.svelte -->
<script>
	import logoIdidem from '$lib/assets/favicon.svg';
	import { villesSEO } from '$lib/data/villes.js';

	/** @type {{ data: { ville: import('$lib/data/villes').VilleSEO, typePhoto: string, seo: any } }} */
	let { data } = $props();
	const ville = $derived(data.ville);
	const typePhoto = $derived(data.typePhoto);
	const seo = $derived(data.seo);

	const allCities = Object.values(villesSEO);

	const intentionsList = [
		{ slug: 'e-photo-ants-en-ligne', label: 'e-Photo ANTS' },
		{ slug: 'photo-identite-en-ligne', label: 'Photo d\'identité' },
		{ slug: 'photo-passeport-en-ligne', label: 'Photo de passeport' },
		{ slug: 'photo-carte-identite-en-ligne', label: 'Photo carte d\'identité' },
		{ slug: 'portrait-professionnel-en-ligne', label: 'Portrait professionnel' }
	];

	// Génération des données structurées JSON-LD pour Google
	const jsonLd = $derived(JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Service',
				'name': seo.h1,
				'provider': {
					'@type': 'Organization',
					'name': 'IDidem',
					'url': 'https://ididem.com'
				},
				'areaServed': {
					'@type': 'AdministrativeArea',
					'name': `${ville.name}, ${ville.dep}`
				},
				'description': seo.description,
				'url': `https://ididem.com/${typePhoto}/${ville.slug}`
			},
			{
				'@type': 'FAQPage',
				'mainEntity': seo.faqs.map((/** @type {{ q: string, a: string }} */ faq) => ({
					'@type': 'Question',
					'name': faq.q,
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': faq.a
					}
				}))
			}
		]
	}));
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href="https://ididem.com/{typePhoto}/{ville.slug}" />

	<!-- Structured Data JSON-LD pour Google Indexing -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="seo-landing-container">
	<!-- Mini Header -->
	<header class="landing-header">
		<a href="/" class="brand">
			<img src={logoIdidem} alt="IDidem Logo" class="logo" />
			<span class="brand-name">IDidem</span>
		</a>
		<a href="/photo" class="btn-primary-sm">Lancer le Studio →</a>
	</header>

	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<span class="badge-local">{seo.badge}</span>
			<h1>{seo.h1}</h1>
			<p class="hero-subtitle">
				{seo.heroSubtitle}
			</p>
			
			<div class="hero-ctas">
				<a href="/photo?formula={seo.focusFormula || 'officielle'}" class="btn-main-cta">
					{seo.ctaText} →
				</a>
				<span class="cta-sub">Temps de réalisation : 2 minutes • Garantie conformité 100%</span>
			</div>
		</div>

		<!-- Reassurance Badges spécifiques -->
		<div class="reassurance-grid">
			<div class="reassure-card">
				<span class="icon">🏛️</span>
				<h3>{ville.mairie}</h3>
				<p>Conformité garantie pour vos démarches en mairie ou préfecture dans le département {ville.dep}.</p>
			</div>
			<div class="reassure-card">
				<span class="icon">🛂</span>
				<h3>{ville.prefecture}</h3>
				<p>Fichiers biométriques validés aux exigences du ministère de l'Intérieur ({ville.region}).</p>
			</div>
			<div class="reassure-card">
				<span class="icon">🛡️</span>
				<h3> Photographes Pros</h3>
				<p>Conçu par des artisans photographes experts en identité biométrique depuis plus de 20 ans.</p>
			</div>
		</div>
	</section>

	<!-- Local Spec Section (Spécifique par intention et ville) -->
	<section class="local-spec-section">
		<div class="spec-card">
			<div class="spec-icon">📍</div>
			<div class="spec-body">
				<h2>{seo.specTitle}</h2>
				<p>{seo.specText}</p>
			</div>
		</div>
	</section>

	<!-- How it works (Spécifique par intention) -->
	<section class="how-it-works">
		<h2>{seo.stepsTitle}</h2>
		<div class="steps-row">
			{#each seo.steps as step}
				<div class="step-card">
					<div class="step-num">{step.num}</div>
					<h3>{step.title}</h3>
					<p>{step.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Section Expertise Photographe vs IA -->
	<section class="expertise-section">
		<div class="expertise-container">
			<div class="expertise-content">
				<span class="expertise-badge">💡 UNE CONCEPTION UNIQUE</span>
				<h2>Une application conçue par des photographes professionnels</h2>
				<p class="lead-text">
					Faire une photo d'identité réglementaire est un métier de précision. 
					IDidem a été développée par des artisans photographes cumulant <strong>20 ans d'expérience</strong> dans l'identité biométrique.
				</p>
				<div class="expertise-arguments">
					<div class="arg-item">
						<h4>⚠️ Pourquoi ne pas faire confiance à 100% à l'IA automatique ?</h4>
						<p>
							Certaines applications confient entièrement la validation de votre visage à une Intelligence Artificielle générative. 
							Pourtant, à l'usage, l'IA pure valide plus de 98% de photos non conformes (léger sourire, regard légèrement décalé). Le verdict final en mairie ou préfecture est alors le rejet direct de votre dossier.
						</p>
					</div>
					<div class="arg-item">
						<h4>🎓 Le meilleur garant de la conformité, c'est VOUS guidé par des Pros</h4>
						<p>
							Chez IDidem, nous ne laissons rien au hasard. Toutes les étapes de capture et de cadrage ont été minutieusement pensées à partir des cahiers des charges réels de l'ANTS, des mairies et des préfectures. 
							Notre tutoriel interactif précis et nos repères vous responsabilisent et vous guident pas à pas pour un cliché accepté du premier coup.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Product formulas selection -->
	<section class="formulas-section">
		<h2>Nos formules disponibles {ville.prepArticle}</h2>
		<p class="section-desc">Des tarifs transparents, sans abonnement, pour toutes vos démarches administratives.</p>
		
		<div class="formulas-grid">
			<!-- Formula 1: E-Photo ANTS -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'e-photo'}>
				{#if seo.focusFormula === 'e-photo'}
					<div class="card-badge">RECOMMANDÉ POUR VOTRE RECHERCHE</div>
				{/if}
				<div class="card-header">
					<h3>e-Photo ANTS</h3>
					<span class="price">6,99 €</span>
				</div>
				<p class="formula-desc">Permis de conduire & Titre de séjour. Inclus le code ANTS à 22 caractères et la signature numérisée.</p>
				<ul class="features-list">
					<li>✓ Code photo-signature unique ANTS</li>
					<li>✓ Signature électronique sur smartphone</li>
					<li>✓ Visioconférence sécurisée avec notre agent</li>
					<li>✓ Garantie conformité 100%</li>
				</ul>
				<a href="/photo?formula=e-photo" class="btn-select">Choisir la e-Photo ANTS</a>
			</div>

			<!-- Formula 2: Photo officielle -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'officielle'}>
				{#if seo.focusFormula === 'officielle'}
					<div class="card-badge">RECOMMANDÉ POUR VOTRE RECHERCHE</div>
				{/if}
				<div class="card-header">
					<h3>Officielle Norme OACI</h3>
					<span class="price">4,99 €</span>
				</div>
				<p class="formula-desc">Carte d'identité nationale, Passeport, Visa, Carte vitale. Format planche 35x45mm.</p>
				<ul class="features-list">
					<li>✓ Planche de 6 photos haute définition</li>
					<li>✓ Fond uni (gris ou bleu) conforme France</li>
					<li>✓ Option Fond Blanc (Maghreb / Visas)</li>
					<li>✓ Téléchargement numérique immédiat</li>
				</ul>
				<a href="/photo?formula=officielle" class="btn-select">Choisir la Photo Officielle</a>
			</div>

			<!-- Formula 3: Portrait LinkedIn / CV -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'casual'}>
				{#if seo.focusFormula === 'casual'}
					<div class="card-badge">RECOMMANDÉ POUR VOTRE RECHERCHE</div>
				{/if}
				<div class="card-header">
					<h3>Portrait Pro LinkedIn</h3>
					<span class="price">2,99 €</span>
				</div>
				<p class="formula-desc">Pour vos CV, profils professionnels et réseaux sociaux. Rendu studio haut de gamme.</p>
				<ul class="features-list">
					<li>✓ Détourage de précision par IA</li>
					<li>✓ Palette étendue de fonds de couleur</li>
					<li>✓ Pipette de couleur personnalisée</li>
					<li>✓ Téléchargement haute résolution</li>
				</ul>
				<a href="/photo?formula=casual" class="btn-select">Choisir le Portrait Pro</a>
			</div>
		</div>
	</section>

	<!-- Local FAQ section -->
	<section class="faq-section">
		<h2>Questions fréquentes {ville.prepArticle} ({ville.dep})</h2>
		<div class="faq-grid">
			{#each seo.faqs as faq}
				<div class="faq-item">
					<h4>{faq.q}</h4>
					<p>{faq.a}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Internal Linking Block (Crucial pour le Crawl Googlebot) -->
	<section class="internal-linking-section">
		<div class="linking-container">
			<h3>Autre service photo {ville.prepArticle} :</h3>
			<div class="linking-chips">
				{#each intentionsList as item}
					{#if item.slug !== typePhoto}
						<a href="/{item.slug}/{ville.slug}" class="chip-link">
							{item.label} {ville.prepArticle}
						</a>
					{/if}
				{/each}
			</div>

			<h3 style="margin-top: 2rem;">Photos d'identité disponibles dans d'autres villes :</h3>
			<div class="linking-chips">
				{#each allCities as c}
					{#if c.slug !== ville.slug}
						<a href="/{typePhoto}/{c.slug}" class="chip-link">
							{c.name} ({c.depNum})
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Section Application Mobile (International) -->
	<section class="app-mobile-section">
		<div class="app-mobile-container">
			<div class="app-mobile-card">
				<div class="app-mobile-text">
					<span class="app-badge">🌍 VISA & FORMATS INTERNATIONAUX</span>
					<h2>Besoin d'un passeport étranger ou d'un visa international ?</h2>
					<p>
						Notre site web est spécialisé dans les normes de photos officielles françaises et du Maghreb. 
						Si vous devez réaliser une photo pour un visa canadien, américain, chinois, ou un passeport étranger, utilisez notre application mobile <strong>IDidem</strong>.
					</p>
					<p class="app-details">
						Disponible sur iOS et Android, elle prend en charge <strong>tous les formats officiels internationaux</strong> et est intégralement traduite en <strong>11 langues</strong>.
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
						<img src="/assets/app-screenshot-1.png" alt="Interface IDidem pour formats internationaux" class="phone-main-screenshot" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="landing-footer">
		<p>© {new Date().getFullYear()} IDidem. Tous droits réservés. Photos d'identité conformes ANTS en ligne.</p>
	</footer>
</div>

<style>
	.seo-landing-container {
		font-family: 'Inter', -apple-system, sans-serif;
		color: #1e293b;
		background-color: #f8fafc;
		min-height: 100vh;
		line-height: 1.6;
	}

	/* Header */
	.landing-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 5%;
		background: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.landing-header .brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.landing-header .logo {
		width: 36px;
		height: 36px;
	}

	.brand-name {
		font-size: 1.35rem;
		font-weight: 800;
		color: #0f172a;
		letter-spacing: -0.02em;
	}

	.btn-primary-sm {
		background: #2563eb;
		color: #ffffff;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		transition: background 0.2s;
	}

	.btn-primary-sm:hover {
		background: #1d4ed8;
	}

	/* Hero */
	.hero-section {
		padding: 3.5rem 5% 2.5rem;
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.badge-local {
		display: inline-block;
		background: #dbeafe;
		color: #1e40af;
		font-weight: 700;
		font-size: 0.8rem;
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		letter-spacing: 0.05em;
		margin-bottom: 1.25rem;
	}

	.hero-section h1 {
		font-size: clamp(1.8rem, 4vw, 2.75rem);
		font-weight: 900;
		color: #0f172a;
		line-height: 1.2;
		margin-bottom: 1.25rem;
		letter-spacing: -0.03em;
	}

	.hero-subtitle {
		font-size: 1.15rem;
		color: #475569;
		max-width: 780px;
		margin: 0 auto 2rem;
	}

	.hero-ctas {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.btn-main-cta {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: #ffffff;
		font-size: 1.2rem;
		font-weight: 700;
		padding: 1rem 2.25rem;
		border-radius: 12px;
		text-decoration: none;
		box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.btn-main-cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
	}

	.cta-sub {
		font-size: 0.85rem;
		color: #64748b;
	}

	/* Reassurance */
	.reassurance-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 3rem;
		text-align: left;
	}

	.reassure-card {
		background: #ffffff;
		padding: 1.5rem;
		border-radius: 14px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 2px 4px rgba(0,0,0,0.02);
	}

	.reassure-card .icon {
		font-size: 1.75rem;
		margin-bottom: 0.75rem;
		display: block;
	}

	.reassure-card h3 {
		font-size: 1.05rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.4rem;
	}

	.reassure-card p {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0;
	}

	/* Local Spec Section */
	.local-spec-section {
		max-width: 1100px;
		margin: 0 auto 3rem;
		padding: 0 5%;
	}

	.spec-card {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 14px;
		padding: 1.5rem;
	}

	.spec-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.spec-body h2 {
		font-size: 1.2rem;
		font-weight: 800;
		color: #1e40af;
		margin-bottom: 0.5rem;
	}

	.spec-body p {
		font-size: 0.95rem;
		color: #1e3a8a;
		margin: 0;
	}

	/* How it works */
	.how-it-works {
		background: #ffffff;
		padding: 4rem 5%;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
		text-align: center;
	}

	.how-it-works h2 {
		font-size: 1.8rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 2.5rem;
	}

	.steps-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 2rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.step-card {
		position: relative;
		padding: 2rem 1.5rem;
		background: #f8fafc;
		border-radius: 16px;
		border: 1px solid #e2e8f0;
		text-align: center;
	}

	.step-num {
		width: 42px;
		height: 42px;
		background: #2563eb;
		color: #ffffff;
		font-weight: 800;
		font-size: 1.25rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.25rem;
	}

	.step-card h3 {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.step-card p {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0;
	}

	/* Expertise Section */
	.expertise-section {
		padding: 4rem 5%;
		background: #f8fafc;
	}

	.expertise-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.expertise-badge {
		color: #2563eb;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.05em;
	}

	.expertise-content h2 {
		font-size: 1.8rem;
		font-weight: 800;
		margin: 0.5rem 0 1rem;
	}

	.lead-text {
		font-size: 1.1rem;
		color: #475569;
		margin-bottom: 2rem;
	}

	.expertise-arguments {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.75rem;
	}

	.arg-item {
		background: #ffffff;
		padding: 1.75rem;
		border-radius: 14px;
		border: 1px solid #e2e8f0;
	}

	.arg-item h4 {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: #0f172a;
	}

	.arg-item p {
		font-size: 0.92rem;
		color: #475569;
		margin: 0;
	}

	/* Formulas */
	.formulas-section {
		padding: 4rem 5%;
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.formulas-section h2 {
		font-size: 1.8rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}

	.section-desc {
		color: #64748b;
		margin-bottom: 2.5rem;
	}

	.formulas-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		text-align: left;
	}

	.formula-card {
		background: #ffffff;
		border: 2px solid #e2e8f0;
		border-radius: 18px;
		padding: 2rem;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.formula-card.highlighted {
		border-color: #2563eb;
		box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
	}

	.card-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: #2563eb;
		color: #ffffff;
		font-size: 0.7rem;
		font-weight: 800;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.card-header h3 {
		font-size: 1.25rem;
		font-weight: 800;

	}

	.price {
		font-size: 1.4rem;
		font-weight: 900;
		color: #2563eb;
	}

	.formula-desc {
		font-size: 0.9rem;
		color: #64748b;
		margin-bottom: 1.5rem;
		min-height: 48px;
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		font-size: 0.9rem;
		color: #334155;
	}

	.btn-select {
		margin-top: auto;
		display: block;
		text-align: center;
		background: #f1f5f9;
		color: #0f172a;
		font-weight: 700;
		padding: 0.85rem;
		border-radius: 10px;
		text-decoration: none;
		transition: background 0.2s;
	}

	.formula-card.highlighted .btn-select {
		background: #2563eb;
		color: #ffffff;
	}

	.btn-select:hover {
		opacity: 0.9;
	}

	/* FAQ */
	.faq-section {
		background: #ffffff;
		padding: 4rem 5%;
		border-top: 1px solid #e2e8f0;
	}

	.faq-section h2 {
		text-align: center;
		font-size: 1.8rem;
		font-weight: 800;
		margin-bottom: 2.5rem;
	}

	.faq-grid {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.faq-item {
		background: #f8fafc;
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
	}

	.faq-item h4 {
		font-size: 1.05rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.faq-item p {
		font-size: 0.92rem;
		color: #475569;
		margin: 0;
	}

	/* Internal Linking Block */
	.internal-linking-section {
		background: #0f172a;
		color: #f8fafc;
		padding: 3.5rem 5%;
	}

	.linking-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.linking-container h3 {
		font-size: 1.1rem;
		font-weight: 700;
		color: #94a3b8;
		margin-bottom: 1rem;
	}

	.linking-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.chip-link {
		background: #1e293b;
		color: #cbd5e1;
		padding: 0.4rem 0.85rem;
		border-radius: 8px;
		font-size: 0.85rem;
		text-decoration: none;
		border: 1px solid #334155;
		transition: background 0.2s, color 0.2s;
	}

	.chip-link:hover {
		background: #2563eb;
		color: #ffffff;
		border-color: #2563eb;
	}

	/* App Mobile */
	.app-mobile-section {
		padding: 4rem 5%;
		background: #f8fafc;
	}

	.app-mobile-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.app-mobile-card {
		background: #ffffff;
		border-radius: 20px;
		border: 1px solid #e2e8f0;
		padding: 3rem;
		display: flex;
		gap: 3rem;
		align-items: center;
	}

	.app-mobile-text {
		flex: 1;
	}

	.app-badge {
		color: #2563eb;
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.app-mobile-text h2 {
		font-size: 1.6rem;
		font-weight: 800;
		margin: 0.5rem 0 1rem;
	}

	.app-details {
		font-size: 0.95rem;
		color: #64748b;
		margin-bottom: 1.5rem;
	}

	.store-buttons {
		display: flex;
		gap: 1rem;
	}

	.store-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #0f172a;
		color: #ffffff;
		padding: 0.65rem 1.25rem;
		border-radius: 10px;
		text-decoration: none;
	}

	.store-icon {
		font-size: 1.5rem;
	}

	.store-btn-text {
		display: flex;
		flex-direction: column;
	}

	.sub-text {
		font-size: 0.65rem;
		color: #94a3b8;
	}

	.main-text {
		font-size: 0.95rem;
		font-weight: 700;
	}

	.app-mobile-visual {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.phone-main-screenshot {
		max-width: 260px;
		border-radius: 16px;
		box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	}

	/* Footer */
	.landing-footer {
		text-align: center;
		padding: 2rem 5%;
		background: #020617;
		color: #64748b;
		font-size: 0.85rem;
	}

	@media (max-width: 768px) {
		.app-mobile-card {
			flex-direction: column;
			padding: 2rem 1.5rem;
		}

		.store-buttons {
			flex-direction: column;
		}
	}
</style>
