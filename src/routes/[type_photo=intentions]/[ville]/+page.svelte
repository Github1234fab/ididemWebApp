<!-- src/routes/[type_photo=intentions]/[ville]/+page.svelte -->
<script>
	import logoIdidem from '$lib/assets/favicon.svg'; // Réutilise le favicon ou logo
	import ePhotoImg from '$lib/assets/EPhoto.png';
	import photoIdentity from '$lib/assets/photos-identite.webp';

	/** @type {{ data: { ville: import('$lib/data/villes').VilleSEO, typePhoto: string, seo: { title: string, description: string, h1: string, focusFormula: string } } }} */
	let { data } = $props();
	const ville = $derived(data.ville);
	const typePhoto = $derived(data.typePhoto);
	const seo = $derived(data.seo);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href="https://ididem.com/{typePhoto}/{ville.slug}" />
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
			<span class="badge-local">📍 SERVICE DISPONIBLE À {ville.name.toUpperCase()}</span>
			<h1>{seo.h1}</h1>
			<p class="hero-subtitle">
				{#if seo.focusFormula === 'e-photo'}
					Réalisez vos photos d'identité numériques et signatures agréées ANTS directement depuis chez vous {ville.prepArticle}. 
					Plus besoin de chercher une cabine de photographie agréée ou de vous déplacer.
				{:else if seo.focusFormula === 'casual'}
					Donnez une dimension professionnelle à votre profil LinkedIn, votre CV et vos réseaux. 
					Un détourage photo intelligent par IA avec des fonds de studio professionnels en 2 minutes {ville.prepArticle}.
				{:else}
					Évitez de chercher une cabine Photomaton ou un photographe {ville.prepArticle}. 
					Prenez vos photos de carte d'identité ou de passeport directement en ligne, garanties conformes ANTS.
				{/if}
			</p>
			
			<div class="hero-ctas">
				<a href="/photo?formula={seo.focusFormula || 'officielle'}" class="btn-main-cta">
					{#if seo.focusFormula === 'casual'}
						Créer mon portrait professionnel
					{:else if seo.focusFormula === 'e-photo'}
						Faire ma e-photo ANTS
					{:else}
						Prendre ma photo d'identité
					{/if}
				</a>
				<span class="cta-sub">Temps de capture moyen : 2 minutes • Conforme à 100%</span>
			</div>
		</div>

		<!-- Reassurance Badges -->
		<div class="reassurance-grid">
			<div class="reassure-card">
				<span class="icon">🏛️</span>
				<h3>Mairie de {ville.name}</h3>
				<p>Vos planches photos sont garanties conformes pour vos rendez-vous de passeport et carte d'identité, en mairie ou préfecture.</p>
			</div>
			<div class="reassure-card">
				<span class="icon">🛂</span>
				<h3>{ville.prefecture}</h3>
				<p>Fichiers numériques aux normes réglementaires du ministère de l'Intérieur pour le département {ville.dep}.</p>
			</div>
			<div class="reassure-card">
				<span class="icon">🛡️</span>
				<h3>Tutoriel Optimisé</h3>
				<p>En suivant notre tuto, conçu par notre équipe de photographes professionnels, vos photos seront acceptées à 100% par l'administration française.</p>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="how-it-works">
		<h2>Comment réaliser vos photos {ville.prepArticle} ?</h2>
		<div class="steps-row">
			<div class="step-card">
				<div class="step-num">1</div>
				<h3>Sélectionnez votre formule</h3>
				<p>Permis de conduire out titre de séjour en E-photo 100% conforme ANTS, passeport, carte d'identité ou portrait professionnel LinkedIn.</p>
			</div>
			<div class="step-card">
				<div class="step-num">2</div>
				<h3>Prenez-vous en photo</h3>
				<p>Suivez notre guide visuel interactif en ligne. Notre viseur s'occupe de l'alignement parfait.</p>
			</div>
			<div class="step-card">
				<div class="step-num">3</div>
				<h3>Détourage & Téléchargement</h3>
				<p>Notre IA supprime l'arrière-plan pour appliquer le fond réglementaire. Téléchargez vos clichés immédiatement.</p>
			</div>
		</div>
	</section>

	<!-- Section Expertise Photographe vs IA -->
	<section class="expertise-section">
		<div class="expertise-container">
			<div class="expertise-content">
				<span class="expertise-badge">💡 UNE CONCEPTION UNIQUE</span>
				<h2>Une application conçue par des photographes professionnels</h2>
				<p class="lead-text">
					Faire une photo d'identité réglementaire est un métier de précision qui ne s'invente pas. 
					IDidem a été développée par des artisans photographes cumulant <strong>20 ans d'expérience</strong> dans l'identité biométrique.
				</p>
				<div class="expertise-arguments">
					<div class="arg-item">
						<h4>⚠️ Pourquoi ne pas faire confiance à 100% à l'IA ?</h4>
						<p>
							Certaines applications confient entièrement la validation de votre visage à une Intelligence Artificielle. 
							Pourtant, à l'usage, l'IA valide plus de 98% de photos non conformes (par exemple, si vous esquissez un léger sourire ou si vos yeux ne fixent pas l'objectif). Le verdict final en mairie ou préfecture est alors le rejet.
						</p>
					</div>
					<div class="arg-item">
						<h4>🎓 Le meilleur garant de la conformité, c'est VOUS</h4>
						<p>
							Chez IDidem, nous ne laissons rien au hasard. Toutes les étapes de capture et de cadrage ont été minutieusement pensées à partir des cahiers des charges réels de l'ANTS, des mairies et des préfectures. 
							C'est notre tutoriel interactif précis et nos repères qui vous responsabilisent et vous guident pas à pas, pour que vous preniez votre cliché en parfaite connaissance de cause.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Product formulas selection -->
	<section class="formulas-section">
		<h2>Nos formules photo en ligne</h2>
		<p class="section-desc">Des tarifs transparents, sans abonnement, pour toutes vos démarches administratives.</p>
		
		<div class="formulas-grid">
			<!-- Formula 1: E-Photo ANTS -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'e-photo'}>
				{#if seo.focusFormula === 'e-photo'}
					<div class="card-badge">CIBLÉ POUR VOTRE DEMANDE</div>
				{/if}
				<div class="card-header">
					<h3>e-Photo ANTS</h3>
					<span class="price">12,99 €</span>
				</div>
				<p class="formula-desc">Permis de conduire & Titre de séjour. Inclus le code ANTS et la signature en visioconférence.</p>
				<ul class="features-list">
					<li>✓ Code photo unique ANTS fourni</li>
					<li>✓ Signature électronique sur smartphone</li>
					<li>✓ Visioconférence instantanée avec notre agent</li>
					<li>✓ Garantie conformité 100%</li>
				</ul>
				<a href="/photo?formula=e-photo" class="btn-select">Choisir cette formule</a>
			</div>

			<!-- Formula 2: Photo officielle -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'officielle' || (!seo.focusFormula && seo.focusFormula !== 'casual' && seo.focusFormula !== 'e-photo')}>
				{#if seo.focusFormula === 'officielle'}
					<div class="card-badge">CIBLÉ POUR VOTRE DEMANDE</div>
				{/if}
				<div class="card-header">
					<h3>Officielle Norme OACI</h3>
					<span class="price">6,99 €</span>
				</div>
				<p class="formula-desc">Carte d'identité nationale, Passeport, Visa, Carte vitale. Format planche 35x45mm.</p>
				<ul class="features-list">
					<li>✓ Planche de 6 photos haute définition</li>
					<li>✓ Fond bleu/gris conforme France</li>
					<li>✓ Option Fond Blanc (Maghreb)</li>
					<li>✓ Téléchargement numérique immédiat</li>
				</ul>
				<a href="/photo?formula=officielle" class="btn-select">Choisir cette formule</a>
			</div>

			<!-- Formula 3: Portrait LinkedIn / CV -->
			<div class="formula-card" class:highlighted={seo.focusFormula === 'casual'}>
				{#if seo.focusFormula === 'casual'}
					<div class="card-badge">CIBLÉ POUR VOTRE DEMANDE</div>
				{/if}
				<div class="card-header">
					<h3>Portrait Pro LinkedIn</h3>
					<span class="price">3,99 €</span>
				</div>
				<p class="formula-desc">Pour vos CV, profils professionnels et réseaux sociaux. Rendu studio haut de gamme.</p>
				<ul class="features-list">
					<li>✓ Détourage de précision par IA</li>
					<li>✓ Palette étendue de fonds de couleur</li>
					<li>✓ Pipette de couleur personnalisée</li>
					<li>✓ Téléchargement haute résolution</li>
				</ul>
				<a href="/photo?formula=casual" class="btn-select">Choisir cette formule</a>
			</div>
		</div>
	</section>

	<!-- Local FAQ section -->
	<section class="faq-section">
		<h2>Questions fréquentes à {ville.name}</h2>
		<div class="faq-grid">
			<div class="faq-item">
				<h4>Puis-je utiliser ces photos pour ma carte d'identité à la mairie de {ville.name} ?</h4>
				<p>Oui, absolument. Notre service produit des fichiers strictement conformes aux normes administratives françaises et internationales (norme ISO/IEC 19794-5). Ils sont parfaitement acceptés dans toutes les mairies de {ville.name}.</p>
			</div>
			<div class="faq-item">
				<h4>Quelle est la différence avec une cabine Photomaton classique {ville.prepArticle} ?</h4>
				<p>Chez IDidem, vous prenez la photo chez vous au calme, vous pouvez recommencer autant de fois que vous le souhaitez gratuitement, et notre outil s'occupe de créer un détourage et un fond uni parfait par intelligence artificielle.</p>
			</div>
			<div class="faq-item">
				<h4>Comment fonctionne la e-photo pour le permis de conduire ?</h4>
				<p>Après capture de votre photo, vous planifiez un court appel de visioconférence sécurisé pour signer directement à l'écran. Vous obtenez immédiatement votre code photo-signature numérique à reporter sur le site de l'ANTS.</p>
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
					<div class="phone-mockup">
						<div class="phone-screen">
							<div class="phone-app-header">IDidem Mobile</div>
							<div class="phone-app-body">
								<div class="visa-badge">🍁 Visa Canada</div>
								<div class="visa-badge">🗽 Visa USA</div>
								<div class="visa-badge">🐉 Visa Chine</div>
								<div class="visa-languages">🌐 11 Langues supportées</div>
							</div>
						</div>
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
		background: var(--white, #ffffff);
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

	.landing-header .brand-name {
		font-weight: 800;
		font-size: 1.25rem;
		color: #1e3a8a;
		letter-spacing: -0.025em;
	}

	.btn-primary-sm {
		background: #1e3a8a;
		color: #ffffff;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	.btn-primary-sm:hover {
		background: #1d4ed8;
	}

	/* Hero */
	.hero-section {
		padding: 5rem 5% 4rem;
		background: radial-gradient(circle at top right, rgba(224, 242, 254, 0.4) 0%, rgba(255, 255, 255, 0) 60%), #ffffff;
		text-align: center;
	}

	.badge-local {
		background: #e0f2fe;
		color: #0369a1;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		letter-spacing: 0.05em;
		display: inline-block;
		margin-bottom: 1.5rem;
	}

	.hero-section h1 {
		font-size: 2.75rem;
		font-weight: 800;
		color: #0f172a;
		max-width: 900px;
		margin: 0 auto 1.5rem;
		line-height: 1.2;
		letter-spacing: -0.03em;
	}

	.hero-subtitle {
		font-size: 1.2rem;
		color: #475569;
		max-width: 750px;
		margin: 0 auto 2.5rem;
	}

	.hero-ctas {
		margin-bottom: 4rem;
	}

	.btn-main-cta {
		display: inline-block;
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: #ffffff;
		padding: 1rem 2.25rem;
		border-radius: 0.5rem;
		font-weight: 700;
		font-size: 1.125rem;
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.btn-main-cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
	}

	.cta-sub {
		display: block;
		font-size: 0.875rem;
		color: #64748b;
		margin-top: 0.75rem;
	}

	/* Reassurance Cards */
	.reassurance-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 1100px;
		margin: 0 auto;
		text-align: left;
	}

	.reassure-card {
		background: #f8fafc;
		padding: 2rem;
		border-radius: 0.75rem;
		border: 1px solid #e2e8f0;
	}

	.reassure-card .icon {
		font-size: 2.25rem;
		display: block;
		margin-bottom: 1rem;
	}

	.reassure-card h3 {
		font-size: 1.15rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.reassure-card p {
		font-size: 0.925rem;
		color: #475569;
		margin: 0;
	}

	/* How it works */
	.how-it-works {
		padding: 5rem 5%;
		text-align: center;
		background: #f1f5f9;
	}

	.how-it-works h2 {
		font-size: 2rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 3rem;
	}

	.steps-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2.5rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.step-card {
		background: #ffffff;
		padding: 2.5rem 2rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
		position: relative;
	}

	.step-num {
		position: absolute;
		top: -1.25rem;
		left: 50%;
		transform: translateX(-50%);
		width: 2.5rem;
		height: 2.5rem;
		background: #2563eb;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
	}

	.step-card h3 {
		font-size: 1.25rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0.5rem 0 1rem;
	}

	.step-card p {
		font-size: 0.925rem;
		color: #475569;
		margin: 0;
	}

	/* Formulas */
	.formulas-section {
		padding: 6rem 5%;
		text-align: center;
		background: #ffffff;
	}

	.formulas-section h2 {
		font-size: 2.25rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.section-desc {
		color: #64748b;
		font-size: 1.1rem;
		margin-bottom: 4rem;
	}

	.formulas-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2.5rem;
		max-width: 1100px;
		margin: 0 auto;
		text-align: left;
	}

	.formula-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 1rem;
		padding: 2.5rem 2rem;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.formula-card.highlighted {
		border-color: #3b82f6;
		box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
		background: linear-gradient(to bottom, #ffffff, #f8fafc);
	}

	.card-badge {
		position: absolute;
		top: -0.75rem;
		right: 2rem;
		background: #3b82f6;
		color: #ffffff;
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		letter-spacing: 0.05em;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1rem;
	}

	.card-header h3 {
		font-size: 1.35rem;
		font-weight: 800;
		color: #0f172a;
	}

	.price {
		font-size: 1.75rem;
		font-weight: 900;
		color: #1e3a8a;
	}

	.formula-desc {
		font-size: 0.95rem;
		color: #475569;
		margin-bottom: 2rem;
		min-height: 3.5rem;
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2.5rem;
		flex-grow: 1;
	}

	.features-list li {
		font-size: 0.9rem;
		color: #334155;
		margin-bottom: 0.75rem;
	}

	.btn-select {
		display: block;
		text-align: center;
		background: #ffffff;
		color: #1e3a8a;
		border: 1px solid #cbd5e1;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.btn-select:hover {
		background: #1e3a8a;
		color: #ffffff;
		border-color: #1e3a8a;
	}

	.formula-card.highlighted .btn-select {
		background: #3b82f6;
		color: #ffffff;
		border-color: #3b82f6;
	}

	.formula-card.highlighted .btn-select:hover {
		background: #1d4ed8;
		border-color: #1d4ed8;
	}

	/* FAQ */
	.faq-section {
		padding: 6rem 5%;
		background: #f8fafc;
	}

	.faq-section h2 {
		font-size: 2rem;
		font-weight: 800;
		color: #0f172a;
		text-align: center;
		margin-bottom: 4rem;
	}

	.faq-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.faq-item h4 {
		font-size: 1.1rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.faq-item p {
		font-size: 0.95rem;
		color: #475569;
		margin: 0;
	}

	/* Footer */
	.landing-footer {
		background: #0f172a;
		color: #94a3b8;
		padding: 3rem 5%;
		text-align: center;
		font-size: 0.875rem;
		border-top: 1px solid #1e293b;
	}

	@media (max-width: 768px) {
		.hero-section h1 {
			font-size: 2rem;
		}

		.faq-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	/* Expertise Section */
	.expertise-section {
		padding: 5rem 5%;
		background: #ffffff;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
	}

	.expertise-container {
		max-width: 1100px;
		margin: 0 auto;
		text-align: left;
	}

	.expertise-badge {
		background: #fef3c7;
		color: #d97706;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		letter-spacing: 0.05em;
		display: inline-block;
		margin-bottom: 1rem;
	}

	.expertise-content h2 {
		font-size: 2rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}

	.lead-text {
		font-size: 1.1rem;
		color: #475569;
		margin-bottom: 3rem;
	}

	.expertise-arguments {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2.5rem;
	}

	.arg-item {
		background: #f8fafc;
		padding: 2rem;
		border-radius: 0.75rem;
		border-left: 4px solid #3b82f6;
	}

	.arg-item h4 {
		font-size: 1.1rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.arg-item p {
		font-size: 0.925rem;
		color: #475569;
		margin: 0;
		line-height: 1.5;
	}

	/* App Mobile Section */
	.app-mobile-section {
		padding: 5rem 5%;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
		color: #ffffff;
		border-top: 1px solid #1e293b;
	}

	.app-mobile-container {
		max-width: 1100px;
		margin: 0 auto;
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
		border-radius: 9999px;
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
		border-radius: 0.5rem;
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

	/* Phone Mockup */
	.phone-mockup {
		width: 240px;
		height: 440px;
		background: #000000;
		border: 8px solid #334155;
		border-radius: 2.25rem;
		margin: 0 auto;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
	}

	.phone-screen {
		flex-grow: 1;
		background: #1e293b;
		border-radius: 1.5rem;
		padding: 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.phone-app-header {
		font-weight: 800;
		font-size: 1rem;
		color: #38bdf8;
		margin-bottom: 1.5rem;
	}

	.phone-app-body {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.visa-badge {
		background: #0f172a;
		border: 1px solid #334155;
		color: #ffffff;
		padding: 0.6rem;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-align: center;
	}

	.visa-languages {
		margin-top: 1rem;
		color: #38bdf8;
		font-size: 0.75rem;
		font-weight: 700;
		text-align: center;
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

		.phone-mockup {
			display: none;
		}
	}
</style>
