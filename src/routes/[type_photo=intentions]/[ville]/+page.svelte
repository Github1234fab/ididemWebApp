<script>
	const logoIdidem = '/logoIdidem_1024.png';
	import { villesSEO } from '$lib/data/villes.js';

	/** @type {{ data: { ville: import('$lib/data/villes').VilleSEO, typePhoto: string, seo: any } }} */
	let { data } = $props();
	const ville = $derived(data.ville);
	const typePhoto = $derived(data.typePhoto);
	const seo = $derived(data.seo);

	const allCities = Object.values(villesSEO);

	// Génération des données structurées JSON-LD (FAQPage + HowTo) pour Google Rich Snippets
	const jsonLd = $derived(JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Service',
				'name': `Photos d'identité et e-photo ANTS à ${ville.name}`,
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
				'url': `https://ididem.com/photo-identite-en-ligne/${ville.slug}`
			},
			{
				'@type': 'HowTo',
				'name': `Comment faire ses photos d'identité ou e-photo ANTS à ${ville.name}`,
				'description': `Guide étape par étape pour obtenir votre planche photo d'identité ou code e-photo ANTS à ${ville.name}.`,
				'step': [
					{
						'@type': 'HowToStep',
						'position': 1,
						'name': 'Pré-demande ANTS',
						'text': `Effectuez votre pré-demande de passeport, CNI ou permis sur le site officiel ANTS ou auprès de ${ville.mairie}.`
					},
					{
						'@type': 'HowToStep',
						'position': 2,
						'name': 'Prise de vue IDidem & Signature',
						'text': `Prenez votre photo depuis chez vous sur l'application IDidem et signez sur l'écran pour générer le code e-photo à 22 caractères.`
					},
					{
						'@type': 'HowToStep',
						'position': 3,
						'name': 'Saisie du code ou Dépôt dossier',
						'text': `Renseignez votre code e-photo en ligne ou présentez la planche imprimée lors de votre rendez-vous à ${ville.mairie}.`
					}
				]
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
	<title>Photo d'identité à {ville.name} (ANTS & Passeport) – Conforme en 2 min</title>
	<meta name="description" content={`Faire ses photos d'identité et e-photo ANTS à ${ville.name}. Conforme Mairie & ANTS en 2 minutes. Code photo-signature à 22 caractères reçu par e-mail.`} />
	<link rel="canonical" href="https://ididem.com/photo-identite-en-ligne/{ville.slug}" />

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

	<!-- 1. Hero Section avec H1 ciblé local -->
	<section class="hero-section">
		<div class="hero-content">
			<span class="badge-local">📍 SERVICE ACCRÉDITÉ EN LIGNE – DÉPARTEMENT {ville.depNum}</span>
			<h1>Faire ses photos d'identité et e-photo ANTS {ville.prepArticle}</h1>
			<p class="hero-subtitle">
				Obtenez des clichés certifiés conformes pour passeport, carte nationale d'identité (CNI), permis de conduire et titre de séjour sans vous déplacer {ville.prepArticle}.
			</p>
			
			<div class="hero-ctas">
				<a href="/photo" class="btn-main-cta">
					Prendre ma photo maintenant →
				</a>
				<span class="cta-sub">Temps de réalisation : 2 minutes • 100% Conforme ou Remboursé</span>
			</div>
		</div>
	</section>

	<!-- 2. Comparatif Cabine Photomaton vs IDidem -->
	<section class="comparison-section">
		<div class="comparison-container">
			<h2>Cabine vs IDidem {ville.prepArticle}</h2>
			<div class="comparison-grid">
				<div class="comparison-card offline">
					<div class="card-header-comp">
						<h3>En cabine {ville.prepArticle}</h3>
						<span class="price-comp price-offline">8,00 €</span>
					</div>
					<ul class="comp-list">
						<li>❌ Déplacements et files d'attente sur place</li>
						<li>❌ Éclairage et assise souvent mal adaptés</li>
						<li>❌ Quasi impossible pour les nourrissons, handicapés et séniors</li>
						<li>❌ Risque d'erreur de cadrage non corrigé</li>
						<li>❌ Pas de signature numérique ANTS intégrée</li>
					</ul>
				</div>
				<div class="comparison-card ididem-card">
					<div class="card-badge-comp">💡 LA SOLUTION IDÉALE</div>
					<div class="card-header-comp">
						<h3>Avec IDidem</h3>
						<span class="price-comp">Dès 4,99 €</span>
					</div>
					<ul class="comp-list">
						<li>✅ Depuis chez vous, en 2 minutes chrono</li>
						<li>✅ Essais illimités jusqu'au cliché parfait</li>
						<li>✅ Parfaitement adapté aux bébés & toute la famille</li>
						<li>✅ Validation et contrôle biométrique professionnel</li>
						<li>✅ Code e-photo ANTS officiel immédiat par e-mail</li>
						<li>✅ 100% Conforme ou Remboursé</li>
					</ul>
					<a href="/photo" class="btn-comp-cta">Faire ma photo chez moi</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Section Avantages Clés & Piliers de Valeur IDidem -->
	<section class="value-props-section">
		<div class="value-props-container">
			<span class="value-badge">⚡ LA RÉVOLUTION PHOTO D'IDENTITÉ</span>
			<h2>Pourquoi choisir IDidem plutôt qu'une cabine ?</h2>
			<p class="value-intro">Une application pensée de A à Z pour vous simplifier la vie, sans compromis sur la conformité légale.</p>

			<div class="value-cards-grid">
				<div class="val-card">
					<div class="val-icon">🏠</div>
					<h3>Zéro Déplacement & 2 Min Chrono</h3>
					<p>Faites votre photo directement depuis votre salon en 2 minutes. Fini les trajets, les recherches de cabine et les files d'attente.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">🔄</div>
					<h3>Essais Illimités & Gratuit</h3>
					<p>Impossible de la rater ! Recommencez autant de fois que vous le souhaitez gratuitement avant de valider votre cliché idéal.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">📷</div>
					<h3>Conçu & Vérifié par des Photographes Pros</h3>
					<p>Développé par des artisans photographes cumulant 20 ans d'expérience. Chaque photo est contrôlée pour être 100% conforme.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">🛡️</div>
					<h3>100% Conforme ou Remboursé</h3>
					<p>Vos photos respectent scrupuleusement les normes ANTS, OACI et Ministère de l'Intérieur. Acceptation garantie ou remboursement immédiat.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">📜</div>
					<h3>Code e-Photo ANTS Officiel</h3>
					<p>Service e-photo 100% certifié et optimisé juridiquement pour permis de conduire et titres de séjour avec signature numérique.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">📮</div>
					<h3>Option Envoi Postal à Domicile (+2 €)</h3>
					<p>Recevez vos planches photos haute définition imprimées sur papier photo directement dans votre boîte aux lettres pour seulement 2 € de plus.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">🌍</div>
					<h3>Tous les Formats Mondiaux sur Mobile</h3>
					<p>Besoins de visasa américain, canadien, chinois ou passeports étrangers ? Retrouvez l'ensemble des formats mondiaux sur nos applications App Store & Google Play.</p>
				</div>

				<div class="val-card">
					<div class="val-icon">💰</div>
					<h3>Économique & Moins Cher</h3>
					<p>Profitez de tarifs avantageux dès 4,99 € sans abonnement caché, idéal pour toute la famille (nourrissons, adultes et séniors).</p>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. Informations Pratiques Locales & Google Map Embed -->
	<section class="local-info-section">
		<div class="local-info-container">
			<h2>Informations pratiques : Mairie & Démarches {ville.prepArticle}</h2>
			<p class="section-intro">Où déposer votre dossier de passeport et carte d'identité dans la commune de {ville.name} :</p>
			
			<div class="local-details-grid">
				<div class="info-card">
					<div class="info-icon">🏛️</div>
					<h3>{ville.mairie}</h3>
					<p><strong>Adresse :</strong> {ville.adresseMairie}</p>
					<p><strong>Horaires d'ouverture :</strong> {ville.horairesMairie}</p>
					<p><strong>Préfecture référente :</strong> {ville.prefecture}</p>
					{#if ville.linkRdvMairie}
						<a href={ville.linkRdvMairie} target="_blank" rel="noopener noreferrer" class="btn-rdv-link">
							📅 Prise de rdv en mairie de {ville.name} →
						</a>
					{/if}
				</div>

				<div class="map-card">
					<h3>Localisation Mairie / Préfecture</h3>
					<div class="map-embed-wrapper">
						<iframe
							title={`Carte Mairie de ${ville.name}`}
							width="100%"
							height="260"
							style="border:0; border-radius: 12px;"
							loading="lazy"
							allowfullscreen
							src={`https://maps.google.com/maps?q=${ville.mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}>
						</iframe>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 4. Guide Démarche Express en 3 Etapes -->
	<section class="how-it-works">
		<h2>Guide démarche express passeport & CNI {ville.prepArticle}</h2>
		<div class="steps-row">
			<div class="step-card">
				<div class="step-num">1</div>
				<h3>Pré-demande en ligne</h3>
				<p>Remplissez votre dossier sur le site officiel de l'ANTS ou préparez vos pièces justificatives.</p>
			</div>
			<div class="step-card">
				<div class="step-num">2</div>
				<h3>Photo & Signature IDidem</h3>
				<p>Prenez votre cliché sur l'application IDidem et signez à l'écran pour générer votre code e-photo à 22 caractères.</p>
			</div>
			<div class="step-card">
				<div class="step-num">3</div>
				<h3>Dépôt du dossier {ville.prepArticle}</h3>
				<p>Renseignez votre code en ligne ou présentez votre planche imprimée lors de votre rdv à {ville.mairie}.</p>
			</div>
		</div>
	</section>

	<!-- Formules tarifaires -->
	<section class="formulas-section">
		<h2>Formules disponibles {ville.prepArticle}</h2>
		<div class="formulas-grid">
			<div class="formula-card">
				<div class="card-header">
					<h3>e-Photo ANTS</h3>
					<span class="price">6,99 €</span>
				</div>
				<p class="formula-desc">Permis de conduire & Titre de séjour. Inclus le code ANTS à 22 caractères et la signature numérisée.</p>
				<ul class="features-list">
					<li>✓ Code photo-signature unique ANTS</li>
					<li>✓ Signature électronique sur smartphone</li>
					<li>✓ Garantie conformité 100%</li>
				</ul>
				<a href="/photo?formula=e-photo" class="btn-select">Choisir e-Photo ANTS</a>
			</div>

			<div class="formula-card highlighted">
				<div class="card-badge">RECOMMANDÉ</div>
				<div class="card-header">
					<h3>Officielle Norme OACI</h3>
					<span class="price">4,99 €</span>
				</div>
				<p class="formula-desc">Carte d'identité nationale, Passeport, Visa. Format planche 35x45mm.</p>
				<ul class="features-list">
					<li>✓ Planche 6 photos HD certifiées</li>
					<li>✓ Fond uni (gris ou bleu) réglementaire</li>
					<li>✓ Téléchargement immédiat</li>
				</ul>
				<a href="/photo?formula=officielle" class="btn-select">Choisir Photo Officielle</a>
			</div>
		</div>
	</section>

	<!-- 5. Questions fréquents FAQ (FAQPage JSON-LD) -->
	<section class="faq-section">
		<h2>Questions fréquentes sur vos démarches {ville.prepArticle}</h2>
		<div class="faq-grid">
			<div class="faq-item">
				<h4>Les photos IDidem sont-elles acceptées à {ville.mairie} ?</h4>
				<p>Oui, absolument. Nos photos sont strictement conformes à la norme ISO/IEC 19794-5 et valides dans toutes les mairies du département {ville.dep}.</p>
			</div>
			<div class="faq-item">
				<h4>Comment fonctionne le code e-photo ANTS ?</h4>
				<p>Une fois votre photo prise et votre signature apposée sur l'écran, vous recevez un code unique à 22 caractères à saisir directement dans votre dossier sur ants.gouv.fr.</p>
			</div>
			<div class="faq-item">
				<h4>Que faire si ma photo n'est pas acceptée ?</h4>
				<p>Grâce aux repères biométriques IDidem et à nos vérifications, la conformité est garantie à 100% ou remboursée intégralement.</p>
			</div>
		</div>
	</section>

	<!-- Maillage interne inter-villes -->
	<section class="internal-linking-section">
		<div class="linking-container">
			<h3>Photos d'identité biométriques dans les autres métropoles :</h3>
			<div class="linking-chips">
				{#each allCities as c}
					{#if c.slug !== ville.slug}
						<a href="/photo-identite-en-ligne/{c.slug}" class="chip-link">
							{c.name} ({c.depNum})
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="landing-footer">
		<p>© {new Date().getFullYear()} IDidem. Tous droits réservés. Photos d'identité conformes ANTS en ligne.</p>
	</footer>
</div>

<style>
	/* Value Propositions Section */
	.value-props-section {
		padding: 4.5rem 5%;
		background: #ffffff;
		border-top: 1px solid #e2e8f0;
	}

	.value-props-container {
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.value-badge {
		display: inline-block;
		color: #2563eb;
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.value-props-container h2 {
		font-size: 1.85rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.value-intro {
		color: #64748b;
		font-size: 1.05rem;
		margin-bottom: 3rem;
	}

	.value-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.75rem;
		text-align: left;
	}

	.val-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 1.75rem;
		transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
	}

	.val-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0,0,0,0.06);
		border-color: #bfdbfe;
		background: #ffffff;
	}

	.val-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.val-card h3 {
		font-size: 1.1rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.val-card p {
		font-size: 0.9rem;
		color: #475569;
		margin: 0;
		line-height: 1.55;
	}

	/* Comparison Section */
	.comparison-section {
		padding: 4rem 5%;
		background: #f8fafc;
		border-top: 1px solid #e2e8f0;
	}

	.comparison-container {
		max-width: 1000px;
		margin: 0 auto;
		text-align: center;
	}

	.comparison-container h2 {
		font-size: 1.8rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 2.5rem;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		text-align: left;
	}

	.comparison-card {
		padding: 2rem;
		border-radius: 18px;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
		position: relative;
	}

	.comparison-card.offline {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		opacity: 0.85;
	}

	.comparison-card.offline h3 {
		color: #64748b;
	}

	.price-offline {
		color: #64748b !important;
	}

	.comparison-card.ididem-card {
		border: 2px solid #2563eb;
		background: #ffffff;
		box-shadow: 0 12px 32px rgba(37, 99, 235, 0.18);
		transform: scale(1.02);
	}

	.card-badge-comp {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: #2563eb;
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.3rem 0.85rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	.card-header-comp {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.card-header-comp h3 {
		font-size: 1.25rem;
		font-weight: 800;
	}

	.price-comp {
		font-size: 1.3rem;
		font-weight: 900;
		color: #2563eb;
	}

	.comp-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		font-size: 0.95rem;
	}

	.btn-comp-cta {
		display: block;
		text-align: center;
		background: #2563eb;
		color: #ffffff;
		font-weight: 700;
		padding: 0.85rem;
		border-radius: 10px;
		text-decoration: none;
		transition: background 0.2s;
	}

	.btn-comp-cta:hover {
		background: #1d4ed8;
	}

	/* Local Info & Maps Embed */
	.local-info-section {
		padding: 4rem 5%;
		background: #f1f5f9;
	}

	.local-info-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.local-info-container h2 {
		font-size: 1.8rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.section-intro {
		text-align: center;
		color: #64748b;
		margin-bottom: 2.5rem;
	}

	.local-details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
	}

	.info-card, .map-card {
		background: #ffffff;
		border-radius: 16px;
		padding: 2rem;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 12px rgba(0,0,0,0.03);
	}

	.info-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.info-card h3, .map-card h3 {
		font-size: 1.2rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 1rem;
	}

	.info-card p {
		font-size: 0.95rem;
		color: #334155;
		margin-bottom: 0.75rem;
	}

	.btn-rdv-link {
		display: inline-block;
		margin-top: 1rem;
		background: #eff6ff;
		color: #2563eb;
		border: 1px solid #bfdbfe;
		font-weight: 700;
		padding: 0.65rem 1.1rem;
		border-radius: 10px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.btn-rdv-link:hover {
		background: #dbeafe;
	}

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

	/* How it works */
	.how-it-works {
		background: #ffffff;
		padding: 4.5rem 5%;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
		text-align: center;
	}

	.how-it-works h2 {
		font-size: 1.85rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 3rem;
	}

	.steps-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 2rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.step-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 18px;
		padding: 2.25rem 1.75rem;
		text-align: center;
		position: relative;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.step-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 25px rgba(37, 99, 235, 0.08);
		border-color: #bfdbfe;
	}

	.step-num {
		width: 46px;
		height: 46px;
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: #ffffff;
		font-weight: 900;
		font-size: 1.35rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.25rem;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
	}

	.step-card h3 {
		font-size: 1.15rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.step-card p {
		font-size: 0.92rem;
		color: #475569;
		margin: 0;
		line-height: 1.6;
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

	/* Footer */
	.landing-footer {
		text-align: center;
		padding: 2rem 5%;
		background: #020617;
		color: #64748b;
		font-size: 0.85rem;
	}
</style>
