<!-- src/routes/photo/+page.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Étape active : 1 = formule, 2 = consignes, 3 = caméra, 4 = résultat
	let step = $state(1);

	// Formule choisie
	let selectedFormula = $state(''); // 'e-photo', 'officielle', 'casual'

	// Flux caméra
	/** @type {HTMLVideoElement | null} */
	let videoEl = $state(null);
	/** @type {MediaStream | null} */
	let stream = null;
	let cameraError = $state('');
	let isShutterActive = $state(false);
	let countdown = $state(0);

	// Image capturée (base64)
	let capturedImage = $state('');

	const formulas = [
		{
			id: 'e-photo',
			title: 'e-Photo Officielle',
			subtitle: 'Permis de conduire & Titre de séjour',
			desc: 'Planche de photos biométriques certifiées conforme ANTS avec code e-photo unique.',
			badge: 'ANTS & OACI',
			icon: '🚗',
			image: '/photo_homme.png',
			rules: [
				'Oreilles dégagées (les cheveux doivent être tirés en arrière)',
				'Tête nue (sans chapeau, serre-tête, bonnet ou voile masquant)',
				'Visage dégagé, yeux ouverts et fixant l\'objectif',
				'Expression neutre (pas de sourire, bouche fermée)',
				'Lunettes autorisées uniquement sans reflets et monture fine'
			],
			gabaritClass: 'official-gabarit'
		},
		{
			id: 'officielle',
			title: 'Photo d\'identité standard',
			subtitle: 'Passeport & Carte d\'identité',
			desc: 'Planche 100% conforme pour vos documents d\'identité physiques et démarches consulaires.',
			badge: 'Conforme Mairie',
			icon: '🛂',
			image: '/photo_enfant.png',
			rules: [
				'Oreilles dégagées (cheveux derrière les oreilles)',
				'Visage bien au centre, droit et de face',
				'Expression neutre, bouche fermée, pas de dents visibles',
				'Pas d\'ombre sur le visage ni en arrière-plan',
				'Tête nue (pas de bonnet, casquette, foulard ou chapeau)'
			],
			gabaritClass: 'official-gabarit'
		},
		{
			id: 'casual',
			title: 'Portrait Professionnel',
			subtitle: 'LinkedIn, CV & Profils en ligne',
			desc: 'Mettez en valeur votre image avec un portrait clair, moderne et optimisé pour le web.',
			badge: 'Réseaux & CV',
			icon: '✨',
			image: '/photo_femme.png',
			rules: [
				'Sourire chaleureux et naturel fortement recommandé !',
				'Arrière-plan neutre, professionnel ou légèrement flouté',
				'Lumière douce mettant en valeur le visage',
				'Orientation légèrement de trois-quarts ou de face selon votre préférence',
				'Tenue professionnelle ou décontractée soignée'
			],
			gabaritClass: 'casual-gabarit'
		}
	];

	const activeFormulaDetails = $derived(formulas.find(f => f.id === selectedFormula));

	// Liste des consignes lues pour l'étape 2
	let checklistChecked = $state([false, false, false, false, false]);

	/**
	 * @param {number} index
	 */
	function toggleChecklist(index) {
		checklistChecked[index] = !checklistChecked[index];
	}

	const allChecked = $derived(checklistChecked.every(Boolean));

	function checkAll() {
		checklistChecked = [true, true, true, true, true];
	}

	/**
	 * @param {string} id
	 */
	function selectFormula(id) {
		selectedFormula = id;
		checklistChecked = [false, false, false, false, false];
		step = 2;
	}

	async function startCamera() {
		cameraError = '';
		step = 3;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: 'user'
				},
				audio: false
			});
			if (videoEl) {
				videoEl.srcObject = stream;
			}
		} catch (err) {
			console.error('Erreur caméra:', err);
			cameraError = 'Impossible d\'accéder à la caméra. Veuillez vérifier les permissions dans votre navigateur.';
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
			stream = null;
		}
	}

	function startCountdown() {
		if (isShutterActive) return;
		isShutterActive = true;
		countdown = 3;
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(interval);
				capturePhoto();
			}
		}, 1000);
	}

	function capturePhoto() {
		if (!videoEl) return;
		
		const canvas = document.createElement('canvas');
		// On garde un format 4:3 portrait idéal pour l'identité
		const width = videoEl.videoWidth;
		const height = videoEl.videoHeight;
		
		// Déterminer la zone de crop carrée ou rectangulaire verticale au milieu
		const size = Math.min(width, height);
		canvas.width = 480;
		canvas.height = 640; // Ratio 3:4 typique photo d'identité

		const ctx = canvas.getContext('2d');
		if (ctx) {
			// Calcul du centrage
			const sourceX = (width - (size * 0.75)) / 2;
			const sourceY = (height - size) / 2;
			ctx.drawImage(
				videoEl,
				sourceX, sourceY, size * 0.75, size,
				0, 0, 480, 640
			);
			capturedImage = canvas.toDataURL('image/jpeg', 0.95);
		}

		stopCamera();
		isShutterActive = false;
		step = 4;
	}

	let isProcessing = $state(false);
	let processingError = $state('');
	let isProcessed = $state(false);
	let selectedBgColor = $state('blue-grad');

	/**
	 * @param {string} color
	 */
	function getCasualBgStyle(color) {
		switch (color) {
			case 'white': return 'background: #ffffff;';
			case 'light-gray': return 'background: #f1f5f9;';
			case 'dark-gray': return 'background: #334155;';
			case 'blue-grad': return 'background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);';
			default: return '';
		}
	}

	async function processBackground() {
		if (!capturedImage) return;
		isProcessing = true;
		processingError = '';
		
		try {
			const res = await fetch('/api/remove-bg', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ image: capturedImage })
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Erreur lors du traitement.');
			}

			const data = await res.json();
			capturedImage = data.image;
			isProcessed = true;
		} catch (err) {
			console.error('Erreur détourage:', err);
			processingError = err instanceof Error ? err.message : 'Le détourage automatique a échoué. Veuillez réessayer.';
		} finally {
			isProcessing = false;
		}
	}

	let isRedirecting = $state(false);

	async function handlePayment() {
		isRedirecting = true;
		processingError = '';
		try {
			const res = await fetch('/api/checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ formulaId: selectedFormula })
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Impossible d\'initialiser le paiement.');
			}

			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('Lien de paiement invalide.');
			}
		} catch (err) {
			console.error('Erreur de paiement:', err);
			processingError = err instanceof Error ? err.message : 'Une erreur s\'est produite. Veuillez réessayer.';
			isRedirecting = false;
		}
	}

	function restart() {
		stopCamera();
		capturedImage = '';
		isProcessing = false;
		processingError = '';
		isProcessed = false;
		selectedBgColor = 'blue-grad';
		isRedirecting = false;
		startCamera();
	}

	/**
	 * @param {number} targetStep
	 */
	function goToStep(targetStep) {
		if (targetStep < 4) {
			isProcessing = false;
			processingError = '';
			isProcessed = false;
			selectedBgColor = 'blue-grad';
			isRedirecting = false;
		}
		if (targetStep === 1) {
			stopCamera();
			step = 1;
		} else if (targetStep === 2 && selectedFormula) {
			stopCamera();
			step = 2;
		} else if (targetStep === 3 && selectedFormula && allChecked) {
			startCamera();
		} else if (targetStep === 4 && capturedImage) {
			stopCamera();
			step = 4;
		}
	}

	onDestroy(() => {
		stopCamera();
	});
