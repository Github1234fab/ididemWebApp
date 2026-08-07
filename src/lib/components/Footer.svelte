<script>
	import { villesSEO } from '$lib/data/villes.js';

	// Récupérer la liste triée des villes pour le maillage
	const sortedCities = Object.values(villesSEO).sort((a, b) => a.name.localeCompare(b.name));
</script>

<footer class="footer">
	<div class="container footer-content">
		<div class="footer-brand">
			<div class="logo">
				<div class="logo-icon">
					<img src="/logoIdidem_1024.png" alt="Logo IDidem" class="logo-svg" />
				</div>
				<span class="logo-text">IDidem</span>
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

	<!-- Section Maillage Interne pour le SEO des villes -->
	<div class="container seo-cities-linking" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--gray-800); text-align: left;">
		<h4 style="color: var(--white); font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">
			📍 Vos photos d'identité certifiées en ligne :
		</h4>
		<div class="cities-grid" style="display: flex; flex-wrap: wrap; gap: 0.5rem 0.85rem; font-size: 0.85rem; line-height: 1.6;">
			{#each sortedCities as ville}
				<a href="/photo-identite-en-ligne/{ville.slug}" class="city-seo-link">
					Photo d'identité à {ville.name}
				</a>
			{/each}
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
	.city-seo-link {
		color: var(--gray-500);
		text-decoration: none;
		transition: var(--transition-fast);
	}
	.city-seo-link:hover {
		color: var(--blue-300) !important;
	}

	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}
</style>
