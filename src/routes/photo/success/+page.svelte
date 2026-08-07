<!-- src/routes/photo/success/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let sessionId = $state('1234');

	let capturedImage = $state('');
	let formulaId = $state('');
	let selectedBg = $state('');
	let userEmail = $state('');
	let userPhone = $state('');
	
	// Option de livraison postale
	let deliveryRequested = $state(false);
	let deliveryName = $state('');
	let deliveryStreet = $state('');
	let deliveryZip = $state('');
	let deliveryCity = $state('');
	
	/** @type {HTMLCanvasElement | null} */
	let canvas = $state(null);
	let generatedImageUri = $state('');

	// Variables pour la prise de rendez-vous e-photo
	let bookingDate = $state('');
	let bookingTime = $state('');
	let copied = $state(false);

	function copySignatureLink() {
		const origin = window.location.origin;
		const link = `${origin}/signer/${sessionId}`;
		navigator.clipboard.writeText(link).then(() => {
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		});
	}

	let isAdminOnline = $state(false);
	/** @type {WebSocket | null} */
	let presenceSocket = null;

	function initPresenceSocket() {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
			? `${protocol}//${window.location.hostname}:5001`
			: 'wss://ididemwebapp.onrender.com';
		
		presenceSocket = new WebSocket(wsUrl);
		presenceSocket.onopen = () => {
			if (presenceSocket) {
				presenceSocket.send(JSON.stringify({ type: 'check-admin-presence' }));
			}
		};
		presenceSocket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'admin-presence-response') {
					isAdminOnline = !!data.online;
				}
			} catch (e) {
				console.error(e);
			}
		};
		presenceSocket.onerror = (err) => {
			console.error('Erreur websocket présence:', err);
		};
	}

	let isAppointmentBooked = $state(false);

	/** @type {Array<{label: string, value: string}>} */
	const nextDays = [];
	const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
	const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

	// Générer les 5 prochains jours dynamiquement
	for (let i = 0; i < 5; i++) {
		const d = new Date();
		d.setDate(d.getDate() + i);
		const dayName = daysOfWeek[d.getDay()];
		const dateNum = d.getDate();
		const monthName = months[d.getMonth()];
		
		let label = `${dayName} ${dateNum} ${monthName}`;
		if (i === 0) label += " (Aujourd'hui)";
		else if (i === 1) label += " (Demain)";

		nextDays.push({
			label,
			value: `${dayName} ${dateNum} ${monthName}`
		});
	}

	const timeSlots = [
		'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
		'14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
	];

	async function confirmBooking() {
		if (bookingDate && bookingTime && userEmail && userPhone) {
			try {
				const response = await fetch('/api/book-appointment', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: userEmail,
						phone: userPhone,
						date: bookingDate,
						time: bookingTime,
						sessionId: sessionId,
						delivery: deliveryRequested,
						address: deliveryRequested ? {
							name: deliveryName,
							street: deliveryStreet,
							zip: deliveryZip,
							city: deliveryCity
						} : null
					})
				});
				if (!response.ok) {
					console.error('Failed to register booking in Google Sheets');
				}
			} catch (e) {
				console.error('Error confirming booking:', e);
			}

			isAppointmentBooked = true;
			localStorage.setItem('ididem_booking_date', bookingDate);
			localStorage.setItem('ididem_booking_time', bookingTime);
			localStorage.setItem('ididem_booking_phone', userPhone);
			localStorage.setItem('ididem_user_email', userEmail);
			localStorage.setItem('ididem_is_appointment_booked', 'true');
		}
	}

	onMount(() => {
		sessionId = page.url.searchParams.get('session_id') || localStorage.getItem('ididem_client_session_id') || '1234';
		capturedImage = localStorage.getItem('ididem_captured_image') || '';
		formulaId = localStorage.getItem('ididem_selected_formula') || '';
		selectedBg = localStorage.getItem('ididem_selected_bg') || '';
		userEmail = localStorage.getItem('ididem_user_email') || '';
		userPhone = localStorage.getItem('ididem_booking_phone') || '';
		bookingDate = localStorage.getItem('ididem_booking_date') || '';
		bookingTime = localStorage.getItem('ididem_booking_time') || '';
		isAppointmentBooked = localStorage.getItem('ididem_is_appointment_booked') === 'true';
		deliveryRequested = page.url.searchParams.get('delivery') === 'true' || localStorage.getItem('ididem_delivery_requested') === 'true';
		deliveryName = localStorage.getItem('ididem_delivery_name') || '';
		deliveryStreet = localStorage.getItem('ididem_delivery_street') || '';
		deliveryZip = localStorage.getItem('ididem_delivery_zip') || '';
		deliveryCity = localStorage.getItem('ididem_delivery_city') || '';

		initPresenceSocket();

		if (capturedImage) {
			if (formulaId === 'officielle' || formulaId === 'e-photo') {
				generatePlanche();
			} else if (formulaId === 'casual') {
				generateCasualPhoto();
			}
		}

		return () => {
			if (presenceSocket) presenceSocket.close();
		};
	});

	/**
	 * @param {string} imageUri
	 */
	function sendDeliveryAlertWithImage(imageUri) {
		if (deliveryRequested && formulaId !== 'e-photo') {
			fetch('/api/send-delivery-alert', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: userEmail,
					sessionId: sessionId,
					formulaId: formulaId,
					delivery: true,
					photoData: imageUri, // Passer l'image Base64 de la planche
					address: {
						name: deliveryName,
						street: deliveryStreet,
						zip: deliveryZip,
						city: deliveryCity
					}
				})
			}).then(res => {
				if (!res.ok) console.error('Erreur lors de la notification de livraison.');
			}).catch(err => console.error('Erreur réseau de notification de livraison:', err));
		}
	}

	function generatePlanche() {
		const localCanvas = canvas;
		if (!localCanvas || !capturedImage) return;
		const ctx = localCanvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.onload = () => {
			// Dimensions 10x15cm à 300 DPI = 1800 x 1200 px (paysage)
			localCanvas.width = 1800;
			localCanvas.height = 1200;

			// Fond blanc
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);

			// Taille d'une photo d'identité (3.5cm x 4.5cm => 420 x 540 px)
			const photoW = 420;
			const photoH = 540;

			// Grille 3x2
			// Marges et espacements calculés
			const gapX = 135;
			const gapY = 40;

			for (let row = 0; row < 2; row++) {
				for (let col = 0; col < 3; col++) {
					const x = gapX + col * (photoW + gapX);
					const y = gapY + row * (photoH + gapY);

					// Appliquer le fond réglementaire sous le détourage pour e-photo et officielle
					if (formulaId === 'e-photo') {
						ctx.fillStyle = '#e2e8f0'; // Gris clair réglementaire ANTS
						ctx.fillRect(x, y, photoW, photoH);
					} else if (formulaId === 'officielle') {
						ctx.fillStyle = selectedBg === 'white' ? '#ffffff' : '#d1d5db'; // Blanc ou Gris standard
						ctx.fillRect(x, y, photoW, photoH);
					}

					// Dessiner la photo
					ctx.drawImage(img, x, y, photoW, photoH);

					// Trait de coupe léger autour de chaque photo
					ctx.strokeStyle = '#cbd5e1';
					ctx.lineWidth = 1;
					ctx.strokeRect(x, y, photoW, photoH);
				}
			}

			// Convertir le canvas en URL de téléchargement
			generatedImageUri = localCanvas.toDataURL('image/jpeg', 0.95);
			sendDeliveryAlertWithImage(generatedImageUri);
		};
		img.src = capturedImage;
	}

	function generateCasualPhoto() {
		const localCanvas = canvas;
		if (!localCanvas || !capturedImage) return;
		const ctx = localCanvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.onload = () => {
			localCanvas.width = 600;
			localCanvas.height = 800;

			// Appliquer la couleur de fond choisie par l'utilisateur
			if (selectedBg === 'white') {
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);
			} else if (selectedBg === 'light-gray') {
				ctx.fillStyle = '#f1f5f9';
				ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);
			} else if (selectedBg === 'dark-gray') {
				ctx.fillStyle = '#334155';
				ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);
			} else if (selectedBg === 'blue-grad') {
				const grad = ctx.createLinearGradient(0, 0, 0, localCanvas.height);
				grad.addColorStop(0, '#e0f2fe');
				grad.addColorStop(1, '#bae6fd');
				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);
			}

			// Dessiner le portrait détouré
			ctx.drawImage(img, 0, 0, localCanvas.width, localCanvas.height);

			// Convertir en URL de téléchargement
			generatedImageUri = localCanvas.toDataURL('image/jpeg', 0.95);
			sendDeliveryAlertWithImage(generatedImageUri);
		};
		img.src = capturedImage;
	}

	function downloadPhoto() {
		if (!generatedImageUri) return;
		const link = document.createElement('a');
		link.href = generatedImageUri;
		link.download = formulaId === 'casual' ? 'portrait_professionnel.jpg' : 'planche_identite_ididem.jpg';
		link.click();
	}

	async function sharePhoto() {
		if (!generatedImageUri) return;
		try {
			// Convert base64 to File object for sharing API
			const response = await fetch(generatedImageUri);
			const blob = await response.blob();
			const file = new File([blob], 'photo_ididem.jpg', { type: 'image/jpeg' });

			if (navigator.canShare && navigator.canShare({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: 'Ma photo IDidem',
					text: 'Voici ma photo conforme créée avec IDidem.'
				});
			} else {
				alert('Le partage de fichiers n\'est pas supporté par votre navigateur. Vous pouvez télécharger l\'image directement.');
			}
		} catch (err) {
			console.error('Erreur lors du partage:', err);
		}
	}
