<!-- src/routes/photo/+page.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';
	import ePhotoImg from '$lib/assets/EPhoto.png';
	import photoIdentity from '$lib/assets/photos-identité.webp';

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
			title: 'E-Photo Officielle',
			subtitle: 'Permis de conduire & Titre de séjour',
			desc: 'Planche de photos biométriques certifiées conforme ANTS avec code e-photo unique.',
			badge: 'ANTS & OACI',
			icon: '🚗',
			image: ePhotoImg,
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
			desc: 'Planche de 6 photos 100% conforme aux normes OACI et ANTS pour vos démarches en mairie et préfecture.',
			badge: 'Mairie & préfecture',
			icon: '🛂',
			image: photoIdentity,
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

	let currentTutoPage = $state(0);

	const tutorialSteps = [
		{
			id: 1,
			title: "1. Lumière naturelle & diffuse",
			description: "Placez-vous face à une grande source de lumière douce (une fenêtre avec un voilage par exemple). Évitez le soleil direct ou les lampes qui créent des contrastes trop violents sur votre visage.",
			image: "/assets/tutorial/face-fenetre.png"
		},
		{
			id: 2,
			title: "2. Choisissez le bon fond",
			description: "Un mur clair et uni est idéal. Pas de panique si vous n'en avez pas : notre intelligence artificielle détourera l'arrière-plan.",
			image: "/assets/tutorial/dos-mur.png"
		},
		{
			id: 3,
			title: "3. Éliminez toutes les ombres",
			description: "Ne tournez pas la tête. Restez bien de face pour que la lumière éclaire votre visage de manière symétrique. Aucune ombre ne doit apparaître sur les joues, sous le nez ou sur le cou.",
			image: "/assets/tutorial/face-sans-ombre.jpg"
		},
	
		{
			id: 4,
			title: "4. Attention à la surexposition",
			description: "Évitez d'avoir des zones trop blanches ou réfléchissantes sur votre peau. La texture de votre peau doit rester visible pour que la photo soit acceptée par l'administration.",
			image: "/assets/tutorial/visage-surex-ididem.png"
		}
	];

	/**
	 * @param {string} id
	 */
	function selectFormula(id) {
		selectedFormula = id;
		if (id === 'casual') {
			selectedBgColor = 'blue-grad';
		} else {
			selectedBgColor = 'light-gray'; // Gris standard par défaut pour e-photo et officielle
		}
		currentTutoPage = 0;
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
	 * @param {string} formula
	 * @param {string} color
	 */
	function getBgStyleForFormula(formula, color) {
		if (formula === 'e-photo') {
			return 'background: #e2e8f0;'; // Gris clair réglementaire ANTS
		}
		if (formula === 'officielle') {
			if (color === 'white') {
				return 'background: #ffffff;'; // Maghreb (Blanc)
			}
			return 'background: #d1d5db;'; // France & Europe (Gris standard)
		}
		if (formula === 'casual') {
			switch (color) {
				case 'white': return 'background: #ffffff;';
				case 'light-gray': return 'background: #f1f5f9;';
				case 'dark-gray': return 'background: #334155;';
				case 'blue-grad': return 'background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);';
				default: return '';
			}
		}
		return '';
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
			localStorage.setItem('ididem_captured_image', capturedImage);
			localStorage.setItem('ididem_selected_formula', selectedFormula);
			localStorage.setItem('ididem_selected_bg', selectedBgColor);
			localStorage.setItem('ididem_user_email', userEmail);
			localStorage.setItem('ididem_booking_date', bookingDate);
			localStorage.setItem('ididem_booking_time', bookingTime);
			localStorage.setItem('ididem_client_session_id', clientSessionId);

			const res = await fetch('/api/checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ formulaId: selectedFormula, email: userEmail })
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

	let userEmail = $state('');
	let bookingDate = $state('');
	let bookingTime = $state('');
	let isAppointmentBooked = $state(false);
	let clientSessionId = $state('ID-' + Math.random().toString(36).substring(2, 9).toUpperCase());
	let copiedLink = $state(false);

	function copySignatureLinkInline() {
		const origin = window.location.origin;
		const link = `${origin}/signer/${clientSessionId}`;
		navigator.clipboard.writeText(link).then(() => {
			copiedLink = true;
			setTimeout(() => {
				copiedLink = false;
			}, 2000);
		});
	}

	const nextDays = [
		{ label: 'Lundi 27 juil. (Aujourd\'hui)', value: 'Lundi 27 juillet' },
		{ label: 'Mardi 28 juil. (Demain)', value: 'Mardi 28 juillet' },
		{ label: 'Mercredi 29 juil.', value: 'Mercredi 29 juillet' },
		{ label: 'Jeudi 30 juil.', value: 'Jeudi 30 juillet' },
		{ label: 'Vendredi 31 juil.', value: 'Vendredi 31 juillet' }
	];

	const timeSlots = [
		'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
		'14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
	];

	function confirmBooking() {
		if (bookingDate && bookingTime) {
			isAppointmentBooked = true;
		}
	}

	/**
	 * @param {string} email
	 */
	function isEmailValid(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function simulatePaymentSuccess() {
		localStorage.setItem('ididem_captured_image', capturedImage);
		localStorage.setItem('ididem_selected_formula', selectedFormula);
		localStorage.setItem('ididem_selected_bg', selectedBgColor);
		localStorage.setItem('ididem_user_email', userEmail);
		localStorage.setItem('ididem_booking_date', bookingDate);
		localStorage.setItem('ididem_booking_time', bookingTime);
		localStorage.setItem('ididem_client_session_id', clientSessionId);
		window.location.href = `/photo/success?session_id=${clientSessionId}`;
	}

	function restart() {
		stopCamera();
		capturedImage = '';
		isProcessing = false;
		processingError = '';
		isProcessed = false;
		selectedBgColor = 'blue-grad';
		isRedirecting = false;
		userEmail = '';
		bookingDate = '';
		bookingTime = '';
		isAppointmentBooked = false;
		clientSessionId = 'ID-' + Math.random().toString(36).substring(2, 9).toUpperCase();
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
			userEmail = '';
			bookingDate = '';
			bookingTime = '';
			isAppointmentBooked = false;
			clientSessionId = 'ID-' + Math.random().toString(36).substring(2, 9).toUpperCase();
		}
		if (targetStep === 1) {
			stopCamera();
			step = 1;
		} else if (targetStep === 2 && selectedFormula) {
			stopCamera();
			step = 2;
		} else if (targetStep === 3 && selectedFormula) {
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
			<button class="indicator-step" class:clickable={!!selectedFormula} class:active={step === 3} class:done={step > 3} onclick={() => goToStep(3)} disabled={!selectedFormula}>
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
				<div class="booklet-card">
					<!-- En-tête du livret -->
					<div class="booklet-header">
						<span class="booklet-badge">GUIDE DE RÉUSSITE BIOMÉTRIQUE</span>
						<span class="booklet-progress">Conseil {currentTutoPage + 1}/{tutorialSteps.length}</span>
					</div>

					<!-- Barre de progression -->
					<div class="booklet-progress-bar">
						<div class="fill" style="width: {((currentTutoPage + 1) / tutorialSteps.length) * 100}%"></div>
					</div>

					<!-- Corps du livre (Page active) -->
					{#key currentTutoPage}
						<div class="booklet-page animate-fade-in">
							<div class="booklet-image-container">
								<img src={tutorialSteps[currentTutoPage].image} alt={tutorialSteps[currentTutoPage].title} />
							</div>
							<div class="booklet-content">
								<h2>{tutorialSteps[currentTutoPage].title}</h2>
								<p>{tutorialSteps[currentTutoPage].description}</p>
							</div>
						</div>
					{/key}

					<!-- Actions de navigation -->
					<div class="booklet-footer">
						<button class="btn-booklet-prev" disabled={currentTutoPage === 0} onclick={() => currentTutoPage--}>
							← Précédent
						</button>
						
						<div class="page-dots">
							{#each tutorialSteps as _, i}
								<button class="dot" class:active={currentTutoPage === i} onclick={() => currentTutoPage = i} aria-label="Conseil {i + 1}" type="button"></button>
							{/each}
						</div>

						{#if currentTutoPage < tutorialSteps.length - 1}
							<button class="btn-booklet-next" onclick={() => currentTutoPage++}>
								Suivant →
							</button>
						{:else}
							<button class="btn-booklet-start" onclick={startCamera}>
								Démarrer la caméra
							</button>
						{/if}
					</div>

					<div class="booklet-footer-links">
						<button class="btn-booklet-cancel" onclick={() => step = 1}>
							← Changer de formule
						</button>
						<button class="btn-booklet-cancel" onclick={startCamera}>
							Passer le guide →
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
							<h3>Détourage de précision par IA...</h3>
							<p>Veuillez patienter pendant la suppression automatique de l'arrière-plan.</p>
						</div>
					{:else}
						<div class="photo-preview-card"
							style={isProcessed ? getBgStyleForFormula(selectedFormula, selectedBgColor) : ''}
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

							{#if selectedFormula === 'officielle' && isProcessed}
								<div class="background-selector">
									<h4>Pays / Norme du fond :</h4>
									<div class="destination-options">
										<button class="dest-btn animate-fade-in" class:active={selectedBgColor === 'light-gray'} onclick={() => selectedBgColor = 'light-gray'}>
											🇫🇷 France & Europe (Gris)
										</button>
										<button class="dest-btn animate-fade-in" class:active={selectedBgColor === 'white'} onclick={() => selectedBgColor = 'white'}>
											🇲🇦 🇩🇿 🇹🇳 Maghreb (Blanc)
										</button>
									</div>
								</div>
							{/if}

							{#if selectedFormula === 'e-photo' && isProcessed}
								<h3>Procédure : Signature & Code ANTS</h3>
								<div class="legal-assurance-card">
									<h5>🛡️ Protocole de Conformité ANTS (Obligatoire)</h5>
									<p>Conformément à la réglementation française sur l'usage de faux, la e-Photo officielle nécessite le recueil de votre signature numérique <strong>en direct avec notre opérateur agréé</strong>. Cela vous garantit à 100% l'acceptation de votre e-photo par votre préfecture.</p>
									
									<div class="process-steps">
										<div class="p-step">
											<span class="badge">1</span>
											<div class="p-step-content">
												<strong>Créneau visio</strong>
												<span>Choisissez votre rendez-vous de signature en direct (2 min).</span>
											</div>
										</div>
										<div class="p-step">
											<span class="badge">2</span>
											<div class="p-step-content">
												<strong>Empreinte CB</strong>
												<span>Enregistrez votre paiement sécurisé <em>(Hold temporaire, aucun débit)</em>.</span>
											</div>
										</div>
										<div class="p-step">
											<span class="badge">3</span>
											<div class="p-step-content">
												<strong>Débit & Livraison</strong>
												<span>Vous n'êtes débité qu'après validation et réception de votre code e-Photo.</span>
											</div>
										</div>
									</div>
								</div>
							{:else}
								<h3>Prochaines étapes :</h3>
								<ul class="steps-list">
									{#if isProcessed}
										{#if selectedFormula === 'e-photo'}
											<li class="animate-fade-in">
												<span class="step-icon text-blue">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 9-3.75 3.75L8.25 9m0 0v6M12 9v6m3.75-6v6M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" /></svg>
												</span>
												<div class="step-text">
													<strong>Rendez-vous visio & Signature</strong>
													<span>Signature numérique en direct avec l'opérateur.</span>
												</div>
											</li>
										{/if}
										<li class="animate-fade-in">
											<span class="step-icon text-green">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
											</span>
											<div class="step-text">
												<strong>Paiement sécurisé</strong>
												<span>Finalisation de la commande par CB.</span>
											</div>
										</li>
									{:else}
										<li>
											<span class="step-icon text-purple">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 21l8.904-.813a18.502 18.502 0 1 0-8.091-4.283Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M11.99 3.01H12V3h-.01v.01Z" /></svg>
											</span>
											<div class="step-text">
												<strong>Détourage intelligent par IA</strong>
												<span>Suppression de l'arrière-plan et application du fond conforme.</span>
											</div>
										</li>
										<li>
											<span class="step-icon text-yellow">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
											</span>
											<div class="step-text">
												<strong>Contrôle de conformité</strong>
												<span>Validation finale par un photographe professionnel.</span>
											</div>
										</li>
										{#if selectedFormula === 'e-photo'}
											<li>
												<span class="step-icon text-blue">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
												</span>
												<div class="step-text">
													<strong>Signature électronique en direct</strong>
													<span>Signature biométrique sécurisée en visioconférence.</span>
												</div>
											</li>
										{/if}
										<li>
											<span class="step-icon text-teal">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
												</span>
												<div class="step-text">
													<strong>Envoi par e-mail</strong>
													<span>{selectedFormula === 'e-photo' ? 'Réception de votre code photo ANTS.' : 'Obtention de votre planche photo HD.'}</span>
												</div>
											</li>
										{/if}
								</ul>
							{/if}

							{#if isProcessed}
								<div class="email-collection-box">
									<label for="client-email">📧 Votre adresse e-mail :</label>
									<input 
										type="email" 
										id="client-email" 
										placeholder="nom@exemple.com" 
										bind:value={userEmail}
										disabled={isRedirecting || isAppointmentBooked}
									/>
									<p class="email-tip">Requis pour l'envoi de vos photos et du suivi de votre commande.</p>
								</div>

								{#if selectedFormula === 'e-photo' && isEmailValid(userEmail)}
									{#if !isAppointmentBooked}
										<div class="booking-section-inline">
											<h4>📅 Planifiez votre visioconférence de signature</h4>
											<p class="booking-intro">Veuillez choisir un créneau horaire pour l'appel de signature en direct :</p>
											
											<div class="booking-fields">
												<div class="form-group">
													<label for="date-select">Choisir un jour :</label>
													<select id="date-select" bind:value={bookingDate}>
														<option value="">-- Sélectionnez un jour --</option>
														{#each nextDays as day}
															<option value={day.value}>{day.label}</option>
														{/each}
													</select>
												</div>

												<div class="form-group">
													<label for="time-select">Choisir un créneau :</label>
													<select id="time-select" bind:value={bookingTime} disabled={!bookingDate}>
														<option value="">-- Sélectionnez une heure --</option>
														{#each timeSlots as slot}
															<option value={slot}>{slot}</option>
														{/each}
													</select>
												</div>
											</div>

											<button class="btn-confirm-booking" onclick={confirmBooking} disabled={!bookingDate || !bookingTime}>
												💾 Confirmer ce créneau
											</button>
										</div>
									{:else}
										<div class="booking-confirmed-card">
											<div class="confirmed-header">
												<span>✅ Créneau de rendez-vous réservé</span>
												<button class="btn-change-booking" onclick={() => isAppointmentBooked = false}>Modifier</button>
											</div>
											<p>Le <strong>{bookingDate}</strong> à <strong>{bookingTime}</strong></p>
											
											<div class="inline-copy-link">
												<span class="link-label">Copiez votre lien Visio pour accéder à votre signature en ligne, accompagné de notre agent. Collez votre lien dans un bloc note ou un fichier Word (...)</span>
												<div class="copy-input-group">
													<input type="text" readonly value="{window.location.origin}/signer/{clientSessionId}" />
													<button onclick={copySignatureLinkInline}>
														{copiedLink ? 'Copié !' : 'Copier'}
													</button>
												</div>
											</div>
										</div>
									{/if}
								{/if}
							{/if}

							<div class="result-actions">
								<button class="btn-retake" disabled={isRedirecting} onclick={restart}>Recommencer</button>
								{#if isProcessed}
									{#if selectedFormula !== 'e-photo' || isAppointmentBooked}
										<button class="btn-confirm-photo" disabled={isRedirecting || !isEmailValid(userEmail)} onclick={handlePayment}>
											{#if isRedirecting}
												Redirection...
											{:else}
												Procéder au paiement ({selectedFormula === 'casual' ? '9,99' : '4,99'} €)
											{/if}
										</button>
									{/if}
								{:else}
									<button class="btn-confirm-photo" onclick={processBackground}>
										Détourer ma photo
									</button>
								{/if}
							</div>

							{#if isProcessed && (selectedFormula !== 'e-photo' || isAppointmentBooked)}
								<div class="dev-actions">
									<button class="btn-dev-simulate" disabled={!isEmailValid(userEmail)} onclick={simulatePaymentSuccess}>
										🧪 Simuler le paiement (Test Dev)
									</button>
								</div>
							{/if}
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

	.destination-options {
		display: flex;
		gap: 0.75rem;
		width: 100%;
	}

	.dest-btn {
		flex: 1;
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		border-radius: var(--radius-sm);
		border: 1px solid var(--gray-300);
		background: var(--white);
		color: var(--gray-700);
		cursor: pointer;
		transition: var(--transition-fast);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.dest-btn:hover {
		background: var(--gray-50);
		border-color: var(--gray-400);
	}

	.dest-btn.active {
		background: var(--blue-50);
		border-color: var(--blue-500);
		color: var(--blue-700);
		box-shadow: 0 0 0 1px var(--blue-500);
	}

	.steps-list {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.steps-list li {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 0 !important;
	}

	.steps-list li::before {
		display: none !important;
	}

	.step-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.step-icon.text-blue { color: var(--blue-600); background: #eff6ff; }
	.step-icon.text-green { color: #16a34a; background: #f0fdf4; }
	.step-icon.text-purple { color: #9333ea; background: #faf5ff; }
	.step-icon.text-yellow { color: #d97706; background: #fef3c7; }
	.step-icon.text-teal { color: #0d9488; background: #f0fdfa; }

	.step-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.step-text strong {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--gray-800);
	}

	.step-text span {
		font-size: 0.85rem;
		color: var(--gray-500);
		line-height: 1.35;
	}

	.color-btn.bg-dark-gray { background: #334155; }
	.color-btn.bg-blue-grad { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }

	.email-collection-box {
		margin: 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
	}

	.email-collection-box label {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--gray-700);
	}

	.email-collection-box input {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--gray-300);
		font-size: 0.95rem;
		outline: none;
		color: var(--gray-800);
		transition: var(--transition-fast);
	}

	.email-collection-box input:focus {
		border-color: var(--blue-600);
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
	}

	.email-tip {
		font-size: 0.75rem;
		color: var(--gray-500);
		line-height: 1.4;
		margin: 0;
	}

	.dev-actions {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 1rem;
		border-top: 1px dashed var(--gray-200);
		padding-top: 1rem;
	}

	.btn-dev-simulate {
		background: #fef3c7;
		color: #92400e;
		border: 1px dashed #f59e0b;
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
		transition: var(--transition-fast);
		width: 100%;
		text-align: center;
	}

	.btn-dev-simulate:hover {
		background: #fde68a;
		transform: translateY(-2px);
		box-shadow: var(--shadow-sm);
	}

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
		width: 170px;
		height: 220px;
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
		padding: 5px
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

	.booklet-card {
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		padding: 2rem;
		max-width: 440px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		border: 1px solid var(--gray-200);
	}

	.booklet-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.booklet-badge {
		color: var(--blue-600);
		background: #eff6ff;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
	}

	.booklet-progress {
		color: var(--gray-500);
	}

	.booklet-header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.btn-skip-tuto {
		background: none;
		border: none;
		color: var(--gray-500);
		font-size: 0.8rem;
		font-weight: 700;
		cursor: pointer;
		transition: var(--transition-fast);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}

	.btn-skip-tuto:hover {
		color: var(--blue-600);
		background: var(--blue-50);
	}

	.booklet-progress-bar {
		width: 100%;
		height: 6px;
		background: var(--gray-100);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.booklet-progress-bar .fill {
		height: 100%;
		background: var(--gradient-cta);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.booklet-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-height: 380px;
	}

	.booklet-image-container {
		width: 340px;
		height: 240px;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--gray-900);
		border: 1px solid var(--gray-200);
		margin: 0 auto;
		box-shadow: var(--shadow-sm);
	}

	.booklet-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.booklet-content {
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.booklet-content h2 {
		font-size: 1.35rem;
		font-weight: 800;
		color: var(--gray-800);
	}

	.booklet-content p {
		font-size: 0.95rem;
		color: var(--gray-600);
		line-height: 1.5;
	}

	.booklet-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		border-top: 1px solid var(--gray-100);
		padding-top: 1.5rem;
	}

	.btn-booklet-prev {
		background: var(--gray-100);
		color: var(--gray-700);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.btn-booklet-prev:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-booklet-prev:hover:not(:disabled) {
		background: var(--gray-200);
	}

	.btn-booklet-next {
		background: var(--blue-600);
		color: var(--white);
		padding: 0.6rem 1.5rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.btn-booklet-next:hover {
		background: var(--blue-800);
	}

	.btn-booklet-start {
		background: var(--gradient-cta);
		color: var(--white);
		padding: 0.6rem 1.5rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		transition: var(--transition-fast);
		box-shadow: 0 4px 10px rgba(25, 118, 210, 0.2);
	}

	.btn-booklet-start:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
	}

	.page-dots {
		display: flex;
		gap: 0.5rem;
	}

	.page-dots .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--gray-300);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.page-dots .dot.active {
		background: var(--blue-600);
		transform: scale(1.25);
	}

	.btn-booklet-cancel {
		background: none;
		border: none;
		color: var(--gray-500);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.btn-booklet-cancel:hover {
		color: var(--blue-600);
	}

	.booklet-footer-links {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 0.5rem;
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
		height: 55vh; /* Limite la hauteur par rapport à l'écran pour tout afficher sans défilement */
		max-width: 100%;
		aspect-ratio: 3/4;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: #000;
		margin: 0 auto;
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
		width: 78%;
		height: 75%;
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

	/* --- Inline Booking Widget styles --- */
	.booking-section-inline {
		background: #f8fafc;
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		margin-top: 1rem;
		text-align: left;
	}

	.booking-section-inline h4 {
		margin: 0 0 0.5rem 0;
		color: var(--blue-700);
		font-size: 1rem;
		font-weight: 800;
	}

	.booking-intro {
		font-size: 0.8rem;
		color: var(--gray-600);
		line-height: 1.4;
		margin: 0 0 1rem 0;
	}

	.booking-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.booking-fields .form-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.booking-fields label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--gray-600);
	}

	.booking-fields select {
		padding: 0.6rem;
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		background: var(--white);
		color: var(--gray-800);
		outline: none;
	}

	.btn-confirm-booking {
		width: 100%;
		background: var(--blue-600);
		color: var(--white);
		padding: 0.75rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.85rem;
		transition: var(--transition-fast);
		text-align: center;
	}

	.btn-confirm-booking:hover:not(:disabled) {
		background: var(--blue-700);
	}

	.booking-confirmed-card {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: var(--radius-md);
		padding: 1rem;
		margin-top: 1rem;
		text-align: left;
	}

	.confirmed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.confirmed-header span {
		font-weight: 700;
		font-size: 0.9rem;
		color: #166534;
	}

	.btn-change-booking {
		background: transparent;
		color: var(--blue-600);
		font-weight: 700;
		font-size: 0.8rem;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.btn-change-booking:hover {
		text-decoration: underline;
	}

	.booking-confirmed-card p {
		margin: 0;
		font-size: 0.95rem;
		color: #14532d;
	}

	.legal-assurance-card {
		background: rgba(37, 99, 235, 0.05);
		border: 1px solid rgba(37, 99, 235, 0.15);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		margin: 1.25rem 0;
		text-align: left;
	}

	.legal-assurance-card h5 {
		margin: 0 0 0.5rem 0;
		color: var(--blue-700);
		font-size: 0.95rem;
		font-weight: 800;
	}

	.legal-assurance-card p {
		font-size: 0.8rem;
		color: var(--gray-600);
		line-height: 1.45;
		margin: 0 0 1rem 0;
	}

	.process-steps {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		border-top: 1px dashed rgba(37, 99, 235, 0.15);
		padding-top: 0.8rem;
	}

	.p-step {
		font-size: 0.78rem;
		color: var(--gray-700);
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		line-height: 1.35;
	}

	.p-step .badge {
		background: var(--blue-600);
		color: var(--white);
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.p-step-content {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.p-step-content strong {
		font-size: 0.85rem;
		color: var(--gray-800);
	}

	.p-step-content span {
		font-size: 0.78rem;
		color: var(--gray-600);
	}

	.inline-copy-link {
		margin-top: 1rem;
		border-top: 1px dashed rgba(22, 101, 52, 0.2);
		padding-top: 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.link-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: #166534;
	}

	.copy-input-group {
		display: flex;
		gap: 0.5rem;
	}

	.copy-input-group input {
		flex: 1;
		padding: 0.4rem 0.6rem;
		font-size: 0.8rem;
		border: 1px solid #bbf7d0;
		background: var(--white);
		border-radius: var(--radius-sm);
		color: #14532d;
		outline: none;
	}

	.copy-input-group button {
		background: #15803d;
		color: var(--white);
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.4rem 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.copy-input-group button:hover {
		background: #166534;
	}
</style>