</script>

<svelte:head>
	<title>Studio Photo Biométrique & Professionnel - IDidem</title>
</svelte:head>

<main class="photo-capture-page">
	<div class="container capture-container">
		
		<!-- HEADER STATIQUE -->
		<header class="page-header text-center animate-fade-in-up">
			<a href="/" class="back-link">← Retour à l'accueil</a>
			<h1>Studio Photo intelligent</h1>
			<p class="subtitle">Votre photo conforme OACI et ANTS ou professionnelle chez vous en quelques clics.</p>
		</header>

		<!-- ÉTAPES DU DESIGN -->
		<div class="steps-indicator">
			<button class="indicator-step clickable" class:active={step === 1} class:done={step > 1} onclick={() => goToStep(1)}>
				<span class="step-num">1</span> Formule
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!selectedFormula} class:active={step === 2} class:done={step > 2} onclick={() => goToStep(2)} disabled={!selectedFormula}>
				<span class="step-num">2</span> Consignes
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!selectedFormula && allChecked} class:active={step === 3} class:done={step > 3} onclick={() => goToStep(3)} disabled={!selectedFormula || !allChecked}>
				<span class="step-num">3</span> Prise de vue
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!capturedImage} class:active={step === 4} onclick={() => goToStep(4)} disabled={!capturedImage}>
				<span class="step-num">4</span> Finalisation
			</button>
		</div>

		<!-- ============================================== -->
		<!-- ÉTAPE 1 : CHOIX DE LA FORMULE -->
		<!-- ============================================== -->
		{#if step === 1}
			<section class="formula-section animate-fade-in">
				<h2>Sélectionnez votre type de photo</h2>
				<div class="formula-grid">
					{#each formulas as formula}
						<button class="formula-card" onclick={() => selectFormula(formula.id)}>
							<span class="formula-badge">{formula.badge}</span>
							<div class="formula-photo-frame">
								<img src={formula.image} alt={formula.title} class="formula-photo" />
							</div>
							<h3>{formula.title}</h3>
							<p class="formula-subtitle">{formula.subtitle}</p>
							<p class="formula-desc">{formula.desc}</p>
							<span class="action-arrow">Choisir cette formule →</span>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		<!-- ============================================== -->
		<!-- ÉTAPE 2 : TUTORIEL ET CONSIGNES -->
		<!-- ============================================== -->
		{#if step === 2 && activeFormulaDetails}
			<section class="tutorial-section animate-fade-in">
				<div class="tutorial-card">
					<div class="tutorial-header">
						<div class="tutorial-icon-wrapper">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="tutorial-icon-svg">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
							</svg>
						</div>
						<div>
							<h2>Règles de conformité à valider</h2>
							<p>{activeFormulaDetails.title} — {activeFormulaDetails.subtitle}</p>
						</div>
					</div>

					<div class="checklist-header">
						<p class="intro-text">
							Pour assurer la validation automatique de votre photo par notre IA et les administrations, veuillez lire et valider chaque consigne :
						</p>
						<button class="btn-check-all" onclick={checkAll}>Tout cocher</button>
					</div>

					<div class="checklist">
						{#each activeFormulaDetails.rules as rule, i}
							<button class="checklist-item" class:checked={checklistChecked[i]} onclick={() => toggleChecklist(i)}>
								<span class="checkbox">
									{#if checklistChecked[i]}
										✓
									{/if}
								</span>
								<span class="rule-text">{rule}</span>
							</button>
						{/each}
					</div>

					<div class="tutorial-actions">
						<button class="btn-back" onclick={() => step = 1}>← Modifier la formule</button>
						<button class="btn-start" disabled={!allChecked} onclick={startCamera}>
							Activer ma caméra & Commencer
						</button>
					</div>
				</div>
			</section>
		{/if}

		<!-- ============================================== -->
		<!-- ÉTAPE 3 : CAMÉRA ET GABARIT -->
		<!-- ============================================== -->
		{#if step === 3}
			<section class="camera-section animate-fade-in">
				<div class="camera-frame-wrapper">
					
					{#if cameraError}
						<div class="camera-error">
							<p>⚠️ {cameraError}</p>
							<button class="btn-start" onclick={startCamera}>Réessayer</button>
							<button class="btn-back" onclick={() => step = 2}>Retour aux consignes</button>
						</div>
					{:else}
						<div class="video-container">
							<!-- Flux vidéo réel -->
							<!-- svelte-ignore a11y_media_has_caption -->
							<video bind:this={videoEl} autoplay playsinline></video>

							<!-- Gabarit biométrique dynamique -->
							{#if activeFormulaDetails}
								<div class="biometric-gabarit {activeFormulaDetails.gabaritClass}">
									<div class="face-oval"></div>
									<div class="eyes-line"></div>
								</div>
							{/if}

							<!-- Minuteurs / Indicateur de capture -->
							{#if isShutterActive}
								<div class="countdown-overlay">
									<span class="countdown-number">{countdown}</span>
								</div>
							{/if}
						</div>

						<div class="camera-controls">
							<button class="btn-abort" onclick={() => { stopCamera(); step = 2; }}>Annuler</button>
							
							<button class="shutter-button" class:disabled={isShutterActive} onclick={startCountdown} aria-label="Prendre la photo">
								<div class="inner-circle"></div>
							</button>

							<button class="btn-capture-now" disabled={isShutterActive} onclick={capturePhoto}>
								Instantané
							</button>
						</div>

						<div class="instructions-live">
							<p>💡 Alignez vos yeux sur la ligne bleue et votre visage dans l'ovale en pointillés.</p>
						</div>
					{/if}
				</div>
			</section>
		{/if}

		<!-- ============================================== -->
		<!-- ÉTAPE 4 : APERÇU ET ACTIONS -->
		<!-- ============================================== -->
		{#if step === 4}
			<section class="result-section animate-fade-in">
				<h2>Aperçu de votre cliché</h2>
				<p class="result-subtitle">Voici la photo qui sera traitée et livrée.</p>

				<div class="result-layout">
					{#if isProcessing}
						<div class="processing-loader text-center">
							<div class="spinner"></div>
							<h3>Détorage de précision par IA...</h3>
							<p>Veuillez patienter pendant la suppression automatique de l'arrière-plan.</p>
						</div>
					{:else}
						<div class="photo-preview-card"
							class:bg-gray={isProcessed && selectedFormula !== 'casual'}
							style={isProcessed && selectedFormula === 'casual' ? getCasualBgStyle(selectedBgColor) : ''}
						>
							<img src={capturedImage} alt="Cliché capturé" />
						</div>

						<div class="result-info">
							{#if processingError}
								<div class="status-error-badge">
									<span>⚠️</span> {processingError}
								</div>
							{:else if isProcessed}
								<div class="status-success-badge animate-pulse">
									<span>✓</span> Fond supprimé & conforme
								</div>
							{/if}

							{#if selectedFormula === 'casual' && isProcessed}
								<div class="background-selector">
									<h4>Couleur de fond du profil :</h4>
									<div class="color-options">
										<button class="color-btn bg-white" class:active={selectedBgColor === 'white'} onclick={() => selectedBgColor = 'white'} aria-label="Blanc"></button>
										<button class="color-btn bg-light-gray" class:active={selectedBgColor === 'light-gray'} onclick={() => selectedBgColor = 'light-gray'} aria-label="Gris clair"></button>
										<button class="color-btn bg-dark-gray" class:active={selectedBgColor === 'dark-gray'} onclick={() => selectedBgColor = 'dark-gray'} aria-label="Gris foncé"></button>
										<button class="color-btn bg-blue-grad" class:active={selectedBgColor === 'blue-grad'} onclick={() => selectedBgColor = 'blue-grad'} aria-label="Bleu dégradé"></button>
									</div>
								</div>
							{/if}

							<h3>Prochaines étapes :</h3>
							<ul>
								{#if isProcessed}
									<li>🔍 Vérification finale de conformité biométrique.</li>
									<li>📧 Génération de la planche et du code e-photo.</li>
									<li>💳 Finalisation de la commande et paiement sécurisé.</li>
								{:else}
									<li>🔍 Traitement IA : Détourage de précision et correction du fond de couleur réglementaire.</li>
									<li>✅ Vérification de conformité par un opérateur agréé.</li>
									<li>📧 Réception de votre code ANTS par e-mail sous 10 minutes.</li>
								{/if}
							</ul>

							<div class="result-actions">
								<button class="btn-retake" disabled={isRedirecting} onclick={restart}>Recommencer</button>
								{#if isProcessed}
									<button class="btn-confirm-photo" disabled={isRedirecting} onclick={handlePayment}>
										{#if isRedirecting}
											Redirection...
										{:else}
											Procéder au paiement
										{/if}
									</button>
								{:else}
									<button class="btn-confirm-photo" onclick={processBackground}>
										Détourer ma photo
									</button>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</section>
		{/if}

	</div>
</main>

<style>
	.background-selector {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.background-selector h4 {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--gray-700);
	}

	.color-options {
		display: flex;
		gap: 0.75rem;
	}

	.color-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid var(--white);
		box-shadow: 0 0 0 1px var(--gray-300);
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.color-btn:hover {
		transform: scale(1.1);
	}

	.color-btn.active {
		box-shadow: 0 0 0 2px var(--blue-600);
		transform: scale(1.1);
	}

	.color-btn.bg-white { background: #ffffff; }
	.color-btn.bg-light-gray { background: #f1f5f9; }
	.color-btn.bg-dark-gray { background: #334155; }
	.color-btn.bg-blue-grad { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }

	.photo-preview-card.bg-gray {
		background: #d1d5db; /* Gris réglementaire */
	}

	.photo-preview-card.bg-casual {
		background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); /* Profil Pro bleu doux */
	}

	.processing-loader {
		width: 100%;
		padding: 3rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid var(--gray-200);
		border-top-color: var(--blue-600);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.status-error-badge {
		background: #fee2e2;
		color: #b91c1c;
		font-weight: 700;
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		align-self: flex-start;
		font-size: 0.9rem;
	}

	.photo-capture-page {
		min-height: 100vh;
		background-color: var(--gray-50);
		padding: 3rem 0;
	}
	
	.capture-container {
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.page-header {
		margin-bottom: 1rem;
	}

	.back-link {
		color: var(--blue-700);
		font-weight: 600;
		font-size: 0.95rem;
		display: inline-block;
		margin-bottom: 1rem;
		transition: var(--transition-fast);
	}
	.back-link:hover {
		color: var(--blue-900);
		transform: translateX(-3px);
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 900;
		color: var(--gray-900);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--gray-500);
		font-size: 1.1rem;
	}

	/* --- Indicateur d'étapes --- */
	.steps-indicator {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--white);
		padding: 1.25rem 2rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
	}

	.indicator-step {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-400);
		transition: var(--transition-normal);
		border: none;
		background: none;
		padding: 0;
		font-family: inherit;
	}

	.indicator-step.clickable {
		cursor: pointer;
	}

	.indicator-step.clickable:hover {
		color: var(--blue-600);
	}

	.indicator-step.active {
		color: var(--blue-700);
	}

	.indicator-step.done {
		color: var(--green-500);
	}

	.step-num {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--gray-100);
		border: 1px solid var(--gray-200);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--gray-500);
		transition: var(--transition-normal);
	}

	.indicator-step.active .step-num {
		background: var(--blue-50);
		border-color: var(--blue-500);
		color: var(--blue-700);
	}

	.indicator-step.done .step-num {
		background: #eaf6ec;
		border-color: var(--green-400);
		color: var(--green-500);
	}

	.indicator-line {
		flex: 1;
		height: 2px;
		background: var(--gray-100);
		margin: 0 1rem;
	}

	/* --- Étape 1 : Formules --- */
	.formula-section h2 {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--gray-900);
		margin-bottom: 2rem;
		text-align: center;
	}

	.formula-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.formula-card {
		background: var(--white);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-lg);
		padding: 2.5rem 1.75rem;
		text-align: center;
		position: relative;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		box-shadow: var(--shadow-sm);
		transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
	}

	.formula-card:hover {
		transform: translateY(-8px);
		box-shadow: var(--shadow-lg);
		border-color: var(--blue-400);
	}

	.formula-badge {
		position: absolute;
		top: 15px;
		background: var(--blue-50);
		color: var(--blue-700);
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.3rem 0.8rem;
		border-radius: var(--radius-full);
	}

	.formula-photo-frame {
		width: 120px;
		height: 155px;
		background: var(--gray-100);
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 1px solid var(--gray-300);
		box-shadow: var(--shadow-sm);
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.formula-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.formula-card h3 {
		font-size: 1.3rem;
		font-weight: 800;
	}

	.formula-subtitle {
		color: var(--blue-600);
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.formula-desc {
		font-size: 0.9rem;
		color: var(--gray-500);
		line-height: 1.5;
		margin-top: 0.5rem;
		flex-grow: 1;
	}

	.action-arrow {
		margin-top: 1.5rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--blue-700);
		transition: var(--transition-fast);
	}

	.formula-card:hover .action-arrow {
		color: var(--blue-900);
		transform: translateX(4px);
	}

	/* --- Étape 2 : Consignes/Tutoriel --- */
	.tutorial-section {
		display: flex;
		justify-content: center;
	}

	.tutorial-card {
		background: var(--white);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-lg);
		padding: 3rem;
		width: 100%;
		max-width: 700px;
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.tutorial-header {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		border-bottom: 1px solid var(--gray-100);
		padding-bottom: 1.25rem;
	}

	.tutorial-icon-wrapper {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--blue-50);
		color: var(--blue-600);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.tutorial-icon-svg {
		width: 26px;
		height: 26px;
	}

	.tutorial-header h2 {
		font-size: 1.5rem;
		font-weight: 800;
	}

	.tutorial-header p {
		color: var(--blue-600);
		font-weight: 700;
		font-size: 0.9rem;
	}

	.intro-text {
		color: var(--gray-600);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.checklist-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
	}

	.btn-check-all {
		color: var(--blue-600);
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration: underline;
		flex-shrink: 0;
		transition: var(--transition-fast);
		padding: 0.25rem 0;
	}

	.btn-check-all:hover {
		color: var(--blue-900);
	}

	.checklist {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.checklist-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-align: left;
		padding: 1rem 1.25rem;
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.checklist-item:hover {
		background: var(--gray-100);
		border-color: var(--gray-300);
	}

	.checklist-item.checked {
		background: #eaf6ec;
		border-color: var(--green-400);
	}

	.checkbox {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		border: 2px solid var(--gray-300);
		background: var(--white);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		color: var(--green-500);
		font-size: 0.9rem;
		transition: var(--transition-fast);
	}

	.checklist-item.checked .checkbox {
		border-color: var(--green-500);
		background: var(--green-500);
		color: var(--white);
	}

	.rule-text {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-700);
	}

	.checklist-item.checked .rule-text {
		color: #1b5e20;
	}

	.tutorial-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 1.5rem;
		gap: 1rem;
	}

	.btn-back {
		background: var(--gray-100);
		color: var(--gray-700);
		padding: 0.85rem 1.5rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.95rem;
		transition: var(--transition-fast);
	}

	.btn-back:hover {
		background: var(--gray-200);
	}

	.btn-start {
		background: var(--blue-700);
		color: var(--white);
		padding: 0.85rem 2rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.95rem;
		transition: var(--transition-fast);
	}

	.btn-start:hover:not(:disabled) {
		background: var(--blue-900);
		transform: translateY(-1px);
	}

	.btn-start:disabled {
		background: var(--gray-300);
		color: var(--gray-500);
		cursor: not-allowed;
	}

	/* --- Étape 3 : Caméra --- */
	.camera-section {
		display: flex;
		justify-content: center;
	}

	.camera-frame-wrapper {
		background: var(--gray-900);
		border-radius: var(--radius-lg);
		padding: 2.5rem;
		width: 100%;
		max-width: 580px;
		box-shadow: var(--shadow-xl);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.camera-error {
		color: var(--white);
		text-align: center;
		padding: 3rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.video-container {
		position: relative;
		width: 100%;
		aspect-ratio: 3/4;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: #000;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(-1); /* Effet miroir naturel pour l'utilisateur */
	}

	/* Gabarits superposés */
	.biometric-gabarit {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.face-oval {
		width: 60%;
		height: 60%;
		border: 3px dashed rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
		transition: var(--transition-normal);
	}

	.official-gabarit .face-oval {
		border-color: var(--green-400);
		width: 55%;
		height: 55%;
	}

	.casual-gabarit .face-oval {
		border-color: var(--blue-400);
		width: 62%;
		height: 62%;
		border-radius: 45%;
	}

	.eyes-line {
		position: absolute;
		width: 100%;
		height: 1px;
		border-top: 2px dashed rgba(66, 165, 245, 0.7);
		top: 45%;
	}

	.countdown-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.countdown-number {
		font-family: var(--font-heading);
		font-size: 6rem;
		font-weight: 900;
		color: var(--white);
		animation: pulse 1s infinite;
	}

	.camera-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
	}

	.btn-abort {
		color: var(--gray-400);
		font-weight: 700;
		font-size: 0.95rem;
		transition: var(--transition-fast);
	}
	.btn-abort:hover {
		color: var(--white);
	}

	.shutter-button {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: 4px solid var(--white);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition-fast);
	}

	.shutter-button:hover:not(.disabled) {
		transform: scale(1.05);
		background: rgba(255, 255, 255, 0.4);
	}

	.shutter-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.inner-circle {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--white);
		transition: var(--transition-fast);
	}

	.shutter-button:hover .inner-circle {
		background: var(--blue-200);
	}

	.btn-capture-now {
		background: var(--blue-600);
		color: var(--white);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.9rem;
	}

	.instructions-live {
		text-align: center;
		color: var(--gray-400);
		font-size: 0.85rem;
	}

	/* --- Étape 4 : Aperçu & Validation --- */
	.result-section {
		text-align: center;
	}

	.result-section h2 {
		font-size: 1.75rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}

	.result-subtitle {
		color: var(--gray-500);
		margin-bottom: 2.5rem;
	}

	.result-layout {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 3rem;
		align-items: center;
		text-align: left;
		background: var(--white);
		padding: 3rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-md);
	}

	.photo-preview-card {
		width: 100%;
		max-width: 320px;
		aspect-ratio: 3/4;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 4px solid var(--white);
		box-shadow: var(--shadow-lg);
		margin: 0 auto;
	}

	.photo-preview-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.result-info {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.status-success-badge {
		background: #eaf6ec;
		color: #2e7d32;
		font-weight: 700;
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		align-self: flex-start;
		font-size: 0.9rem;
	}

	.status-success-badge span {
		background: #2e7d32;
		color: var(--white);
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
	}

	.result-info h3 {
		font-size: 1.2rem;
		font-weight: 800;
	}

	.result-info ul {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		color: var(--gray-600);
		font-size: 0.95rem;
	}

	.result-info li {
		position: relative;
		padding-left: 1.5rem;
	}

	.result-info li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--blue-500);
		font-size: 1.5rem;
		line-height: 1;
	}

	.result-actions {
		display: flex;
		gap: 1.25rem;
		margin-top: 1rem;
	}

	.btn-retake {
		flex: 1;
		background: var(--gray-100);
		color: var(--gray-700);
		padding: 0.9rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		transition: var(--transition-fast);
		text-align: center;
	}

	.btn-retake:hover {
		background: var(--gray-200);
	}

	.btn-confirm-photo {
		flex: 1.5;
		background: var(--blue-700);
		color: var(--white);
		padding: 0.9rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		transition: var(--transition-fast);
		box-shadow: var(--shadow-sm);
		text-align: center;
	}

	.btn-confirm-photo:hover {
		background: var(--blue-900);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	/* --- Responsive --- */
	@media (max-width: 768px) {
		.formula-grid {
			grid-template-columns: 1fr;
		}

		.steps-indicator {
			padding: 1rem;
			gap: 0.5rem;
		}

		.indicator-step {
			font-size: 0.75rem;
			gap: 0.4rem;
		}

		.step-num {
			width: 22px;
			height: 22px;
			font-size: 0.75rem;
		}

		.result-layout {
			grid-template-columns: 1fr;
			padding: 1.5rem;
			gap: 2rem;
		}

		.tutorial-card {
			padding: 1.5rem;
		}

		.camera-frame-wrapper {
			padding: 1.5rem 1rem;
		}
	}
</style>
