
<nav class="header">
	<div class="header-container">
		<a href="/" class="logo">
			<div class="logo-icon">
				<img src="/logoIdidem_1024.png" alt="logo Ididem" />
			</div>
			<span class="logo-text">IDidem</span>
		</a>
		<div class="nav-links">
			<a href="#features">Avantages</a>
			<a href="#how-it-works">Comment ça marche</a>
			<a href="#pricing">Tarifs</a>
			<a href="#faq">FAQ</a>
			<div class="header-store-buttons">
				<a href="https://apps.apple.com/fr/iphone/search?term=ididem" target="_blank" rel="noopener noreferrer" class="header-store-btn" title="Télécharger dans l'App Store">
					🍏 App Store
				</a>
				<a href="https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr" target="_blank" rel="noopener noreferrer" class="header-store-btn" title="Télécharger dans Google Play">
					🤖 Google Play
				</a>
			</div>
		</div>
	</div>
</nav>

<style>
	.header {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--gray-200);
		z-index: 100;
		transition: var(--transition-normal);
	}
	.header-container {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1rem 2rem;
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
	}
	.logo-icon {
		width: 48px;
		height: 48px;
	}
	.logo-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.nav-links a {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--gray-600);
		transition: var(--transition-fast);
	}
	.nav-links a:hover {
		color: var(--blue-600);
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
		padding: 0.4rem 0.8rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.8rem;
		text-decoration: none;
		transition: var(--transition-fast);
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.header-store-btn:hover {
		background: #1e293b;
		border-color: #475569;
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none; /* simple hidden navigation for simplicity or add burger later */
		}
	}
</style>
