<!-- src/routes/photo/success/+page.svelte -->
<script>
	import { page } from '$app/state';
	const sessionId = page.url.searchParams.get('session_id') || '';
</script>

<svelte:head>
	<title>Commande Confirmée - IDidem</title>
</svelte:head>

<main class="success-page">
	<div class="container success-container">
		<div class="success-card text-center animate-fade-in-up">
			<div class="success-icon-wrapper">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="success-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			</div>
			
			<h1>Merci pour votre commande !</h1>
			<p class="subtitle">Votre paiement a été traité avec succès.</p>

			{#if sessionId}
				<div class="session-info">
					<span>Référence de transaction :</span>
					<code>{sessionId.slice(0, 18)}...</code>
				</div>
			{/if}

			<div class="instructions-card">
				<h3>Que se passe-t-il maintenant ?</h3>
				<ol>
					<li>
						<strong>🔍 Contrôle de conformité</strong> : Notre équipe vérifie manuellement votre photo pour s'assurer qu'elle respecte scrupuleusement les exigences officielles (OACI/ANTS).
					</li>
					<li>
						<strong>📧 Envoi de votre code</strong> : Vous recevrez votre code e-Photo officiel ou votre planche numérique HD par e-mail sous 10 minutes.
					</li>
					<li>
						<strong>🛡️ Garantie</strong> : Si un rejet survenait lors de vos démarches administratives, contactez-nous pour un remboursement complet ou un nouvel essai gratuit.
					</li>
				</ol>
			</div>

			<div class="actions">
				<a href="/" class="primary-btn">Retourner à l'accueil</a>
			</div>
		</div>
	</div>
</main>

<style>
	.success-page {
		min-height: 100vh;
		background: var(--gray-50);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
	}

	.success-container {
		max-width: 600px;
		width: 100%;
	}

	.success-card {
		background: var(--white);
		padding: 3.5rem 3rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.success-icon-wrapper {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #eaf6ec;
		color: var(--green-500);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
		box-shadow: 0 4px 15px rgba(34, 197, 94, 0.15);
	}

	.success-icon {
		width: 36px;
		height: 36px;
	}

	h1 {
		font-size: 2.2rem;
		font-weight: 900;
		color: var(--gray-900);
	}

	.subtitle {
		color: var(--gray-500);
		font-size: 1.1rem;
	}

	.session-info {
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		color: var(--gray-600);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.session-info code {
		font-family: monospace;
		font-weight: 700;
		color: var(--blue-700);
	}

	.instructions-card {
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		padding: 2rem;
		border-radius: var(--radius-md);
		text-align: left;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.instructions-card h3 {
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--gray-800);
	}

	.instructions-card ol {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--gray-600);
	}

	.instructions-card li strong {
		color: var(--gray-800);
	}

	.actions {
		width: 100%;
		margin-top: 1rem;
	}

	.primary-btn {
		background: var(--blue-700);
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		display: inline-block;
		transition: var(--transition-fast);
		width: 100%;
		box-shadow: var(--shadow-sm);
	}

	.primary-btn:hover {
		background: var(--blue-900);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	@media (max-width: 576px) {
		.success-card {
			padding: 2.5rem 1.5rem;
		}

		h1 {
			font-size: 1.75rem;
		}
	}
</style>