</script>

<svelte:head>
	<title>Confirmation de Commande - IDidem</title>
</svelte:head>

<main class="success-page">
	<div class="container success-container">
		<div class="success-card text-center animate-fade-in-up">
			
			<div class="success-icon-wrapper">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="success-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			</div>
			
			<h1>Paiement validé !</h1>
			<p class="subtitle">
				{#if deliveryRequested}
					Votre commande a été traitée avec succès. Vos photos vont vous être envoyées par courrier postal.
				{:else}
					Votre commande a été traitée avec succès.
				{/if}
			</p>

			<!-- Canvas masqué pour générer l'image assemblée -->
			<canvas bind:this={canvas} style="display: none;"></canvas>

			<!-- CAS 1 : e-Photo avec processus de Signature et rendez-vous en ligne -->
			{#if formulaId === 'e-photo'}
				<div class="product-success-box e-photo-box">
					<h2>Signature & Validation en ligne</h2>
					
					{#if isAdminOnline}
						<div class="success-booking-alert instant-alert">
							<p>⚡ <strong>Un photographe est disponible en direct !</strong></p>
							<p>Vous pouvez signer votre e-photo immédiatement sans attendre.</p>
							<p class="small-desc">Cliquez sur le bouton ci-dessous pour lancer la visioconférence instantanée (durée : 30 secondes) et valider votre dossier e-photo.</p>
						</div>

						<div class="actions-group horizontal-actions">
							<a href="/signer/{sessionId}?instant=true" class="primary-btn pulse instant-btn">
								📞 Lancer la signature en direct (30s)
							</a>
							<button class="secondary-btn" onclick={copySignatureLink}>
								{copied ? '✅ Lien copié !' : '🔗 Copier le lien de signature'}
							</button>
						</div>
					{:else}
						{#if !isAppointmentBooked}
							<div class="success-booking-alert offline-alert">
								<p>⏰ <strong>Notre équipe est actuellement hors-ligne</strong></p>
								<p class="small-desc">Veuillez choisir un créneau ci-dessous pour planifier votre visioconférence de signature (durée : 30 secondes) afin que notre agent certifie votre e-photo.</p>
							</div>

							<div class="booking-section-inline">
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

									<div class="form-group">
										<label for="booking-email">Votre adresse e-mail :</label>
										<input type="email" id="booking-email" bind:value={userEmail} placeholder="Ex: jean.dupont@email.com" required />
									</div>

									<div class="form-group">
										<label for="booking-phone">Votre numéro de téléphone :</label>
										<input type="tel" id="booking-phone" bind:value={userPhone} placeholder="Ex: 06 12 34 56 78" required />
									</div>
								</div>

								<button class="btn-confirm-booking" onclick={confirmBooking} disabled={!bookingDate || !bookingTime || !userEmail || !userPhone}>
									📅 Confirmer le rendez-vous
								</button>
							</div>
						{:else}
							<div class="success-booking-alert">
								<p>🎉 <strong>Rendez-vous réservé et commande validée !</strong></p>
								<p>Nous nous retrouverons en ligne le <strong>{bookingDate}</strong> à <strong>{bookingTime}</strong>.</p>
								<p class="small-desc">Un e-mail de confirmation contenant votre lien de connexion sécurisé vous a été envoyé à l'adresse <strong>{userEmail}</strong>. Le jour du rendez-vous, il vous suffira de vous connecter pour signer en direct avec notre photographe.</p>
							</div>

							{#if deliveryRequested}
								<div style="background: var(--blue-50); border: 1px solid var(--blue-200); padding: 1.25rem; border-radius: var(--radius-sm); margin: 1.5rem 0; text-align: left;">
									<p style="margin: 0 0 0.5rem 0; font-weight: 700; color: var(--blue-700); font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
										<span>📬 Option Envoi Postal Active</span>
									</p>
									<p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--gray-600); line-height: 1.5;">
										Votre planche photo sera imprimée sur papier photo de haute qualité et expédiée sous 24h à l'adresse suivante :
									</p>
									<div style="background: var(--white); padding: 0.75rem 1rem; border-radius: var(--radius-xs); border: 1px solid var(--gray-200); font-size: 0.95rem; font-weight: 600; color: var(--gray-700); line-height: 1.4;">
										{deliveryName}<br />
										{deliveryStreet}<br />
										{deliveryZip} {deliveryCity}
									</div>
								</div>
							{/if}

							<div class="actions-group horizontal-actions">
								<a href="/signer/{sessionId}" class="primary-btn">
									✍️ Accéder à l'espace de signature
								</a>
								<button class="secondary-btn" onclick={copySignatureLink}>
									{copied ? '✅ Lien copié !' : '🔗 Copier le lien de signature'}
								</button>
							</div>
						{/if}
					{/if}

					<div class="benefits-grid">
						<div class="benefit-card">
							<div class="benefit-icon-badge">✓</div>
							<div class="benefit-content">
								<h4>Légalité Garantie</h4>
								<p>Conformité 100% ANTS (Zéro rejet)</p>
							</div>
						</div>
						<div class="benefit-card">
							<div class="benefit-icon-badge">✓</div>
							<div class="benefit-content">
								<h4>Accompagnement Visio</h4>
								<p>Guidé en direct par notre photographe</p>
							</div>
						</div>
						<div class="benefit-card">
							<div class="benefit-icon-badge">✓</div>
							<div class="benefit-content">
								<h4>Sécurisation Totale</h4>
								<p>Zéro fraude à l'identité certifiée</p>
							</div>
						</div>
						<div class="benefit-card">
							<div class="benefit-icon-badge">✓</div>
							<div class="benefit-content">
								<h4>Délivrance Immédiate</h4>
								<p>Code envoyé dès la fin de l'appel</p>
							</div>
						</div>
					</div>
				</div>

			<!-- CAS 2 & 3 : Téléchargement et partage (Planche de 6 ou Portrait unique) -->
			{:else}
				<div class="product-success-box download-box">
					<h2>{#if deliveryRequested}🎉 Votre commande est en cours d'expédition !{:else}Votre commande est prête !{/if}</h2>
					
					{#if generatedImageUri}
						<div class="preview-output-container">
							<img src={generatedImageUri} alt="Aperçu final" class="preview-output" />
						</div>
					{/if}

					<p class="desc-text">
						{#if formulaId === 'officielle'}
							{#if deliveryRequested}
								Votre planche de 6 photos d'identité est générée et va vous être envoyée par courrier postal. Vous pouvez également télécharger la version numérique ci-dessous.
							{:else}
								Votre planche de 6 photos d'identité est prête au format standard 10x15cm (300 DPI). Vous pouvez l'imprimer chez vous ou en borne photo.
							{/if}
						{:else}
							{#if deliveryRequested}
								Votre portrait professionnel est généré et va vous être envoyé par courrier postal. Vous pouvez également télécharger la version numérique ci-dessous.
							{:else}
								Votre portrait professionnel avec fond personnalisé est disponible en haute définition.
							{/if}
						{/if}
					</p>

					{#if deliveryRequested}
						<div style="background: var(--blue-50); border: 1px solid var(--blue-200); padding: 1.25rem; border-radius: var(--radius-sm); margin: 1.5rem 0; text-align: left;">
							<p style="margin: 0 0 0.5rem 0; font-weight: 700; color: var(--blue-700); font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
								<span>📬 Option Envoi Postal Active</span>
							</p>
							<p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--gray-600); line-height: 1.5;">
								Votre planche photo va être imprimée sur papier photo professionnel haute qualité et expédiée sous 24h à l'adresse suivante :
							</p>
							<div style="background: var(--white); padding: 0.75rem 1rem; border-radius: var(--radius-xs); border: 1px solid var(--gray-200); font-size: 0.95rem; font-weight: 600; color: var(--gray-700); line-height: 1.4;">
								{deliveryName}<br />
								{deliveryStreet}<br />
								{deliveryZip} {deliveryCity}
							</div>
						</div>
					{/if}

					<div class="actions-group horizontal-actions">
						<button class="primary-btn" onclick={downloadPhoto} disabled={!generatedImageUri}>
							📥 Télécharger la photo (HD)
						</button>
						<button class="secondary-btn" onclick={sharePhoto} disabled={!generatedImageUri}>
							🔗 Partager
						</button>
					</div>
				</div>
			{/if}

			<div class="footer-nav">
				<a href="/" class="home-link">Retourner à l'accueil</a>
			</div>

		</div>
	</div>
</main>

<style>
	.success-page {
		min-height: 100vh;
		background: var(--gray-50);
		padding: 3rem 1.5rem;
		box-sizing: border-box;
	}

	.success-container {
		max-width: 650px;
		width: 100%;
		margin: 0 auto;
		display: block;
	}

	.success-card {
		background: var(--white);
		padding: 3rem 2.5rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		width: 100%;
		box-sizing: border-box;
	}

	.success-icon-wrapper {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #eaf6ec;
		color: var(--green-500);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 15px rgba(34, 197, 94, 0.15);
	}

	.success-icon {
		width: 32px;
		height: 32px;
	}

	h1 {
		font-size: 2.2rem;
		font-weight: 900;
		color: var(--gray-900);
		margin-bottom: -0.25rem;
	}

	.subtitle {
		color: var(--gray-500);
		font-size: 1.05rem;
	}

	/* Box de réussite */
	.product-success-box {
		width: 100%;
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		padding: 2.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.product-success-box h2 {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--blue-700);
		border-bottom: 1px solid var(--gray-200);
		padding-bottom: 0.75rem;
	}

	/* Download details */
	.preview-output-container {
		width: 100%;
		max-width: 240px;
		margin: 0 auto;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 4px solid var(--white);
		box-shadow: var(--shadow-md);
	}

	.preview-output {
		width: 100%;
		height: auto;
		display: block;
	}

	.desc-text {
		font-size: 0.95rem;
		color: var(--gray-600);
		text-align: center;
		line-height: 1.6;
	}

	/* Buttons styling */
	.actions-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.actions-group.horizontal-actions {
		flex-direction: row;
	}

	.primary-btn {
		background: var(--blue-700);
		color: var(--white);
		padding: 0.9rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		display: inline-block;
		transition: var(--transition-fast);
		text-align: center;
		flex: 1.5;
		font-size: 0.95rem;
		box-shadow: var(--shadow-sm);
	}

	.primary-btn:hover:not(:disabled) {
		background: var(--blue-900);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.primary-btn:disabled {
		background: var(--gray-300);
		cursor: not-allowed;
	}

	.secondary-btn {
		background: var(--white);
		color: var(--gray-700);
		border: 1px solid var(--gray-300);
		padding: 0.9rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		display: inline-block;
		transition: var(--transition-fast);
		text-align: center;
		flex: 1;
		font-size: 0.95rem;
	}

	.secondary-btn:hover:not(:disabled) {
		background: var(--gray-100);
	}

	/* Animation pulsation */
	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.02); box-shadow: 0 0 15px rgba(29, 78, 216, 0.4); }
	}

	.primary-btn.pulse {
		animation: pulse 2s infinite ease-in-out;
		flex: 1;
	}

	.footer-nav {
		margin-top: 1rem;
	}

	.home-link {
		color: var(--gray-500);
		font-weight: 600;
		font-size: 0.9rem;
		transition: var(--transition-fast);
	}

	.home-link:hover {
		color: var(--blue-700);
	}

	/* Benefits grid */
	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin: 1rem 0 1.5rem 0;
	}

	.benefit-card {
		background: #229b57;
		border: 1px solid #1e874b;
		border-radius: var(--radius-md);
		padding: 1rem;
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		box-shadow: var(--shadow-sm);
		transition: var(--transition-normal);
		text-align: left;
	}

	.benefit-card:hover {
		transform: translateY(-2px);
		background: #1b854a;
	}

	.benefit-icon-badge {
		background: transparent;
		color: var(--white);
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.15rem;
		flex-shrink: 0;
		border: white 2px solid;
	}

	.benefit-content h4 {
		font-size: 0.9rem;
		font-weight: 850;
		color: var(--white);
		margin: 0 0 0.15rem 0 !important;
		padding: 0 !important;
		border: none !important;
	}

	.benefit-content p {
		font-size: 0.8rem !important;
		color: rgba(255, 255, 255, 0.85) !important;
		margin: 0 !important;
		font-weight: 600 !important;
		line-height: 1.45 !important;
		padding: 5px;
	}

	.success-booking-alert {
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		color: #065f46;
		padding: 1.5rem;
		border-radius: var(--radius-sm);
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.success-booking-alert p {
		font-size: 1.1rem;
		margin: 0;
	}

	.success-booking-alert .small-desc {
		font-size: 0.9rem;
		color: #047857;
		line-height: 1.5;
		margin-top: 0.5rem;
	}

	/* Offline booking card styles */
	.offline-alert {
		background: #fef2f2;
		border-color: #fca5a5;
		color: #991b1b;
	}
	.offline-alert .small-desc {
		color: #b91c1c;
	}
	.booking-section-inline {
		background: #f8fafc;
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		margin: 1.5rem 0;
		text-align: left;
	}
	.booking-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}
	.booking-fields .form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.booking-fields label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--gray-700);
	}
	.booking-fields select, .booking-fields input {
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		padding: 0.65rem;
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		background: var(--white);
		color: var(--gray-800);
		outline: none;
	}
	.btn-confirm-booking {
		width: 100%;
		background: var(--blue-600);
		color: var(--white);
		padding: 0.8rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: 0.95rem;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.btn-confirm-booking:hover:not(:disabled) {
		background: var(--blue-700);
	}

	@media (max-width: 576px) {
		.success-page {
			padding: 1rem 0.25rem;
		}

		.success-card {
			padding: 1.5rem 0.75rem;
			gap: 1rem;
		}

		.product-success-box {
			padding: 1.25rem 1rem;
			gap: 1rem;
		}

		.booking-section-inline {
			padding: 1rem 0.5rem;
			margin: 1rem 0;
		}

		.benefit-card {
			padding: 0.75rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.actions-group.horizontal-actions {
			flex-direction: column;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.booking-fields {
			grid-template-columns: 1fr;
		}
	}
</style>
