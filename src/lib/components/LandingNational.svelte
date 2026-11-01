<script>
	import { villesSEO } from '$lib/data/villes.js';
	const cities = Object.values(villesSEO);

	/**
	 * @typedef {Object} Step
	 * @property {string} num
	 * @property {string} title
	 * @property {string} desc
	 */

	/**
	 * @typedef {Object} Faq
	 * @property {string} q
	 * @property {string} a
	 */

	/**
	 * @typedef {Object} Props
	 * @property {string} title
	 * @property {string} description
	 * @property {string} canonical
	 * @property {string} badge
	 * @property {string} h1
	 * @property {string} heroSubtitle
	 * @property {'e-photo' | 'officielle'} focusFormula
	 * @property {string} ctaText
	 * @property {string} sampleImage
	 * @property {string} sampleCaption
	 * @property {string} specTitle
	 * @property {string} specText
	 * @property {string[]} specPoints
	 * @property {string} stepsTitle
	 * @property {Step[]} steps
	 * @property {Faq[]} faqs
	 */

	/** @type {Props} */
	let {
		title,
		description,
		canonical,
		badge,
		h1,
		heroSubtitle,
		focusFormula = 'e-photo',
		ctaText = 'Prendre ma photo sur smartphone →',
		sampleImage = '/photo_femme.png',
		sampleCaption = 'Norme Officielle ANTS & OACI 35×45mm',
		specTitle,
		specText,
		specPoints = [],
		stepsTitle,
		steps = [],
		faqs = []
	} = $props();

	// Données structurées Schema.org JSON-LD (Service + HowTo + FAQPage)
	const jsonLd = $derived(JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Service',
				'name': title,
				'provider': {
					'@type': 'Organization',
					'name': 'IDidem',
					'url': 'https://ididem.com',
					'logo': 'https://ididem.com/logoIdidem_1024.png'
				},
				'description': description,
				'url': canonical,
				'areaServed': 'FR',
				'serviceType': 'Photos d\'identité officielles et e-Photo ANTS en ligne'
			},
			{
				'@type': 'HowTo',
				'name': stepsTitle || h1,
				'description': `Guide pas à pas pour réaliser vos photos d'identité et e-photo ANTS en ligne sur smartphone.`,
				'step': steps.map((s, idx) => ({
					'@type': 'HowToStep',
					'position': idx + 1,
					'name': s.title,
					'text': s.desc
				}))
			},
			{
				'@type': 'FAQPage',
				'mainEntity': faqs.map(faq => ({
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

	const ctaUrl = $derived(`/photo?formula=${focusFormula}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />

	<!-- Structured Data JSON-LD pour Google Search Snippets -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="national-landing">
	<!-- 1. Hero Section -->
	<section class="hero-section">
		<div class="container hero-grid">
			<div class="hero-text animate-fade-in-up">
				<span class="badge-official">{badge}</span>
				<h1>{h1}</h1>
				<p class="hero-subtitle">{heroSubtitle}</p>

				<div class="hero-ctas">
					<a href={ctaUrl} class="btn-primary-cta">
						{ctaText}
					</a>
					<span class="cta-guarantee">
						⚡ Prise de vue en 2 minutes • 100% Conforme ou Remboursé • Sans déplacement
					</span>
				</div>

				<div class="trust-badges">
					<div class="trust-pill"><span>🇫🇷</span> Photographes agréés</div>
					<div class="trust-pill"><span>🔒</span> Données protégées</div>
					<div class="trust-pill"><span>✅</span> Garanti Mairie & ANTS</div>
				</div>
			</div>

			<div class="hero-visual">
				<div class="visual-card">
					<div class="photo-preview">
						<img src={sampleImage} alt={sampleCaption} class="preview-img" />
						<div class="biometric-guides">
							<div class="guide-oval"></div>
							<div class="guide-line eye-line"></div>
							<div class="guide-line chin-line"></div>
						</div>
						<div class="stamp-verified">
							<span>✓ CONFORME</span>
						</div>
					</div>
					<div class="photo-info">
						<span class="caption">{sampleCaption}</span>
						<span class="code-pill">Agrément ANTS • Code 22 car.</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 2. Comparatif Cabine vs IDidem -->
	<section class="comparison-section">
		<div class="container">
			<h2 class="section-title text-center">Cabine classique vs IDidem sur smartphone</h2>
			<p class="section-sub text-center">Pourquoi faire votre photo sur le web plutôt qu'en cabine ou en borne :</p>

			<div class="comparison-grid">
				<div class="comp-card offline">
					<div class="comp-header">
						<h3>En cabine / photomaton</h3>
						<span class="price-strike">8,00 € à 10,00 €</span>
					</div>
					<ul class="comp-list">
						<li>❌ Déplacements, recherche de borne et attente</li>
						<li>❌ Seulement 3 essais stressants sous un néon violent</li>
						<li>❌ Impossible pour les bébés et difficile pour personnes âgées</li>
						<li>❌ Risque fréquent de rejet de photo en mairie</li>
						<li>❌ Code ANTS à recopier manuellement depuis un ticket papier</li>
					</ul>
				</div>

				<div class="comp-card online-winner">
					<div class="winner-badge">⭐ LA SOLUTION MODERNE</div>
					<div class="comp-header">
						<h3>Sur smartphone avec IDidem</h3>
						<span class="price-highlight">Dès {focusFormula === 'e-photo' ? '6,99 €' : '4,99 €'}</span>
					</div>
					<ul class="comp-list">
						<li>✅ 100% en ligne depuis chez vous, à tout moment</li>
						<li>✅ Essais illimités gratuits jusqu'à satisfaction</li>
						<li>✅ Idéal pour les nourrissons, enfants et toute la famille</li>
						<li>✅ Détourage IA automatique et fond réglementaire parfait</li>
						<li>✅ Signature numérique sur écran & code reçu immédiatement</li>
						<li>✅ 100% Conforme ou Remboursé sous 24h</li>
					</ul>
					<a href={ctaUrl} class="btn-comp-cta">Lancer la prise de vue →</a>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. Normes officielles et spécificités de la démarche -->
	{#if specTitle && specText}
		<section class="specs-section">
			<div class="container">
				<div class="specs-card">
					<div class="specs-icon">⚖️</div>
					<h2>{specTitle}</h2>
					<p class="specs-lead">{specText}</p>
					{#if specPoints.length > 0}
						<ul class="specs-bullets">
							{#each specPoints as point}
								<li>{point}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<!-- 4. Guide en 3 étapes -->
	{#if steps.length > 0}
		<section class="steps-section">
			<div class="container">
				<h2 class="section-title text-center">{stepsTitle || 'Comment faire votre photo en 3 étapes'}</h2>
				<p class="section-sub text-center">Un processus guidé simple et rapide, directement sur le web depuis votre smartphone :</p>

				<div class="steps-grid">
					{#each steps as step}
						<div class="step-card">
							<div class="step-num">{step.num}</div>
							<h3>{step.title}</h3>
							<p>{step.desc}</p>
						</div>
					{/each}
				</div>

				<div class="text-center" style="margin-top: 3rem;">
					<a href={ctaUrl} class="btn-primary-cta">Commencer maintenant →</a>
				</div>
			</div>
		</section>
	{/if}

	<!-- 5. Formules et Tarifs -->
	<section class="pricing-section">
		<div class="container">
			<h2 class="section-title text-center">Nos formules officielles</h2>
			<p class="section-sub text-center">Sans abonnement, sans surprise, validation et garantie conformité incluses.</p>

			<div class="pricing-grid">
				<div class="price-box {focusFormula === 'e-photo' ? 'highlighted' : ''}">
					{#if focusFormula === 'e-photo'}
						<div class="box-badge">FORMULE DÉDIÉE</div>
					{/if}
					<h3>e-Photo ANTS</h3>
					<div class="price-tag">6,99 €</div>
					<p class="price-sub">Permis de conduire & Titre de séjour</p>
					<ul>
						<li>✓ Code officiel ANTS à 22 caractères</li>
						<li>✓ Signature électronique sur smartphone</li>
						<li>✓ Planche numérique conforme ANTS</li>
						<li>✓ Option envoi postal chez vous (+2 €)</li>
						<li>✓ Contrôle et garantie acceptation 100%</li>
					</ul>
					<a href="/photo?formula=e-photo" class="btn-price-cta">Choisir e-Photo ANTS</a>
				</div>

				<div class="price-box {focusFormula === 'officielle' ? 'highlighted' : ''}">
					{#if focusFormula === 'officielle'}
						<div class="box-badge">FORMULE DÉDIÉE</div>
					{/if}
					<h3>Photo Officielle OACI</h3>
					<div class="price-tag">4,99 €</div>
					<p class="price-sub">Passeport, CNI, Visa, Carte Vitale</p>
					<ul>
						<li>✓ Planche de 6 photos HD certifiées (35×45mm)</li>
						<li>✓ Fond uni réglementaire automatique</li>
						<li>✓ Fichier numérique haute résolution immédiat</li>
						<li>✓ Option tirage papier livré à domicile (+2 €)</li>
						<li>✓ Conforme mairie, préfecture et consulats</li>
					</ul>
					<a href="/photo?formula=officielle" class="btn-price-cta">Choisir Photo Officielle</a>
				</div>
			</div>
		</div>
	</section>

	<!-- 6. FAQ (Structured Data FAQPage) -->
	{#if faqs.length > 0}
		<section class="faq-section">
			<div class="container">
				<h2 class="section-title text-center">Questions fréquentes</h2>
				<p class="section-sub text-center">Tout ce que vous devez savoir pour votre démarche en ligne :</p>

				<div class="faq-grid">
					{#each faqs as faq}
						<div class="faq-card">
							<h4>{faq.q}</h4>
							<p>{faq.a}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Section Application Mobile (iOS & Android) -->
	<section class="app-mobile-section">
		<div class="container">
			<div class="app-mobile-card">
				<div class="app-mobile-text">
					<span class="app-badge">📱 APPLICATION MOBILE IOS & ANDROID • 11 LANGUES</span>
					<h2>Vos photos d'identité et e-Photo ANTS aussi sur notre application mobile</h2>
					<p>
						Vous préférez réaliser votre photo depuis une application dédiée sur votre smartphone ? Retrouvez toute la puissance d'<strong>IDidem</strong> sur l'App Store et Google Play. 
						Générez votre <strong>e-photo officielle ANTS avec signature numérique</strong> pour permis de conduire et titre de séjour, et vos photos certifiées conformes pour <strong>passeport, carte d'identité (CNI) et bébés</strong> en 2 minutes chrono.
					</p>
					<p class="app-details">
						<strong>Le + exclusif de l'application mobile :</strong> elle prend en charge <strong>tous les formats officiels internationaux</strong> (visas USA, Canada, Chine, Inde, passeports étrangers) et est disponible en <strong>11 langues</strong>.
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

	<!-- 7. Maillage Interne : Autres démarches officielles & Métropoles -->
	<section class="other-services-section">
		<div class="container">
			<h3>Toutes nos démarches officielles en ligne sur smartphone</h3>
			<div class="services-pills" style="margin-bottom: 2.5rem;">
				<a href="/e-photo-ants" class="pill-link">📜 e-Photo ANTS Officielle</a>
				<a href="/photo-permis-de-conduire" class="pill-link">🚗 Photo Permis de Conduire</a>
				<a href="/photo-titre-de-sejour" class="pill-link">🌍 Photo Titre de Séjour ANEF</a>
				<a href="/photo-passeport-en-ligne" class="pill-link">🛂 Photo Passeport Biométrique</a>
				<a href="/photo-carte-identite-en-ligne" class="pill-link">🪪 Photo Carte d'Identité (CNI)</a>
				<a href="/photo-identite-bebe" class="pill-link">👶 Photo Bébé & Nourrisson</a>
			</div>

			<h3 style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 1rem;">Photos d'identité conformes dans les principales métropoles :</h3>
			<div class="services-pills">
				{#each cities as c}
					<a href="/photo-identite-en-ligne/{c.slug}" class="city-pill-link">
						Photo d'identité à {c.name} ({c.depNum})
					</a>
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.national-landing {
		font-family: var(--font-body, system-ui, -apple-system, sans-serif);
		color: #1e293b;
		background: #ffffff;
		overflow-x: hidden;
	}

	.container {
		max-width: 1140px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* Hero */
	.hero-section {
		padding: 4rem 0 5rem 0;
		background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
		border-bottom: 1px solid #e2e8f0;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 3.5rem;
		align-items: center;
	}

	.badge-official {
		display: inline-block;
		background: #dbeafe;
		color: #1e40af;
		padding: 0.4rem 1rem;
		border-radius: 9999px;
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: 0.5px;
		margin-bottom: 1.25rem;
		border: 1px solid #bfdbfe;
	}

	.hero-text h1 {
		font-family: var(--font-heading, sans-serif);
		font-size: 2.6rem;
		font-weight: 900;
		line-height: 1.15;
		color: #0f172a;
		margin-bottom: 1.25rem;
	}

	.hero-subtitle {
		font-size: 1.15rem;
		line-height: 1.6;
		color: #475569;
		margin-bottom: 2rem;
	}

	.hero-ctas {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.btn-primary-cta {
		display: inline-block;
		background: #ea580c;
		color: #ffffff;
		padding: 1.15rem 2.5rem;
		font-size: 1.2rem;
		font-weight: 800;
		border-radius: 12px;
		text-decoration: none;
		box-shadow: 0 10px 25px rgba(234, 88, 12, 0.35);
		transition: all 0.2s ease;
	}

	.btn-primary-cta:hover {
		background: #c2410c;
		transform: translateY(-2px);
		box-shadow: 0 14px 28px rgba(234, 88, 12, 0.45);
	}

	.cta-guarantee {
		font-size: 0.85rem;
		color: #64748b;
		font-weight: 600;
	}

	.trust-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.trust-pill {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: #ffffff;
		padding: 0.4rem 0.85rem;
		border-radius: 9999px;
		font-size: 0.85rem;
		font-weight: 700;
		color: #334155;
		border: 1px solid #cbd5e1;
		box-shadow: 0 2px 4px rgba(0,0,0,0.03);
	}

	/* Hero Visual Card */
	.visual-card {
		background: #ffffff;
		border-radius: 20px;
		padding: 1.5rem;
		box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
		border: 1px solid #e2e8f0;
		max-width: 360px;
		margin: 0 auto;
	}

	.photo-preview {
		position: relative;
		border-radius: 14px;
		overflow: hidden;
		background: #f1f5f9;
		aspect-ratio: 35 / 45;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.preview-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.biometric-guides {
		position: absolute;
		inset: 0;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.guide-oval {
		width: 60%;
		height: 72%;
		border: 2px dashed rgba(34, 197, 94, 0.8);
		border-radius: 50%;
	}

	.stamp-verified {
		position: absolute;
		top: 12px;
		right: 12px;
		background: #16a34a;
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.65rem;
		border-radius: 6px;
		box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);
	}

	.photo-info {
		margin-top: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		align-items: center;
		text-align: center;
	}

	.photo-info .caption {
		font-size: 0.95rem;
		font-weight: 700;
		color: #0f172a;
	}

	.photo-info .code-pill {
		font-size: 0.8rem;
		font-weight: 600;
		color: #2563eb;
		background: #eff6ff;
		padding: 0.25rem 0.7rem;
		border-radius: 9999px;
	}

	/* Section Headers */
	.section-title {
		font-family: var(--font-heading, sans-serif);
		font-size: 2.1rem;
		font-weight: 900;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.section-sub {
		font-size: 1.1rem;
		color: #64748b;
		max-width: 650px;
		margin: 0 auto 3rem auto;
	}

	.text-center {
		text-align: center;
	}

	/* Comparison */
	.comparison-section {
		padding: 5rem 0;
		background: #ffffff;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.comp-card {
		border-radius: 18px;
		padding: 2.5rem 2rem;
		border: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
	}

	.comp-card.offline {
		background: #f8fafc;
	}

	.comp-card.online-winner {
		position: relative;
		background: #ffffff;
		border: 2px solid #2563eb;
		box-shadow: 0 15px 35px rgba(37, 99, 235, 0.12);
	}

	.winner-badge {
		position: absolute;
		top: -14px;
		left: 50%;
		transform: translateX(-50%);
		background: #2563eb;
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 1rem;
		border-radius: 9999px;
		letter-spacing: 0.5px;
	}

	.comp-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1.75rem;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 1.25rem;
	}

	.comp-header h3 {
		font-size: 1.25rem;
		font-weight: 800;
		color: #0f172a;
	}

	.price-strike {
		color: #94a3b8;
		font-weight: 700;
		text-decoration: line-through;
	}

	.price-highlight {
		font-size: 1.4rem;
		font-weight: 900;
		color: #2563eb;
	}

	.comp-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.btn-comp-cta {
		margin-top: auto;
		display: block;
		text-align: center;
		background: #2563eb;
		color: #ffffff;
		padding: 0.9rem;
		border-radius: 10px;
		font-weight: 800;
		text-decoration: none;
		transition: background 0.2s;
	}

	.btn-comp-cta:hover {
		background: #1d4ed8;
	}

	/* Specs Section */
	.specs-section {
		padding: 3.5rem 0;
		background: #f1f5f9;
	}

	.specs-card {
		background: #ffffff;
		border-radius: 18px;
		padding: 3rem;
		border: 1px solid #cbd5e1;
		box-shadow: 0 4px 15px rgba(0,0,0,0.03);
	}

	.specs-icon {
		font-size: 2.2rem;
		margin-bottom: 1rem;
	}

	.specs-card h2 {
		font-size: 1.8rem;
		font-weight: 900;
		color: #0f172a;
		margin-bottom: 1rem;
	}

	.specs-lead {
		font-size: 1.1rem;
		line-height: 1.7;
		color: #334155;
		margin-bottom: 1.5rem;
	}

	.specs-bullets {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 0.85rem;
	}

	.specs-bullets li {
		background: #f8fafc;
		padding: 0.85rem 1.15rem;
		border-radius: 8px;
		border-left: 4px solid #ea580c;
		font-size: 0.95rem;
		font-weight: 600;
		color: #1e293b;
	}

	/* Steps */
	.steps-section {
		padding: 5rem 0;
		background: #ffffff;
	}

	.steps-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.step-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 2.25rem 1.75rem;
		position: relative;
	}

	.step-num {
		width: 44px;
		height: 44px;
		background: #ea580c;
		color: #ffffff;
		font-size: 1.2rem;
		font-weight: 900;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.25rem;
	}

	.step-card h3 {
		font-size: 1.25rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.step-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #64748b;
	}

	/* Pricing */
	.pricing-section {
		padding: 5rem 0;
		background: #f8fafc;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.price-box {
		background: #ffffff;
		border-radius: 18px;
		padding: 2.5rem 2rem;
		border: 1px solid #e2e8f0;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.price-box.highlighted {
		border: 2px solid #ea580c;
		box-shadow: 0 12px 30px rgba(234, 88, 12, 0.15);
	}

	.box-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: #ea580c;
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.25rem 0.85rem;
		border-radius: 9999px;
	}

	.price-box h3 {
		font-size: 1.35rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.5rem;
	}

	.price-tag {
		font-size: 2.3rem;
		font-weight: 900;
		color: #ea580c;
		margin-bottom: 0.25rem;
	}

	.price-sub {
		font-size: 0.9rem;
		color: #64748b;
		margin-bottom: 1.75rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid #f1f5f9;
	}

	.price-box ul {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		font-size: 0.95rem;
	}

	.btn-price-cta {
		margin-top: auto;
		display: block;
		text-align: center;
		background: #ea580c;
		color: #ffffff;
		padding: 0.95rem;
		border-radius: 10px;
		font-weight: 800;
		text-decoration: none;
		transition: background 0.2s;
	}

	.btn-price-cta:hover {
		background: #c2410c;
	}

	/* FAQ */
	.faq-section {
		padding: 5rem 0;
		background: #ffffff;
	}

	.faq-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
	}

	.faq-card {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 2rem;
	}

	.faq-card h4 {
		font-size: 1.15rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 0.75rem;
	}

	.faq-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #475569;
	}

	/* Other services */
	.other-services-section {
		padding: 3.5rem 0;
		background: #0f172a;
		color: #ffffff;
		text-align: center;
	}

	.other-services-section h3 {
		font-size: 1.25rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
		color: #e2e8f0;
	}

	.services-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.pill-link {
		background: #1e293b;
		color: #93c5fd;
		padding: 0.55rem 1.1rem;
		border-radius: 9999px;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
		border: 1px solid #334155;
		transition: all 0.2s ease;
	}

	.pill-link:hover {
		background: #2563eb;
		color: #ffffff;
		border-color: #2563eb;
		transform: translateY(-2px);
	}

	.city-pill-link {
		background: rgba(255, 255, 255, 0.05);
		color: #94a3b8;
		padding: 0.45rem 0.9rem;
		border-radius: 9999px;
		font-size: 0.85rem;
		text-decoration: none;
		border: 1px solid #334155;
		transition: all 0.2s ease;
	}

	.city-pill-link:hover {
		background: #2563eb;
		color: #ffffff;
		border-color: #2563eb;
	}

	/* App Mobile Section */
	.app-mobile-section {
		padding: 5rem 0;
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
		border-radius: 9999px;
		letter-spacing: 0.05em;
		display: inline-block;
		margin-bottom: 1.25rem;
	}

	.app-mobile-text h2 {
		font-size: 2.1rem;
		font-weight: 800;
		margin: 0 0 1.25rem 0;
		line-height: 1.25;
		color: #ffffff;
	}

	.app-mobile-text p {
		color: #cbd5e1;
		font-size: 1.05rem;
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
		margin-top: 1.75rem;
		flex-wrap: wrap;
	}

	.store-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #0f172a;
		border: 1px solid #334155;
		padding: 0.6rem 1.25rem;
		border-radius: 10px;
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
		width: 260px;
		margin: 0 auto 1.25rem auto;
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
		width: 80px;
		height: auto;
		border-radius: 0.5rem;
		border: 2px solid #334155;
		opacity: 0.8;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.app-screenshots-strip img:hover {
		opacity: 1;
		transform: scale(1.08);
	}

	@media (max-width: 768px) {
		.hero-grid {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.hero-text h1 {
			font-size: 2rem;
		}

		.hero-ctas {
			align-items: stretch;
		}

		.btn-primary-cta {
			text-align: center;
		}

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
	}
</style>
