<!-- Footer.svelte -->
<footer class="footer">
	<div class="container footer-content">
		<div class="footer-brand">
			<div class="logo">
				<div class="logo-icon">
					<svg viewBox="0 0 100 100" class="logo-svg">
						<circle cx="50" cy="50" r="45" fill="#1e88e5"/>
						<circle cx="50" cy="50" r="35" fill="#ffffff"/>
						<circle cx="35" cy="45" r="5" fill="#1e88e5"/>
						<circle cx="65" cy="45" r="5" fill="#1e88e5"/>
						<path d="M 35 60 A 15 15 0 0 0 65 60" fill="none" stroke="#1e88e5" stroke-width="6" stroke-linecap="round"/>
					</svg>
				</div>
				<span class="logo-text">IDidem </span>
			</div>
			<p class="description">
				La solution de création de photos d'identité certifiées conformes ANTS dans votre poche. Conçue par des photographes professionnels.
			</p>
			<p class="copyright">
				&copy; {new Date().getFullYear()} IDidem. Tous droits réservés.
			</p>
		</div>
		<div class="footer-links">
			<h4>Navigation</h4>
			<ul>
				<li><a href="#features">Avantages</a></li>
				<li><a href="#how-it-works">Comment ça marche</a></li>
				<li><a href="#pricing">Tarifs</a></li>
				<li><a href="#faq">FAQ</a></li>
			</ul>
		</div>
		<div class="footer-links">
			<h4>Légal & Contact</h4>
			<ul>
				<li><a href="https://gist.github.com/Github1234fab/f41bd73e7b57d72e196c1b576654b37e" target="_blank" rel="noopener">Politique de Confidentialité</a></li>
				<li><a href="mailto:gralypho@gmail.com">gralypho@gmail.com</a></li>
			</ul>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--gray-900);
		color: var(--white);
		padding: 5rem 0 3rem 0;
	}
	.footer-content {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 4rem;
	}
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--blue-300);
	}
	.logo-icon {
		width: 38px;
		height: 38px;
	}
	.logo-svg {
		width: 100%;
		height: 100%;
	}
	.description {
		color: var(--gray-400);
		font-size: 0.95rem;
		line-height: 1.6;
		max-width: 400px;
	}
	.copyright {
		color: var(--gray-500);
		font-size: 0.85rem;
		margin-top: 1rem;
	}
	.footer-links h4 {
		color: var(--white);
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}
	.footer-links ul {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.footer-links a {
		color: var(--gray-400);
		font-size: 0.95rem;
		transition: var(--transition-fast);
	}
	.footer-links a:hover {
		color: var(--blue-300);
		padding-left: 4px;
	}

	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}
</style>
