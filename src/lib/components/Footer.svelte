<!-- src/lib/components/Footer.svelte -->
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
				La solution officielle de photos d'identité certifiées conformes ANTS & OACI dans votre poche. Conçue par des photographes professionnels d'identité.
			</p>
			<p class="copyright">
				&copy; {new Date().getFullYear()} IDidem. Tous droits réservés.
			</p>
		</div>

		<div class="footer-links">
			<h4>Démarches Officielles (France)</h4>
			<ul>
				<li><a href="/e-photo-ants">e-Photo ANTS Officielle (Permis & Titre de séjour)</a></li>
				<li><a href="/photo-permis-de-conduire">Permis de conduire (Numéro NEPH)</a></li>
				<li><a href="/photo-titre-de-sejour">Carte & Titre de séjour (Portail ANEF)</a></li>
				<li><a href="/photo-passeport-en-ligne">Passeport biométrique (Mairie)</a></li>
				<li><a href="/photo-carte-identite-en-ligne">Carte nationale d'identité (CNI)</a></li>
				<li><a href="/photo-identite-bebe">Photo Bébé & Nourrisson sans stress</a></li>
				<li><a href="/photo?formula=officielle">Carte Vitale (Ameli), CV & Titres français</a></li>
			</ul>
		</div>

		<div class="footer-links">
			<h4>Formats Internationaux & App</h4>
			<ul>
				<li><a href="/photo-visa">Photos Visa International (USA, Inde, Chine...)</a></li>
				<li><a href="/application-photo-identite">Application Mobile (11 Langues)</a></li>
				<li><a href="https://apps.apple.com/fr/iphone/search?term=ididem" target="_blank" rel="noopener">Disponible sur iOS (App Store)</a></li>
				<li><a href="https://play.google.com/store/apps/details?id=com.fabfabfab.idemidphoto&hl=fr" target="_blank" rel="noopener">Disponible sur Android (Google Play)</a></li>
			</ul>
		</div>

		<div class="footer-links">
			<h4>Navigation & Contact</h4>
			<ul>
				<li><a href="/#features">Avantages</a></li>
				<li><a href="/#how-it-works">Comment ça marche</a></li>
				<li><a href="/#pricing">Tarifs</a></li>
				<li><a href="/#faq">FAQ</a></li>
				<li><a href="mailto:contact@gralypho.com">contact@gralypho.com</a></li>
				<li><a href="https://gist.github.com/Github1234fab/f41bd73e7b57d72e196c1b576654b37e" target="_blank" rel="noopener">Politique de Confidentialité</a></li>
			</ul>
		</div>
	</div>

	<!-- Section Mobilité Mondiale & Formats Internationaux -->
	<div class="container intl-strip">
		<div class="intl-header">
			<h4 class="intl-title">Mobilité Mondiale & Normes Internationales (Application IDidem)</h4>
			<span class="intl-badge-count">190+ Pays • 11 Langues</span>
		</div>
		<p class="intl-desc">
			Où que vous soyez dans le monde, l'application mobile IDidem casse les barrières linguistiques et géographiques. Chaque utilisateur peut générer un document conforme aux normes officielles de son pays de destination sans dépendre d'un studio local : un ressortissant chinois peut créer son visa américain DS-160 (5×5 cm), un voyageur francophone préparer un visa pour l'Inde ou la Chine, ou un citoyen arabophone éditer sa photo pour les normes canadiennes.
		</p>
		<div class="intl-badges">
			<a href="/photo-visa" class="intl-pill">Visa États-Unis (51×51 mm / DS-160)</a>
			<a href="/photo-visa" class="intl-pill">Visa Chine (33×48 mm)</a>
			<a href="/photo-visa" class="intl-pill">Visa Inde (50×50 mm)</a>
			<a href="/photo-visa" class="intl-pill">Visa Canada & AVE (50×70 mm)</a>
			<a href="/photo-visa" class="intl-pill">Maghreb & Moyen-Orient (Option fond blanc)</a>
			<a href="/photo-visa" class="intl-pill">Espace Schengen (35×45 mm)</a>
			<a href="/photo-visa" class="intl-pill">Royaume-Uni (Passport UK)</a>
			<a href="/application-photo-identite" class="intl-pill">Application traduite en 11 langues</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--gray-900);
		color: var(--white);
		padding: 5rem 0 3.5rem 0;
	}
	.footer-content {
		display: grid;
		grid-template-columns: 1.4fr 1.3fr 1.1fr 1fr;
		gap: 2.5rem;
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
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.footer-links a {
		color: var(--gray-400);
		font-size: 0.95rem;
		text-decoration: none;
		transition: var(--transition-fast);
	}
	.footer-links a:hover {
		color: var(--blue-300);
		padding-left: 4px;
	}

	/* Section Mobilité Mondiale */
	.intl-strip {
		margin-top: 3.5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--gray-800);
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.intl-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.intl-title {
		color: var(--white);
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 800;
		margin: 0;
	}

	.intl-badge-count {
		background: rgba(37, 99, 235, 0.2);
		color: var(--blue-300);
		border: 1px solid rgba(59, 130, 246, 0.3);
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.3rem 0.75rem;
		border-radius: 9999px;
		letter-spacing: 0.3px;
	}

	.intl-desc {
		color: var(--gray-400);
		font-size: 0.88rem;
		line-height: 1.65;
		max-width: 950px;
		margin: 0;
	}

	.intl-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 0.85rem;
		margin-top: 0.25rem;
	}

	.intl-pill {
		display: inline-flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #cbd5e1;
		font-size: 0.82rem;
		font-weight: 600;
		padding: 0.4rem 0.85rem;
		border-radius: 9999px;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.intl-pill:hover {
		background: rgba(37, 99, 235, 0.25);
		border-color: var(--blue-400);
		color: #ffffff;
		transform: translateY(-1px);
	}

	@media (max-width: 992px) {
		.footer-content {
			grid-template-columns: repeat(2, 1fr);
			gap: 2.5rem;
		}
	}

	@media (max-width: 640px) {
		.footer-content {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}
</style>
