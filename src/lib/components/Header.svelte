<!-- src/lib/components/Header.svelte -->
<script>
	import { onMount } from 'svelte';

	let isFormulasOpen = $state(false);
	let isMobileMenuOpen = $state(false);
	/** @type {HTMLElement | null} */
	let dropdownRef = $state(null);

	const formulas = [
		{ name: 'e-Photo ANTS', desc: 'Permis de conduire & Titre de séjour (Code 22 car.)', href: '/e-photo-ants' },
		{ name: 'Passeport biométrique', desc: 'Norme OACI 35×45 mm pour Mairie & Consulat', href: '/photo-passeport-en-ligne' },
		{ name: 'Carte d\'identité (CNI)', desc: 'Conforme Mairie & Préfecture', href: '/photo-carte-identite-en-ligne' },
		{ name: 'Titre de séjour / ANEF', desc: 'Démarches préfecture & étrangers en France', href: '/photo-titre-de-sejour' },
		{ name: 'Photos Visa International', desc: 'Formats USA (5×5 cm), Chine, Inde, Schengen', href: '/photo-visa' },
		{ name: 'Bébé & Nourrisson', desc: 'Prise de vue guidée à la maison sans stress', href: '/photo-identite-bebe' },
		{ name: 'Application Mobile & Web', desc: 'Disponible sur App Store, Google Play et Web', href: '/application-photo-identite' }
	];

	function closeMenus() {
		isFormulasOpen = false;
		isMobileMenuOpen = false;
	}

	/**
	 * @param {MouseEvent} e
	 */
	function toggleFormulas(e) {
		e.stopPropagation();
		isFormulasOpen = !isFormulasOpen;
	}

	onMount(() => {
		/**
		 * @param {MouseEvent} event
		 */
		function handleDocumentClick(event) {
			if (isFormulasOpen && dropdownRef && !dropdownRef.contains(/** @type {Node} */ (event.target))) {
				isFormulasOpen = false;
			}
		}

		/**
		 * @param {KeyboardEvent} event
		 */
		function handleKeyDown(event) {
			if (event.key === 'Escape') {
				closeMenus();
			}
		}

		window.addEventListener('click', handleDocumentClick);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('click', handleDocumentClick);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<nav class="header">
	<div class="header-container">
		<a href="/" class="logo" onclick={closeMenus}>
			<div class="logo-icon">
				<img src="/logoIdidem_1024.png" alt="logo Ididem" />
			</div>
			<span class="logo-text">IDidem</span>
		</a>

		<!-- Navigation Desktop -->
		<div class="nav-links">
			<!-- Menu déroulant Formules (Verrouillé au clic, sans fermeture intempestive au survol) -->
			<div 
				class="dropdown-wrapper"
				bind:this={dropdownRef}
			>
				<button 
					type="button" 
					class="nav-dropdown-btn" 
					class:active={isFormulasOpen}
					onclick={toggleFormulas}
					aria-expanded={isFormulasOpen}
				>
					<span>Formules</span>
					<svg class="chevron" class:rotated={isFormulasOpen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
					</svg>
				</button>

				{#if isFormulasOpen}
					<div class="dropdown-menu">
						<div class="dropdown-header">
							<span>Sélectionnez votre document :</span>
						</div>
						<div class="dropdown-items">
							{#each formulas as f}
								<a href={f.href} class="dropdown-item" onclick={closeMenus}>
									<strong class="item-name">{f.name}</strong>
									<span class="item-desc">{f.desc}</span>
								</a>
							{/each}
						</div>
						<div class="dropdown-footer">
							<a href="/photo" class="dropdown-action-btn" onclick={closeMenus}>
								Accéder directement à la prise de vue en ligne →
							</a>
						</div>
					</div>
				{/if}
			</div>

			<a href="/#pricing" onclick={closeMenus}>Tarifs</a>
			<a href="/#how-it-works" onclick={closeMenus}>Comment ça marche</a>
			<a href="/#faq" onclick={closeMenus}>FAQ</a>

			<!-- CTA Prendre une photo direct -->
			<a href="/photo" class="header-photo-cta" onclick={closeMenus}>
				Prendre une photo
			</a>

			<div class="header-store-buttons">
				<a href="https://apps.apple.com/fr/iphone/search?term=ididem" target="_blank" rel="noopener noreferrer" class="header-store-btn" title="Télécharger dans l'App Store">
					App Store
				</a>
				<a href="https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr" target="_blank" rel="noopener noreferrer" class="header-store-btn" title="Télécharger dans Google Play">
					Google Play
				</a>
			</div>
		</div>

		<!-- Bouton Hamburger Mobile -->
		<button 
			type="button" 
			class="mobile-burger-btn" 
			onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
			aria-label="Menu principal"
		>
			{#if isMobileMenuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="burger-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="burger-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Menu Déroulant Mobile -->
	{#if isMobileMenuOpen}
		<div class="mobile-drawer animate-fade-in">
			<a href="/photo" class="mobile-photo-cta" onclick={closeMenus}>
				Prendre une photo en ligne
			</a>

			<div class="mobile-section">
				<div class="mobile-section-title">Nos Formules & Démarches</div>
				<div class="mobile-formulas-list">
					{#each formulas as f}
						<a href={f.href} class="mobile-formula-link" onclick={closeMenus}>
							<strong class="m-name">{f.name}</strong>
							<span class="m-desc">{f.desc}</span>
						</a>
					{/each}
				</div>
			</div>

			<div class="mobile-nav-links">
				<a href="/#pricing" onclick={closeMenus}>Tarifs</a>
				<a href="/#how-it-works" onclick={closeMenus}>Comment ça marche</a>
				<a href="/#faq" onclick={closeMenus}>FAQ</a>
			</div>

			<div class="mobile-stores">
				<a href="https://apps.apple.com/fr/iphone/search?term=ididem" target="_blank" rel="noopener noreferrer" class="header-store-btn" onclick={closeMenus}>
					App Store
				</a>
				<a href="https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr" target="_blank" rel="noopener noreferrer" class="header-store-btn" onclick={closeMenus}>
					Google Play
				</a>
			</div>
		</div>
	{/if}
</nav>

<style>
	.header {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--gray-200);
		z-index: 100;
		transition: var(--transition-normal);
	}
	.header-container {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0.85rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--blue-700);
		text-decoration: none;
	}
	.logo-icon {
		width: 44px;
		height: 44px;
	}
	.logo-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.nav-links a {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-600);
		text-decoration: none;
		transition: var(--transition-fast);
	}
	.nav-links a:hover {
		color: var(--blue-600);
	}

	/* Menu déroulant Formules Desktop */
	.dropdown-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.nav-dropdown-btn {
		background: none;
		border: none;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-600);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.5rem 0;
		font-family: inherit;
		transition: var(--transition-fast);
	}

	.nav-dropdown-btn:hover,
	.nav-dropdown-btn.active {
		color: var(--blue-600);
	}

	.chevron {
		width: 16px;
		height: 16px;
		transition: transform 0.2s ease;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		min-width: 330px;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
		padding: 0.75rem 0;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		animation: dropFade 0.18s ease-out;
	}

	/* Pont invisible pour éviter toute perte de curseur */
	.dropdown-menu::before {
		content: '';
		position: absolute;
		top: -12px;
		left: 0;
		right: 0;
		height: 12px;
	}

	@keyframes dropFade {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.dropdown-header {
		padding: 0.4rem 1.25rem 0.6rem;
		font-size: 0.72rem;
		font-weight: 800;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid #f1f5f9;
	}

	.dropdown-items {
		display: flex;
		flex-direction: column;
		padding: 0.35rem 0;
	}

	.dropdown-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.65rem 1.25rem !important;
		text-decoration: none;
		transition: background 0.15s ease;
	}

	.dropdown-item:hover {
		background: #f8fafc;
	}

	.dropdown-item .item-name {
		font-size: 0.9rem;
		font-weight: 700;
		color: #0f172a;
		transition: color 0.15s ease;
	}

	.dropdown-item:hover .item-name {
		color: var(--blue-600);
	}

	.dropdown-item .item-desc {
		font-size: 0.75rem;
		color: #64748b;
		font-weight: 500;
		line-height: 1.35;
	}

	.dropdown-footer {
		border-top: 1px solid #f1f5f9;
		margin-top: 0.35rem;
		padding: 0.65rem 1.25rem 0.25rem;
	}

	.dropdown-action-btn {
		font-size: 0.8rem !important;
		font-weight: 700 !important;
		color: #ea580c !important;
		text-decoration: none;
	}

	.dropdown-action-btn:hover {
		text-decoration: underline !important;
	}

	/* Bouton action direct */
	.header-photo-cta {
		background: #ff7a00;
		color: #ffffff !important;
		font-weight: 700 !important;
		font-size: 0.85rem !important;
		padding: 0.55rem 1.15rem;
		border-radius: 8px;
		text-decoration: none;
		transition: transform 0.15s ease, background 0.15s ease;
		box-shadow: 0 2px 8px rgba(255, 122, 0, 0.25);
		white-space: nowrap;
	}

	.header-photo-cta:hover {
		background: #ea580c;
		transform: translateY(-1px);
	}

	.header-store-buttons {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.header-store-btn {
		background: #0f172a;
		border: 1px solid #334155;
		color: #ffffff !important;
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.78rem;
		text-decoration: none;
		transition: var(--transition-fast);
		display: flex;
		align-items: center;
		white-space: nowrap;
	}

	.header-store-btn:hover {
		background: #1e293b;
		border-color: #475569;
		transform: translateY(-1px);
	}

	/* Bouton Hamburger Mobile */
	.mobile-burger-btn {
		display: none;
		background: none;
		border: none;
		color: #1e293b;
		cursor: pointer;
		padding: 0.4rem;
	}

	.burger-icon {
		width: 28px;
		height: 28px;
	}

	/* Tiroir Mobile */
	.mobile-drawer {
		display: none;
		background: #ffffff;
		border-top: 1px solid #e2e8f0;
		padding: 1.5rem;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
	}

	.mobile-photo-cta {
		background: #ff7a00;
		color: #ffffff !important;
		font-weight: 800;
		font-size: 1rem;
		padding: 0.85rem;
		border-radius: 10px;
		text-align: center;
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(255, 122, 0, 0.3);
	}

	.mobile-section-title {
		font-size: 0.75rem;
		font-weight: 800;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.75rem;
	}

	.mobile-formulas-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.mobile-formula-link {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-decoration: none;
		padding: 0.4rem 0;
		border-bottom: 1px solid #f8fafc;
	}

	.mobile-formula-link .m-name {
		font-size: 0.95rem;
		font-weight: 700;
		color: #0f172a;
	}

	.mobile-formula-link .m-desc {
		font-size: 0.78rem;
		color: #64748b;
	}

	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding-top: 0.5rem;
		border-top: 1px solid #f1f5f9;
	}

	.mobile-nav-links a {
		font-size: 0.95rem;
		font-weight: 700;
		color: #334155;
		text-decoration: none;
	}

	.mobile-stores {
		display: flex;
		gap: 0.75rem;
		padding-top: 0.5rem;
	}

	.mobile-stores .header-store-btn {
		flex: 1;
		justify-content: center;
		padding: 0.6rem;
		font-size: 0.85rem;
	}

	/* Responsive */
	@media (max-width: 960px) {
		.nav-links {
			display: none;
		}
		.mobile-burger-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.mobile-drawer {
			display: flex;
		}
	}
</style>
