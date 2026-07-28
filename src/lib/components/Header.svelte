
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
			<a href="https://apps.apple.com/fr/app/ididem" class="cta-button">Télécharger l'App</a>
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
	.cta-button {
		background: var(--gradient-cta);
		color: var(--white) !important;
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-full);
		font-weight: 600;
		box-shadow: 0 4px 10px rgba(25, 118, 210, 0.2);
		transition: var(--transition-fast);
	}
	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none; /* simple hidden navigation for simplicity or add burger later */
		}
	}
</style>
