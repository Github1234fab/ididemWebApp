<!-- src/routes/photo/cancel/+page.svelte -->
<svelte:head>
	<title>Paiement Annulé - IDidem</title>
</svelte:head>

<main class="cancel-page">
	<div class="container cancel-container">
		<div class="cancel-card text-center animate-fade-in-up">
			<div class="cancel-icon-wrapper">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="cancel-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>
			
			<h1>Paiement annulé</h1>
			<p class="subtitle">La transaction a été interrompue. Aucun montant ne vous a été débité.</p>

			<div class="info-card">
				<p>💡 Pas d'inquiétude, votre cliché détouré est toujours disponible. Vous pouvez retourner au studio pour valider une autre photo ou finaliser celle-ci.</p>
			</div>

			<div class="actions">
				<a href="/photo" class="primary-btn">Retourner au studio photo</a>
				<a href="/" class="secondary-btn">Retourner à l'accueil</a>
			</div>
		</div>
	</div>
</main>

<style>
	.cancel-page {
		min-height: 100vh;
		background: var(--gray-50);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
	}

	.cancel-container {
		max-width: 500px;
		width: 100%;
	}

	.cancel-card {
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

	.cancel-icon-wrapper {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #fee2e2;
		color: var(--danger);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
		box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15);
	}

	.cancel-icon {
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

	.info-card {
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		padding: 1.25rem;
		border-radius: var(--radius-md);
		text-align: left;
		width: 100%;
		color: var(--gray-600);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.primary-btn {
		background: var(--blue-700);
		color: var(--white);
		padding: 0.9rem;
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

	.secondary-btn {
		background: var(--gray-100);
		color: var(--gray-700);
		padding: 0.9rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		display: inline-block;
		transition: var(--transition-fast);
		width: 100%;
	}

	.secondary-btn:hover {
		background: var(--gray-200);
	}

	@media (max-width: 576px) {
		.cancel-card {
			padding: 2.5rem 1.5rem;
		}

		h1 {
			font-size: 1.75rem;
		}
	}
</style>
