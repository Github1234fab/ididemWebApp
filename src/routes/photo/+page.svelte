<!-- src/routes/photo/+page.svelte -->
<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import ePhotoImg from '$lib/assets/e-photo_site.jpg';
	import photoIdentity from '$lib/assets/identite.jpg';
	import linkedin from '$lib/assets/linkedin.jpg';

	// Étape active : 1 = formule, 2 = consignes, 3 = caméra, 4 = résultat
	let step = $state(1);

	// Remonter automatiquement en haut de la page quand on change d'étape ou quand le détourage est terminé
	$effect(() => {
		step;
		isProcessed;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});

	onMount(() => {
		// Clear previous booking state when starting a new session
		localStorage.removeItem('ididem_booking_date');
		localStorage.removeItem('ididem_booking_time');
		localStorage.removeItem('ididem_is_appointment_booked');
		localStorage.removeItem('ididem_booking_phone');

		// Pré-sélectionner la formule depuis la requête d'URL (?formula=...)
		const params = new URLSearchParams(window.location.search);
		const formulaParam = params.get('formula');
		if (formulaParam && ['e-photo', 'officielle', 'casual'].includes(formulaParam)) {
			selectFormula(formulaParam);
		}
	});

	// Formule choisie
	let selectedFormula = $state(''); // 'e-photo', 'officielle', 'casual'

	// Options de livraison postale premium
	let deliveryRequested = $state(false);
	let deliveryName = $state('');
	let deliveryStreet = $state('');
	let deliveryZip = $state('');
	let deliveryCity = $state('');

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
			gabaritClass: 'official-gabarit',
			delay: 'Délai : 12h max'
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
			gabaritClass: 'official-gabarit',
			delay: 'Délai : Instantané'
		},
		{
			id: 'casual',
			title: 'Portrait Professionnel',
			subtitle: 'LinkedIn, CV & Profils en ligne',
			desc: 'Mettez en valeur votre image avec un portrait clair, moderne et optimisé pour le web.',
			badge: 'Réseaux & CV',
			icon: '✨',
			image: linkedin,
			rules: [
				'Sourire chaleureux et naturel fortement recommandé !',
				'Arrière-plan neutre, professionnel ou légèrement flouté',
				'Lumière douce mettant en valeur le visage',
				'Orientation légèrement de trois-quarts ou de face selon votre préférence',
				'Tenue professionnelle ou décontractée soignée'
			],
			gabaritClass: 'casual-gabarit',
			delay: 'Délai : Instantané'
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

	// +++++++++++++++++++++ essai zoom interactif sur l'image

	let currentZoom = $state(1); // 1 = normal, 1.3 = zoom léger (recommandé pour iPhone), 1.6 = fort zoom

// Fonction pour changer le zoom via les boutons UX
// On spécifie que zoomValue est un nombre

/**
 * @param {number} zoomValue
 */
function setZoom(zoomValue) {
    currentZoom = zoomValue;
    
    if (videoEl) {
      videoEl.style.transform = `scaleX(-1) scale(${currentZoom})`;
        videoEl.style.transformOrigin = 'center center';
    }
}

// +++++++++++++++++++++++++++++++++++

	// function capturePhoto() {
	// 	if (!videoEl) return;
		
	// 	const canvas = document.createElement('canvas');
	// 	// On garde un format 3:4 portrait idéal pour l'identité
	// 	const width = videoEl.videoWidth;
	// 	const height = videoEl.videoHeight;
		
	// 	canvas.width = 480;
	// 	canvas.height = 640; // Ratio 3:4 typique photo d'identité

	// 	const ctx = canvas.getContext('2d');
	// 	if (ctx) {
	// 		// Crop correspondant au viseur ovale (80% width, 68% height sur mobile)
	// 		// On prend un ratio cohérent pour que le résultat = ce que l'user voit
	// 		const isMobile = window.innerWidth <= 300;
	// 		const cropW = isMobile ? width * 0.99 : width * 0.99;
	// 		const cropH = isMobile ? height * 0.99 : height * 0.99;
	// 		// Trouver la dimension de crop pour remplir le canvas 480x640 (ratio 3:4)
	// 		// sans déformer l'image
	// 		const targetRatio = 3 / 4; // largeur / hauteur
	// 		const cropRatio = cropW / cropH;
	// 		let sourceW, sourceH;
	// 		if (cropRatio > targetRatio) {
	// 			// Zone source plus large que le canvas ratio → limiter par hauteur
	// 			sourceH = cropH;
	// 			sourceW = cropH * targetRatio;
	// 		} else {
	// 			// Zone source plus haute que le canvas ratio → limiter par largeur
	// 			sourceW = cropW;
	// 			sourceH = cropW / targetRatio;
	// 		}
	// 		const sourceX = (width - sourceW) / 2;
	// 		const sourceY = (height - sourceH) / 2;
	// 		ctx.drawImage(
	// 			videoEl,
	// 			sourceX, sourceY, sourceW, sourceH,
	// 			0, 0, 480, 640
	// 		);
	// 		capturedImage = canvas.toDataURL('image/jpeg', 0.95);
	// 	}

	// 	stopCamera();
	// 	isShutterActive = false;
	// 	step = 4;
	// }

// function capturePhoto() {
//     if (!videoEl) return;
    
//     const canvas = document.createElement('canvas');
//     const width = videoEl.videoWidth;
//     const height = videoEl.videoHeight;
    
//     // Canvas final aux normes d'export (Ratio 3:4)
//     canvas.width = 480;
//     canvas.height = 640; 

//     const ctx = canvas.getContext('2d');
//     if (ctx) {
//         // En photo d'identité, le visage doit occuper environ 70% à 80% de la hauteur du cadre
//         // On définit la zone capturée au centre du flux vidéo
        
//         const targetRatio = 3 / 4; // Ratio 0.75
        
//         // On prélève un cadre central représentant environ 75% du flux vidéo
//         // Cela force un léger recul visuel tout en gardant une excellente résolution
//         const cropFactor = 0.99; 
        
//         let sourceW, sourceH;
        
//         if ((width / height) > targetRatio) {
//             // Flux vidéo plus large que 3:4
//             sourceH = height * cropFactor;
//             sourceW = sourceH * targetRatio;
//         } else {
//             // Flux vidéo plus haut que 3:4
//             sourceW = width * cropFactor;
//             sourceH = sourceW / targetRatio;
//         }

//         // Centrage parfait du crop sur le flux
//         const sourceX = (width - sourceW) / 2;
//         const sourceY = (height - sourceH) / 2;

//         ctx.drawImage(
//             videoEl,
//             sourceX, sourceY, sourceW, sourceH, // Source
//             0, 0, 480, 640                      // Destination
//         );
        
//         capturedImage = canvas.toDataURL('image/jpeg', 0.95);
//     }

//     stopCamera();
//     isShutterActive = false;
//     step = 4;
// }

function capturePhoto() {
    if (!videoEl) return;
    
    const canvas = document.createElement('canvas');
    const width = videoEl.videoWidth;
    const height = videoEl.videoHeight;
    
    canvas.width = 480;
    canvas.height = 640; // Ratio 3:4

    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Appliquer un effet miroir sur le canvas pour correspondre à l'écran de shooting
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        const cropW = (width * 0.99) / currentZoom;
        const cropH = (height * 0.99) / currentZoom;

        const targetRatio = 3 / 4;
        const cropRatio = cropW / cropH;
        let sourceW, sourceH;

        if (cropRatio > targetRatio) {
            sourceH = cropH;
            sourceW = cropH * targetRatio;
        } else {
            sourceW = cropW;
            sourceH = cropW / targetRatio;
        }

        // Extraction centrée
        const sourceX = (width - sourceW) / 2;
        const sourceY = (height - sourceH) / 2;

        ctx.drawImage(
            videoEl,
            sourceX, sourceY, sourceW, sourceH, // Source zoomée
            0, 0, 480, 640                      // Canvas final (miroirisé via scale(-1, 1))
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
	let customBgColor = $state('#3b82f6'); // Couleur sur mesure par défaut (Bleu)

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
				case 'navy-blue': return 'background: #1e3a8a;';
				case 'emerald': return 'background: #064e3b;';
				case 'terracotta': return 'background: #9a3412;';
				case 'purple': return 'background: #581c87;';
				case 'custom': return `background: ${customBgColor};`;
				default: return '';
			}
		}
		return '';
	}

	async function processBackground() {
		if (!capturedImage) return;
		
		// Remonter immédiatement en haut pour afficher l'animation de chargement proprement
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
		
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
			
			// Attendre la mise à jour du DOM
			await tick();
			setTimeout(() => {
				if (typeof window !== 'undefined') {
					window.scrollTo({ top: 0, behavior: 'instant' });
				}
			}, 150);
		} catch (err) {
			console.error('Erreur détourage:', err);
			processingError = err instanceof Error ? err.message : 'Le détourage automatique a échoué. Veuillez réessayer.';
		} finally {
			isProcessing = false;
			// Forcer un scroll de sécurité après la fin du chargement
			setTimeout(() => {
				if (typeof window !== 'undefined') {
					window.scrollTo({ top: 0, behavior: 'instant' });
				}
			}, 50);
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
			localStorage.setItem('ididem_custom_bg_color', customBgColor);
			localStorage.setItem('ididem_user_email', userEmail);
			localStorage.setItem('ididem_booking_date', bookingDate);
			localStorage.setItem('ididem_booking_time', bookingTime);
			localStorage.setItem('ididem_client_session_id', clientSessionId);
			localStorage.setItem('ididem_delivery_requested', deliveryRequested ? 'true' : 'false');
			localStorage.setItem('ididem_delivery_name', deliveryName);
			localStorage.setItem('ididem_delivery_street', deliveryStreet);
			localStorage.setItem('ididem_delivery_zip', deliveryZip);
			localStorage.setItem('ididem_delivery_city', deliveryCity);

			const res = await fetch('/api/checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					formulaId: selectedFormula, 
					email: userEmail,
					clientSessionId: clientSessionId,
					delivery: deliveryRequested,
					address: deliveryRequested ? {
						name: deliveryName,
						street: deliveryStreet,
						zip: deliveryZip,
						city: deliveryCity
					} : null
				})
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
		localStorage.setItem('ididem_custom_bg_color', customBgColor);
		localStorage.setItem('ididem_user_email', userEmail);
		localStorage.setItem('ididem_booking_date', bookingDate);
		localStorage.setItem('ididem_booking_time', bookingTime);
		localStorage.setItem('ididem_client_session_id', clientSessionId);
		localStorage.setItem('ididem_delivery_requested', deliveryRequested ? 'true' : 'false');
		localStorage.setItem('ididem_delivery_name', deliveryName);
		localStorage.setItem('ididem_delivery_street', deliveryStreet);
		localStorage.setItem('ididem_delivery_zip', deliveryZip);
		localStorage.setItem('ididem_delivery_city', deliveryCity);
		window.location.href = `/photo/success?session_id=${clientSessionId}&delivery=${deliveryRequested ? 'true' : 'false'}`;
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
				<span class="step-num">1</span> <span class="indicator-step-text">Formule</span>
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!selectedFormula} class:active={step === 2} class:done={step > 2} onclick={() => goToStep(2)} disabled={!selectedFormula}>
				<span class="step-num">2</span> <span class="indicator-step-text">Consignes</span>
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!selectedFormula} class:active={step === 3} class:done={step > 3} onclick={() => goToStep(3)} disabled={!selectedFormula}>
				<span class="step-num">3</span> <span class="indicator-step-text">Prise de vue</span>
			</button>
			<div class="indicator-line"></div>
			<button class="indicator-step" class:clickable={!!capturedImage} class:active={step === 4} onclick={() => goToStep(4)} disabled={!capturedImage}>
				<span class="step-num">4</span> <span class="indicator-step-text">Finalisation</span>
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
							<div class="formula-delay-badge" class:orange-delay={formula.id === 'e-photo'}>
								⏱️ {formula.delay}
							</div>
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
					 <h2>Tutoriel</h2>
					<div class="booklet-header">
					
						<span class="booklet-badge">GUIDE DE RÉUSSITE BIOMÉTRIQUE</span>
						<span class="booklet-progress">{currentTutoPage + 1}/{tutorialSteps.length}</span>
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
							← 
						</button>
						
						<div class="page-dots">
							{#each tutorialSteps as _, i}
								<button class="dot" class:active={currentTutoPage === i} onclick={() => currentTutoPage = i} aria-label="Conseil {i + 1}" type="button"></button>
							{/each}
						</div>

						{#if currentTutoPage < tutorialSteps.length - 1}
							<button class="btn-booklet-next" onclick={() => currentTutoPage++}>
							 →
							</button>
						{:else}
							<button class="btn-booklet-start" onclick={startCamera}>
								Démarrer la caméra
							</button>
						{/if}
					</div>

					<div class="booklet-footer-links">
						<button class="btn-booklet-cancel" onclick={() => step = 1}>
							<span class="desktop-text">← Changer de formule</span>
							<span class="mobile-text">
								<!-- <span class="arrow">←</span> -->
								<span class="label">Changer de formule</span>
							</span>
						</button>
						<button class="btn-booklet-cancel primary" onclick={startCamera}>
							<span class="desktop-text">Passer le tuto →</span>
							<span class="mobile-text">
								<!-- <span class="arrow">→</span> -->
								<span class="label">Passer le tuto</span>
							</span>
						</button>
					</div>
				</div>
			</section>
		{/if}

		<!-- ============================================== -->
		<!-- ÉTAPE 3 : CAMÉRA ET GABARIT -->
		{#if step === 3}
			<section class="camera-section animate-fade-in">
				<div class="zoom-explanation-text">
					<p>💡 <strong>Conseil de Pro:</strong> Les trois boutons ci-dessous "grand-angle", "normal" et "zoom" vous permettent de zoomer et d'éviter l'effet "gros nez" (distorsion de l'objectif).</p>
				</div>
				<div class="camera-frame-wrapper">
					<!-- Boutons de contrôle du Zoom (Syntaxe Svelte 5) -->
					<div class="zoom-controls">
						<button 
							type="button" 
							class="zoom-btn" 
							class:active={currentZoom === 1} 
							onclick={() => setZoom(1)}
						>
							<span class="icon">👤</span> Grand-angle
						</button>
						
						<button 
							type="button" 
							class="zoom-btn" 
							class:active={currentZoom === 1.4} 
							onclick={() => setZoom(1.4)}
						>
							<span class="icon">✨</span> Normal
						</button>
						
						<button 
							type="button" 
							class="zoom-btn" 
							class:active={currentZoom === 1.8} 
							onclick={() => setZoom(1.8)}
						>
							<span class="icon">🔍</span> Zoom
						</button>
					</div>
					

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
									<div class="vertical-line"></div>
									<div class="face-oval">
										<div class="oval-limit-line limit-top animate-pulse">
											<span>Haut du front</span>
										</div>
										<div class="oval-limit-line limit-bottom animate-pulse">
											<span>Bas du menton</span>
										</div>
									</div>
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
							<ol>
								<li>Alignez votre visage dans l'ovale en pointillés entre les guides.</li>
								<li>Alignez vos yeux sur la ligne bleue.</li>
								<li>Fixez votre regard droit devant, comme si vous regardiez au loin l'horizon.</li>
							</ol>
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
						<div class="preview-column" style="display: flex; flex-direction: column; gap: 0.85rem; align-items: center; width: 100%; max-width: 380px; margin: 0 auto;">
							<div class="photo-preview-card"
								style={isProcessed ? getBgStyleForFormula(selectedFormula, selectedBgColor) : ''}
								style:margin="0"
							>
								<img src={capturedImage} alt="Cliché capturé" />
							</div>

							{#if processingError}
								<div class="status-error-badge" style="width: 100%; margin: 0;">
									<span>⚠️</span> {processingError}
								</div>
							{:else if isProcessed}
								<div class="status-success-badge" style="width: 100%; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.35rem; background: #e6fcf5; border: 1px solid #c3fae8; color: #0ca678; font-weight: 700; padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem;">
									<span style="font-size: 1.05rem;">✓</span> Fond supprimé & conforme
								</div>
							{/if}
						</div>

						<div class="result-info">

							{#if selectedFormula === 'casual' && isProcessed}
								<div class="background-selector">
									<h4>Couleur de fond du profil :</h4>
									<div class="color-options">
										<button class="color-btn bg-white" class:active={selectedBgColor === 'white'} onclick={() => selectedBgColor = 'white'} aria-label="Blanc" title="Blanc"></button>
										<button class="color-btn bg-light-gray" class:active={selectedBgColor === 'light-gray'} onclick={() => selectedBgColor = 'light-gray'} aria-label="Gris clair" title="Gris clair"></button>
										<button class="color-btn bg-dark-gray" class:active={selectedBgColor === 'dark-gray'} onclick={() => selectedBgColor = 'dark-gray'} aria-label="Gris foncé" title="Gris foncé"></button>
										<button class="color-btn bg-blue-grad" class:active={selectedBgColor === 'blue-grad'} onclick={() => selectedBgColor = 'blue-grad'} aria-label="Bleu dégradé" title="Bleu dégradé"></button>
										<button class="color-btn bg-navy-blue" class:active={selectedBgColor === 'navy-blue'} onclick={() => selectedBgColor = 'navy-blue'} aria-label="Bleu marine" title="Bleu marine"></button>
										<button class="color-btn bg-emerald" class:active={selectedBgColor === 'emerald'} onclick={() => selectedBgColor = 'emerald'} aria-label="Vert émeraude" title="Vert émeraude"></button>
										<button class="color-btn bg-terracotta" class:active={selectedBgColor === 'terracotta'} onclick={() => selectedBgColor = 'terracotta'} aria-label="Terracotta" title="Terracotta"></button>
										<button class="color-btn bg-purple" class:active={selectedBgColor === 'purple'} onclick={() => selectedBgColor = 'purple'} aria-label="Violet" title="Violet"></button>
										
										<!-- Bouton pipette couleur sur mesure -->
										<div class="color-btn custom-picker-btn" class:active={selectedBgColor === 'custom'} style="background: {selectedBgColor === 'custom' ? customBgColor : '#e2e8f0'}">
											<input type="color" bind:value={customBgColor} oninput={() => selectedBgColor = 'custom'} aria-label="Choisir une couleur" />
											<span class="picker-emoji">🎨</span>
										</div>
									</div>
								</div>
							{/if}

							{#if selectedFormula === 'officielle' && isProcessed}
								<div class="background-selector">
									<h4>Pays / Norme du fond :</h4>
									<div class="destination-options">
										<button class="dest-btn animate-fade-in" class:active={selectedBgColor === 'light-gray'} onclick={() => selectedBgColor = 'light-gray'}>
											<span class="icon">🇫🇷</span>
											 France (Gris)
										</button>
										<button class="dest-btn animate-fade-in" class:active={selectedBgColor === 'white'} onclick={() => selectedBgColor = 'white'}>
											<span class="icon">🇲🇦 🇩🇿 🇹🇳</span>
											 Maghreb (Blanc)
										</button>
									</div>
								</div>
							{/if}

							{#if isProcessed}
								<div class="steps-container" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; text-align: left; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
									<h3 style="font-size: 1.05rem; font-weight: 800; color: var(--blue-900); margin: 0 0 1rem 0;">Prochaines étapes :</h3>
									<ul class="steps-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem;">
										{#if selectedFormula === 'e-photo'}
											<!-- Étapes e-Photo -->
											<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
												<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">1</span>
												<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
													<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Contact & Signature</strong>
													<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Saisie de vos coordonnées et signature en ligne pour valider votre planche.</span>
												</div>
											</li>
											<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
												<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">2</span>
												<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
													<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Empreinte bancaire sécurisée</strong>
													<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Aucun débit immédiat. Facturé uniquement après validation de votre photo.</span>
												</div>
											</li>
											<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
												<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">3</span>
												<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
													<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Envoi & Livraison</strong>
													<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Envoi par e-mail sous 12h max après validation. Livraison postale sous 24h (si option choisie).</span>
												</div>
											</li>
										{:else}
											<!-- Étapes Photo standard / Portrait pro -->
											{#if deliveryRequested}
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">1</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Contact & Adresse</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Saisie de votre e-mail et de votre adresse de livraison.</span>
													</div>
												</li>
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">2</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Paiement sécurisé</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Règlement sécurisé par carte bancaire.</span>
													</div>
												</li>
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">3</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Téléchargement & Expédition</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Téléchargement numérique immédiat et expédition postale sous 24h.</span>
													</div>
												</li>
											{:else}
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">1</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Paiement sécurisé</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Règlement sécurisé par carte bancaire.</span>
													</div>
												</li>
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">2</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Téléchargement & Partage</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Accédez immédiatement à vos photos numériques HD et partagez-les après le paiement.</span>
													</div>
												</li>
												<li class="animate-fade-in" style="display: flex; gap: 0.85rem; align-items: flex-start; text-align: left;">
													<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem;">3</span>
													<div class="step-text" style="display: flex; flex-direction: column; gap: 0.15rem;">
														<strong style="font-size: 0.9rem; color: var(--gray-800); font-weight: 700;">Obtention instantanée</strong>
														<span style="font-size: 0.8rem; color: var(--gray-600); line-height: 1.4;">Aucun délai d'attente, vos fichiers HD sont exploitables immédiatement.</span>
													</div>
												</li>
											{/if}
										{/if}
									</ul>
								</div>
							{:else}
								<div class="compliance-checklist" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: left; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
									<h3 style="font-size: 1rem; font-weight: 800; color: var(--blue-900); margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
										<span style="color: #3b82f6; font-size: 1.1rem; line-height: 1;">✓</span> Auto-contrôle obligatoire
									</h3>
									<p style="font-size: 0.85rem; color: var(--gray-600); margin: 0 0 1.25rem 0; line-height: 1.5;">
										Avant de valider votre cliché, veuillez vérifier les points de conformité officiels suivants :
									</p>
									<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem;">
										<li style="display: flex; gap: 0.75rem; font-size: 0.85rem; color: var(--gray-700); line-height: 1.45; align-items: flex-start;">
											<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e6fcf5; border: 1px solid #c3fae8; color: #0ca678; flex-shrink: 0; margin-top: 0.1rem;">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 13px; height: 13px;">
													<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
													<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</svg>
											</span>
											<span><strong>Yeux & Regard :</strong> Yeux ouverts, regard de face.</span>
										</li>
										<li style="display: flex; gap: 0.75rem; font-size: 0.85rem; color: var(--gray-700); line-height: 1.45; align-items: flex-start;">
											<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e6fcf5; border: 1px solid #c3fae8; color: #0ca678; flex-shrink: 0; margin-top: 0.1rem;">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 13px; height: 13px;">
													<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
												</svg>
											</span>
											<span><strong>Visage & Coiffure :</strong> Bouche fermée, oreilles bien dégagées et cheveux attachés.</span>
										</li>
										<li style="display: flex; gap: 0.75rem; font-size: 0.85rem; color: var(--gray-700); line-height: 1.45; align-items: flex-start;">
											<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e6fcf5; border: 1px solid #c3fae8; color: #0ca678; flex-shrink: 0; margin-top: 0.1rem;">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 13px; height: 13px;">
													<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5m0 15V21m-9-9h1.5m15 0H21m-3.9-3.9 1.06-1.06M6.34 17.66l-1.06 1.06m12.38 0 1.06-1.06M6.34 6.34l-1.06-1.06M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
												</svg>
											</span>
											<span><strong>Absence d'ombres :</strong> Aucun ombrage sur le nez (dessous et côtés), ni sous le menton ou sur le cou.</span>
										</li>
									</ul>
								</div>
							{/if}



							{#if isProcessed}
								<!-- Option Envoi Postal Premium -->
								<div class="reassurance-card" style="text-align: left; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02); display: flex; flex-direction: column; gap: 1rem;">
									<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 0.5rem; flex-wrap: wrap;">
										<span style="font-weight: 800; font-size: 1.15rem; color: #1d1d1f;">Option Envoi Postal</span>
										<span style="background: #e6fcf5; color: #0ca678; border: 1px solid #c3fae8; font-size: 0.65rem; font-weight: 800; padding: 0.35rem 0.8rem; border-radius: 12px; display: inline-block; text-align: center; line-height: 1.3;">🌱 zéro déplacement<br />100% éco</span>
									</div>

									<label style="display: flex; align-items: flex-start; gap: 0.75rem; font-weight: 700; color: #27272a; cursor: pointer; font-size: 0.9rem; margin: 0; text-align: left;">
										<input type="checkbox" bind:checked={deliveryRequested} style="width: 1.25rem; height: 1.25rem; accent-color: var(--blue-600); cursor: pointer; flex-shrink: 0; margin-top: 0.1rem;" />
										<span style="line-height: 1.45;">Je choisis de recevoir ma planche de photos directement à mon domicile par voie postale (+3,00 €)</span>
									</label>

									{#if deliveryRequested}
										<div class="delivery-address-form" style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px dashed var(--gray-200); display: flex; flex-direction: column; gap: 1rem;">
											<h4 style="font-size: 0.95rem; font-weight: 700; color: var(--blue-700); margin: 0;">Adresse de livraison</h4>
											
											<div style="display: flex; flex-direction: column; gap: 0.4rem;">
												<label for="delivery-email" style="font-size: 0.85rem; font-weight: 600; color: var(--gray-600);">Votre adresse e-mail (pour la confirmation) :</label>
												<input type="email" id="delivery-email" bind:value={userEmail} placeholder="Ex: jean.dupont@email.com" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 0.9rem;" />
											</div>

											<div style="display: flex; flex-direction: column; gap: 0.4rem;">
												<label for="delivery-name" style="font-size: 0.85rem; font-weight: 600; color: var(--gray-600);">Nom complet du destinataire :</label>
												<input type="text" id="delivery-name" bind:value={deliveryName} placeholder="Ex: Jean Dupont" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 0.9rem;" />
											</div>

											<div style="display: flex; flex-direction: column; gap: 0.4rem;">
												<label for="delivery-street" style="font-size: 0.85rem; font-weight: 600; color: var(--gray-600);">Adresse postale (Rue, appartement, boîte...) :</label>
												<input type="text" id="delivery-street" bind:value={deliveryStreet} placeholder="Ex: 12 Rue de la Paix" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 0.9rem;" />
											</div>

											<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.75rem;">
												<div style="display: flex; flex-direction: column; gap: 0.4rem;">
													<label for="delivery-zip" style="font-size: 0.85rem; font-weight: 600; color: var(--gray-600);">Code postal :</label>
													<input type="text" id="delivery-zip" bind:value={deliveryZip} placeholder="Ex: 75001" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 0.9rem;" />
												</div>
												<div style="display: flex; flex-direction: column; gap: 0.4rem;">
													<label for="delivery-city" style="font-size: 0.85rem; font-weight: 600; color: var(--gray-600);">Ville :</label>
													<input type="text" id="delivery-city" bind:value={deliveryCity} placeholder="Ex: Paris" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 0.9rem;" />
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/if}

							<div class="result-actions">
								<button class="btn-retake" disabled={isRedirecting} onclick={restart}>Recommencer</button>
								{#if isProcessed}
									<button class="btn-confirm-photo" disabled={isRedirecting || (deliveryRequested && (!userEmail || !deliveryName || !deliveryStreet || !deliveryZip || !deliveryCity))} onclick={handlePayment}>
										{#if isRedirecting}
											<span>Redirection...</span>
										{:else}
											<span style="display: block; font-size: 1.15rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Payer</span>
											<span style="display: block; font-size: 0.85rem; font-weight: 500; opacity: 0.9; margin-top: 0.15rem;">Montant : {selectedFormula === 'e-photo' ? (deliveryRequested ? '9,99' : '6,99') : selectedFormula === 'officielle' ? (deliveryRequested ? '7,99' : '4,99') : (deliveryRequested ? '5,99' : '2,99')} €</span>
										{/if}
									</button>
								{:else}
									<button class="btn-confirm-photo" onclick={processBackground}>
										Finaliser ma photo
									</button>
								{/if}
							</div>


							{#if isProcessed}
								<div class="dev-actions">
									<button class="btn-dev-simulate" onclick={simulatePaymentSuccess}>
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
.zoom-controls {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 4px 6px;
  border-radius: 24px;
  z-index: 10;
  width: max-content;
  max-width: calc(100% - 20px);
  box-sizing: border-box;
}
.zoom-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

@media (max-width: 360px) {
  .zoom-controls {
    gap: 2px;
    padding: 3px 4px;
  }
  .zoom-btn {
    font-size: 10px;
    padding: 4px 8px;
  }
}

.zoom-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: #ffffff;
  color: #ffffff;
  font-weight: 600;
}
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
		flex-wrap: wrap; /* S'adapte sur plusieurs lignes si besoin */
		max-width: 320px;
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
		flex-direction: column;
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


	.step-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.step-text strong {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--blue-900);
	}

	.step-text span {
		font-size: 0.85rem;
		color: var(--gray-500);
		line-height: 1.35;
	}

	.color-btn.bg-dark-gray { background: #334155; }
	.color-btn.bg-blue-grad { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }
	.color-btn.bg-navy-blue { background: #1e3a8a; }
	.color-btn.bg-emerald { background: #064e3b; }
	.color-btn.bg-terracotta { background: #9a3412; }
	.color-btn.bg-purple { background: #581c87; }

	.custom-picker-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 2px dashed var(--gray-400) !important;
		box-shadow: 0 0 0 1px var(--gray-200);
		transition: var(--transition-fast);
	}

	.custom-picker-btn input[type="color"] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.picker-emoji {
		font-size: 0.85rem;
		pointer-events: none;
	}

	.email-collection-box {
		margin: 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
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

	.formula-delay-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8rem;
		font-weight: 750;
		color: #0ca678;
		background: #e6fcf5;
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		margin: 0.5rem 0;
		align-self: center;
		border: 1px solid #c3fae8;
	}

	.formula-delay-badge.orange-delay {
		color: #e67700;
		background: #fff4e6;
		border-color: #ffd8a8;
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
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--white);
		background: #ff7a00;
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-md);
		box-shadow: 0 4px 10px rgba(255, 122, 0, 0.2);
		transition: all 0.2s ease;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
	}

	.formula-card:hover .action-arrow {
		background: #ea580c;
		box-shadow: 0 6px 15px rgba(234, 88, 12, 0.35);
		transform: scale(1.02);
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
		justify-content: space-around;
		align-items: center;
		font-size: 0.85rem;
		font-weight: 700;
		gap: 20px;
	}

	.booklet-badge {
		color: var(--blue-600);
		background: #eff6ff;
		padding: 0.45rem 1rem;
		border-radius: var(--radius-full);
	}

	.booklet-progress {
		color: var(--gray-500);
		font-size: 10px;
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
		height: 5px;
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
		width: 100%;
		max-width: 340px;
		height: 340px;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--gray-900);
		border: 1px solid var(--gray-200);
		margin: 0 auto;
		box-shadow: var(--shadow-sm);
		border: 5px rgb(232, 232, 232) solid;
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
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--gray-800);
	}

	.booklet-content p {
		font-size: 1rem;
		color: var(--gray-600);
		line-height: 1.55;
	}

	.booklet-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 3px solid var(--gray-100);
		padding-top: 1.5rem;
	}

	.btn-booklet-prev {
		background: #f1f5f9;
		color: #475569;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		font-weight: 700;
		font-size: 1.3rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #cbd5e1;
		transition: var(--transition-fast);
	}

	.btn-booklet-prev:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: #f8fafc;
		border-color: #e2e8f0;
		color: #94a3b8;
	}

	.btn-booklet-prev:hover:not(:disabled) {
		background: #e2e8f0;
		transform: scale(1.05);
	}

	.btn-booklet-next {
		background: var(--blue-600);
		color: var(--white);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		font-weight: 700;
		font-size: 1.3rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		transition: var(--transition-fast);
	}

	.btn-booklet-next:hover {
		background: var(--blue-700);
		transform: scale(1.05);
	}

	.btn-booklet-start {
		background: var(--gradient-cta);
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: var(--transition-fast);
		box-shadow: 0 4px 10px rgba(25, 118, 210, 0.2);
		border: none;
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
		color: var(--gray-400); /* Plus discret */
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition-fast);
		border: 1px solid rgb(198, 198, 198);
		border-radius: var(--radius-md);
		padding: 0.9rem 2rem;
	}

	.btn-booklet-cancel:hover {
		color: var(--blue-600);
	}

	.btn-booklet-cancel.primary {
		background: #ff7a00;
		color: var(--white);
		border-color: #ff7a00;
	}

	.btn-booklet-cancel.primary:hover {
		background: #ea580c;
		color: var(--white);
		border-color: #ea580c;
	}

	.booklet-footer-links {
		display: flex;
		justify-content: center;
		gap: 2rem;
		align-items: center;
		width: 100%;
		border-top: 1px dashed var(--gray-200); /* Séparateur discret */
		padding-top: 1rem;
		margin-top: 0.25rem;
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

	

	.rule-text {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--gray-700);
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
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.95rem;
		transition: var(--transition-fast);
	}

	.btn-back:hover {
		background: var(--gray-200);
	}

	.btn-start {
		background: var(--blue-700);
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 600;
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.zoom-explanation-text {
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
		text-align: center;
		color: #1e3a8a;
		font-size: 0.85rem;
		line-height: 1.4;
		max-width: 580px;
		width: 100%;
		box-sizing: border-box;
	}

	.camera-frame-wrapper {
		position: relative;
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
		position: relative; /* Nécessaire pour positionner les lignes repères */
	}

	.oval-limit-line {
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		background: rgba(57, 255, 20, 0.6); /* Vert fluo transparent */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.oval-limit-line span {
		position: absolute;
		background: #39FF14;
		color: #000000;
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		white-space: nowrap;
		box-shadow: var(--shadow-sm);
	}

	.limit-top {
		top: 0%;
	}

	.limit-bottom {
		top: 100%;
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

	.vertical-line {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: rgba(0, 229, 255, 0.5); /* Cyan translucide comme URFace */
		transform: translateX(-50%);
		z-index: 1;
	}

	.eyes-line {
		position: absolute;
		width: 100%;
		height: 100px;
		background: rgba(0, 145, 255, 0.5); /* Bleu opacité 0.5 solid */
		top: 40%;
		transform: translateY(-50%);
		z-index: 2;
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
		line-height: 1.4;
	}

	.instructions-live ol {
		display: inline-block;
		text-align: left;
		padding-left: 1.5rem;
		margin: 0.5rem 0 0 0;
		list-style-type: decimal !important; /* Force l'affichage des numéros */
	}

	.instructions-live li {
		margin-bottom: 0.4rem;
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
	/* 1. Définir le ratio cible (Largeur / Hauteur = 3/4 = 0.75) */
    aspect-ratio: 3 / 4;
    
    /* 2. Largeur responsive fluide */
    width: 100%;
    
    /* 3. Limite maximale basée sur la largeur */
    max-width: 320px; 
    
    /* 4. Limite maximale basée sur la hauteur de l'écran 
          (320px * 0.75 = 240px de largeur max si la hauteur atteint 65vh) */
    max-height: 65vh;

    /* 5. Empêcher l'étirement si max-height est atteint */
    height: auto;
    object-fit: contain;

    /* Vos styles visuels */
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
		padding: 0.8rem 1.25rem;
		border-radius: var(--radius-sm);
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		font-size: 0.7rem;
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

	.result-info li:not(.compliance-checklist li) {
		position: relative;
		padding-left: 1.5rem;
	}

	.result-info li:not(.compliance-checklist li)::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--blue-500);
		font-size: 1.5rem;
		line-height: 1;
	}

	.result-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		overflow: hidden;
	}

	.btn-retake {
		flex: 1;
		min-width: 0;
		height: 58px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f1f5f9;
		color: #475569;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.2s;
		text-align: center;
		border: 1px solid #cbd5e1;
		cursor: pointer;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.btn-retake:hover {
		background: #e2e8f0;
	}

	.btn-confirm-photo {
		flex: 2;
		min-width: 0;
		height: 58px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #ff7a00;
		color: var(--white);
		border-radius: var(--radius-md);
		font-weight: 600;
		transition: all 0.2s;
		box-shadow: 0 4px 14px rgba(255, 122, 0, 0.3);
		text-align: center;
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.btn-confirm-photo:hover:not(:disabled) {
		background: #ea580c;
		transform: translateY(-1px);
		box-shadow: 0 6px 18px rgba(255, 122, 0, 0.4);
	}


	/* --- Responsive --- */
	@media (max-width: 768px) {
		.photo-capture-page {
			min-height: auto !important;
			padding: 1.5rem 0 !important;
		}
		.page-dots {
		
		display: none;
	}
		.formula-grid {
			grid-template-columns: 1fr;
		}

		.steps-indicator {
			padding: 1rem;
			gap: 0.5rem;
		}

		.page-header {
			display: none;
		}

		.steps-indicator {
			display: none;
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

	.mobile-text {
		display: none;
	}

	@media (max-width: 500px) {
		.desktop-text {
			display: none;
		}
		.mobile-text {
			display: inline;
			background: none;
			border: none;
			padding: 0;
			min-width: 0;
			color: inherit;
		}
		
		.mobile-text .label {
			font-size: inherit;
			font-weight: inherit;
			color: inherit;
		}
		.indicator-step-text {
			display: none;
		}
		.indicator-line {
			margin: 0 0.5rem;
		}
		.booklet-image-container {
			height: 260px;
			width: 230px;
		}
		.booklet-footer {
			flex-direction: row;
			gap: 1.25rem;
			align-items: center;
		}
		.booklet-footer-links {
			display: flex;
			flex-direction: column !important;
			align-items: center !important;
			width: 100% !important;
			border-top: 1px dashed var(--gray-200) !important;
			margin-top: 0.5rem !important;
			gap: 0.5rem !important;
			padding-top: 0.75rem !important;
		}
		.btn-booklet-cancel {
			background: none;
			border: 1px solid rgb(198, 198, 198);
			color: var(--gray-500);
			font-size: 0.95rem;
			font-weight: 600;
			cursor: pointer;
			transition: var(--transition-fast);
			padding: 0.9rem 2rem !important;
			border-radius: var(--radius-md) !important;
			width: 100% !important;
			max-width: 300px !important;
			box-sizing: border-box !important;
			margin: 0 !important;
			text-align: center !important;
		}

	.btn-booklet-cancel:hover {
		color: var(--blue-600);
	}

	.btn-booklet-cancel.primary {
		background: #ff7a00 !important;
		color: var(--white) !important;
		border-color: #ff7a00 !important;
	}
	.btn-booklet-cancel.primary * {
		color: var(--white) !important;
	}

		.btn-booklet-prev, .btn-booklet-next {
			max-width: 50%;
			text-align: center;
			box-sizing: border-box;
		}
		.btn-booklet-start {
			max-width: none;
			flex-grow: 1;
			text-align: center;
			white-space: nowrap;
			box-sizing: border-box;
		}
		.page-dots {
			order: -1;
		}
		.video-container {
			height: auto;
			width: 100%;
			max-width: 280px;
			aspect-ratio: 3/4;
		}
		.official-gabarit .face-oval {
			width: 80%;
			height: 68%;
			border-radius: 50% / 40%;
		}
		.casual-gabarit .face-oval {
			width: 60%;
			height: 55%;
			border-radius: 50% / 40%;
		}
		.camera-controls {
			gap: 10px;
			justify-content: space-around;
			padding: 0;
		}
		.btn-capture-now {
			padding: 0.5rem 0.75rem;
			font-size: 0.8rem;
		}
		.btn-abort {
			font-size: 0.85rem;
		}
		/* .photo-preview-card {
			max-width: 280px;
		} */
		.result-actions {
			flex-direction: column;
			gap: 0.75rem;
		}
		.btn-retake,
		.btn-confirm-photo {
			width: 100%;
			flex: none;
		}
		.shutter-button {
			width: 60px;
			height: 60px;
			border-width: 3px;
		}
		.inner-circle {
			width: 44px;
			height: 44px;
		}
		.dest-btn {
			flex-direction: column;
			gap: 0.3rem;
			padding: 0.65rem 0.5rem;
			font-size: 0.75rem;
			line-height: 1.2;
		}
	}

	/* --- Reassurance card styles --- */
	.reassurance-card {
		background: #f8fafc;
		border: 1px solid var(--gray-200);
		border-left: 4px solid var(--blue-600);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		margin-top: 1rem;
		text-align: left;
	}

	.reassurance-card h4 {
		margin: 0 0 0.5rem 0;
		color: var(--blue-700);
		font-size: 1rem;
		font-weight: 800;
	}

	.reassurance-text {
		font-size: 0.85rem;
		color: var(--gray-600);
		line-height: 1.5;
		margin: 0 0 1rem 0;
	}

	.steps-indicator-mini {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--white);
		padding: 0.75rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--gray-100);
	}

	.step-indicator-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.8rem;
		color: var(--gray-700);
	}

	.step-dot {
		background: var(--blue-50);
		color: var(--blue-700);
		font-weight: 800;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		flex-shrink: 0;
	}

	.legal-assurance-card {
		background: rgba(37, 99, 235, 0.05);
		border: 1px solid rgba(37, 99, 235, 0.15);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		margin: 1.25rem 0;
		text-align: left;
	}

	/* .legal-assurance-card h5 {
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
	} */

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

	/* .p-step .badge {
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
	} */

	.p-step-content {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	/* .p-step-content strong {
		font-size: 0.85rem;
		color: var(--gray-800);
	} */

	.p-step-content span {
		font-size: 0.78rem;
		color: var(--gray-600);
	}
		.booklet-badge {
		color: var(--blue-600);
		background: #eff6ff;
		padding: 0.45rem 1rem;
		border-radius: var(--radius-full);
		font-size: 0.6rem;
	}

</style>
