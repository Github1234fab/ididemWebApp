<!-- src/routes/signer/[id]/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import SignaturePad from '$lib/components/SignaturePad.svelte';

	const sessionId = page.params.id;
	/** @type {WebSocket | null} */
	let socket = null;
	let status = $state('Connexion...');
	let isConnected = $state(false);
	/** @type {any} */
	let padMethods = $state({});

	// Données du formulaire
	let clientName = $state('');
	let clientBirthdate = $state('');
	let clientEmail = $state('');
	let clientPhone = $state('');
	let certCheck = $state(false);

	let isSubmitting = $state(false);
	let submitMessage = $state('');
	let isSubmitted = $state(false);

	// Enregistrement des coordonnées pour le replay asynchrone
	/** @type {any[]} */
	let drawCoords = [];

	onMount(() => {
		// Pré-remplir les données issues du stockage local si dispo
		clientEmail = localStorage.getItem('ididem_user_email') || '';
		clientPhone = localStorage.getItem('ididem_user_phone') || '';
		clientName = localStorage.getItem('ididem_delivery_name') || '';

		// Connexion WebSocket en temps réel pour l'admin (aperçu de la signature)
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
			? `${protocol}//${window.location.hostname}:5001`
			: 'wss://ididemwebapp.onrender.com';
		
		status = 'Prêt à signer';
		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			isConnected = true;
			sendMsg({ type: 'register-client', sessionId });
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'clear') {
					if (padMethods.clear) padMethods.clear();
				}
			} catch (err) {
				console.error('Erreur réception message:', err);
			}
		};

		socket.onclose = () => {
			isConnected = false;
			status = 'Session déconnectée';
		};

		socket.onerror = () => {
			isConnected = false;
		};

		return () => {
			if (socket) socket.close();
		};
	});

	/**
	 * @param {object} data
	 */
	function sendMsg(data) {
		if (socket && isConnected) {
			socket.send(JSON.stringify(data));
		}
	}

	/**
	 * @param {any} detail
	 */
	function handleDrawStart(detail) {
		sendMsg({ type: 'drawstart', sessionId, x: detail.x, y: detail.y });
		drawCoords.push({ type: 'drawstart', x: detail.x, y: detail.y });
	}

	/**
	 * @param {{x: number, y: number}} detail
	 */
	function handleDraw(detail) {
		sendMsg({ type: 'draw', sessionId, x: detail.x, y: detail.y });
		drawCoords.push({ type: 'draw', x: detail.x, y: detail.y });
	}

	function handleDrawEnd() {
		sendMsg({ type: 'drawend', sessionId });
		drawCoords.push({ type: 'drawend' });
	}

	function handleClear() {
		if (padMethods.clear) padMethods.clear();
		sendMsg({ type: 'clear', sessionId });
		drawCoords = [];
	}

	async function handleSubmit() {
		console.log("[Client Signature] Clic sur 'Valider et envoyer'. Vérification des données...");
		console.log("[Client Signature] Instance de pad liée:", padMethods);
		console.log("[Client Signature] Clés de pad:", padMethods ? Object.keys(padMethods) : "null");
		
		if (!clientName || !clientEmail || !clientBirthdate || !clientPhone) {
			const errorMsg = "Veuillez remplir tous les champs obligatoires.";
			console.warn("[Client Signature] Validation échouée: champs manquants.");
			alert(errorMsg);
			submitMessage = errorMsg;
			return;
		}

		// Vérification de l'âge (minimum 18 ans)
		if (clientBirthdate) {
			const birthDateObj = new Date(clientBirthdate);
			const today = new Date();
			let age = today.getFullYear() - birthDateObj.getFullYear();
			const monthDiff = today.getMonth() - birthDateObj.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
				age--;
			}
			if (age < 18) {
				const errorMsg = "La signature d'une e-Photo officielle est réservée aux personnes majeures (18 ans et plus).";
				console.warn("[Client Signature] Validation échouée: mineur.", age);
				alert(errorMsg);
				submitMessage = errorMsg;
				return;
			}
		}

		if (!certCheck) {
			const errorMsg = "Vous devez certifier l'exactitude des informations sur l'honneur.";
			console.warn("[Client Signature] Validation échouée: case non cochée.");
			alert(errorMsg);
			submitMessage = errorMsg;
			return;
		}
		if (!padMethods.isEmpty || padMethods.isEmpty()) {
			const errorMsg = "Veuillez apposer votre signature dans le cadre blanc.";
			console.warn("[Client Signature] Validation échouée: signature vide.");
			alert(errorMsg);
			submitMessage = errorMsg;
			return;
		}

		console.log("[Client Signature] Validation OK. Préparation des images Base64...");
		isSubmitting = true;
		submitMessage = "Envoi de votre signature et certification en cours...";

		try {
			const signatureData = padMethods.toDataURL ? padMethods.toDataURL() : '';
			const photoData = localStorage.getItem('ididem_captured_image') || '';
			
			console.log("[Client Signature] Taille signature:", signatureData.length);
			console.log("[Client Signature] Taille photo originale:", photoData ? photoData.length : "0 (non trouvée)");

			console.log("[Client Signature] Envoi de la requête POST vers /api/submit-signature...");
			const res = await fetch('/api/submit-signature', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: clientName,
					email: clientEmail,
					phone: clientPhone,
					birthdate: clientBirthdate,
					sessionId,
					signatureData,
					photoData,
					coords: drawCoords // Joindre l'historique des tracés
				})
			});

			console.log("[Client Signature] Réponse reçue. Statut HTTP:", res.status);

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				console.error("[Client Signature] Erreur serveur renvoyée:", errData);
				throw new Error(errData.error || "Une erreur est survenue lors de la transmission.");
			}

			console.log("[Client Signature] Soumission réussie !");
			isSubmitted = true;
			submitMessage = "Votre signature et certification ont été transmises avec succès ! Notre photographe finalise votre planche photo.";
		} catch (err) {
			console.error("[Client Signature] Erreur attrapée dans handleSubmit:", err);
			const errText = err instanceof Error ? err.message : "Une erreur réseau est survenue.";
			alert("Erreur lors de l'envoi : " + errText);
			submitMessage = errText;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Certification et Signature - IDidem</title>
</svelte:head>

<main class="signer-page">
	<div class="split-signer-container">
		{#if isSubmitted}
			<div class="success-screen">
				<div class="success-icon">✓</div>
				<h2>Merci pour votre signature</h2>
				<p class="success-desc">{submitMessage}</p>
				<div class="success-steps">
					<h3>Quelle est la suite ?</h3>
					<ul style="display: flex; flex-direction: column; gap: 1.25rem; list-style: none; padding: 0; margin: 0;">
						<li style="display: flex; gap: 0.85rem; align-items: center;">
							<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: #30d158; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: #ffffff; width: 16px; height: 16px; stroke-width: 2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
							</span>
							<span style="font-size: 0.95rem; color: #ffffff;">Notre opérateur vérifie et finalise votre planche conforme ANTS.</span>
						</li>
						<li style="display: flex; gap: 0.85rem; align-items: center;">
							<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: #0a84ff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: #ffffff; width: 16px; height: 16px; stroke-width: 2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
							</span>
							<span style="font-size: 0.95rem; color: #ffffff;">Votre code e-Photo vous sera envoyé par mail à <strong>{clientEmail}</strong>.</span>
						</li>
						<li style="display: flex; gap: 0.85rem; align-items: center;">
							<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: #ff9f0a; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: #ffffff; width: 16px; height: 16px; stroke-width: 2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86" /></svg>
							</span>
							<span style="font-size: 0.95rem; color: #ffffff;">Si vous avez choisi l'envoi postal, la planche partira sous 24h maximum.</span>
						</li>
						<li style="display: flex; gap: 0.85rem; align-items: center;">
							<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: #ff2d55; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: #ffffff; width: 16px; height: 16px; stroke-width: 2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.5 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
							</span>
							<span style="font-size: 0.95rem; color: #ffffff;">Le paiement de votre commande sera débité à l'envoi de votre e-photo.</span>
						</li>
					</ul>
				</div>
				<a href="/" class="home-link-btn">Retour à l'accueil</a>
			</div>
		{:else}
			<!-- Panel Formulaire légal -->
			<div class="form-panel">
				<h2>Certification d'identité</h2>
				<p class="form-intro">
					Conformément à la réglementation sur les photos officielles d'identité (ANTS), veuillez certifier votre identité ci-dessous avant d'apposer votre signature.
				</p>

				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="legal-form">
					<div class="input-group">
						<label for="client-name">Nom et Prénom :</label>
						<input type="text" id="client-name" bind:value={clientName} placeholder="Ex: Jean Dupont" required />
					</div>

					<div class="input-group">
						<label for="client-birthdate">Date de naissance :</label>
						<input type="date" id="client-birthdate" bind:value={clientBirthdate} required />
					</div>

					<div class="input-group">
						<label for="client-email">Adresse e-mail :</label>
						<input type="email" id="client-email" bind:value={clientEmail} placeholder="Ex: jean.dupont@email.com" required />
					</div>

					<div class="input-group">
						<label for="client-phone">Numéro de téléphone :</label>
						<input type="tel" id="client-phone" bind:value={clientPhone} placeholder="Ex: 06 12 34 56 78" required />
					</div>

					<div class="cert-box">
						<input type="checkbox" id="cert-check" bind:checked={certCheck} />
						<label for="cert-check">
							<strong>Je certifie sur l'honneur</strong> mon identité ainsi que l'exactitude des informations saisies. J'autorise expressément le photographe habilité d'IDidem à reproduire fidèlement ma signature ci-dessous sur ma planche photo officielle ANTS pour mon dossier.
						</label>
					</div>

					<p class="warning-text">
						⚠️ La loi sur l'usage de faux (article 441-1 du Code pénal) punit la fausse déclaration et la signature frauduleuse d'une peine pouvant aller jusqu'à 3 ans d'emprisonnement et 45 000 € d'amende.
					</p>
				</form>
			</div>

			<!-- Panel Signature Pad -->
			<div class="signer-container">
				<header class="signer-header" style="margin-bottom: 0.5rem;">
					<h2>Votre Signature</h2>
				</header>

				<div class="instructions">
					<p>Signez avec votre doigt ou un stylet à l'intérieur du cadre ci-dessous.</p>
				</div>

				<div class="pad-wrapper">
					<SignaturePad
						bind:methods={padMethods}
						ondrawstart={handleDrawStart}
						ondraw={handleDraw}
						ondrawend={handleDrawEnd}
						onclear={handleClear}
					/>
				</div>

				<div class="actions">
					<button type="button" class="clear-btn" onclick={handleClear}>Effacer</button>
					<button type="button" class="confirm-btn" onclick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? 'Transmission...' : 'Valider et envoyer'}
					</button>
				</div>

				{#if submitMessage}
					<p class="submit-msg" class:error={!isSubmitted}>{submitMessage}</p>
				{/if}
			</div>
		{/if}
	</div>
</main>

<style>
	.signer-page {
		min-height: 100vh;
		background: var(--blue-900);
		background: var(--gradient-hero);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1.5rem;
		color: var(--white);
		font-family: 'Inter', sans-serif;
	}
	.split-signer-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
		width: 100%;
		max-width: 1100px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		padding: 2.5rem;
		box-shadow: var(--shadow-2xl);
	}
	.form-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form-panel h2 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--white);
		margin: 0;
	}
	.form-intro {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.4;
	}
	.legal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.input-group label {
		font-size: 0.85rem;
		font-weight: 700;
		color: #ffffff !important;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	.input-group input {
		padding: 0.75rem 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.3) !important;
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.12) !important;
		color: #ffffff !important;
		font-size: 0.95rem;
		outline: none;
		transition: all 0.2s;
	}
	.input-group input::placeholder {
		color: rgba(255, 255, 255, 0.55) !important;
	}
	.input-group input:focus {
		border-color: #ff7a00 !important;
		background: rgba(255, 255, 255, 0.18) !important;
		box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.2);
	}
	.cert-box {
		display: flex;
		gap: 0.75rem;
		background: rgba(255, 122, 0, 0.1);
		border: 1px solid rgba(255, 122, 0, 0.3);
		padding: 0.75rem;
		border-radius: var(--radius-md);
		align-items: flex-start;
		margin-top: 0.5rem;
	}
	.cert-box input[type="checkbox"] {
		margin-top: 0.2rem;
		transform: scale(1.2);
		cursor: pointer;
	}
	.cert-box label {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.4;
		cursor: pointer;
	}
	.warning-text {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.75) !important;
		line-height: 1.49;
	}
	.signer-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.signer-header h2 {
		font-size: 1.5rem;
		font-weight: 800;
		color: #ffffff !important;
		margin: 0;
	}
	.instructions {
		background: rgba(255, 255, 255, 0.05);
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
	}
	.pad-wrapper {
		height: 260px;
		border: 2px dashed rgba(255, 255, 255, 0.3);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		background: #ffffff;
	}
	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}
	.clear-btn {
		flex: 1;
		background: rgba(255, 255, 255, 0.15);
		color: var(--white);
		padding: 0.85rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		transition: var(--transition-fast);
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
	}
	.clear-btn:hover {
		background: rgba(255, 255, 255, 0.25);
	}
	.confirm-btn {
		flex: 2;
		background: #ff7a00;
		color: var(--white);
		padding: 0.85rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		transition: var(--transition-fast);
		box-shadow: var(--shadow-md);
		border: none;
		cursor: pointer;
	}
	.confirm-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.confirm-btn:not(:disabled):hover {
		background: #ea580c;
		transform: translateY(-2px);
	}
	.submit-msg {
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
		margin-top: 0.5rem;
	}
	.submit-msg.error {
		color: #ef4444;
	}

	/* Écran de succès */
	.success-screen {
		grid-column: span 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 0;
	}
	.success-icon {
		width: 70px;
		height: 70px;
		background: #16a34a;
		color: var(--white);
		font-size: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		margin-bottom: 1.5rem;
		box-shadow: 0 0 20px rgba(22, 163, 74, 0.4);
	}
	.success-screen h2 {
		font-size: 2rem;
		font-weight: 800;
		color: #ffffff !important;
		margin-bottom: 1rem;
	}
	.success-desc {
		font-size: 1.05rem;
		color: #ffffff;
		max-width: 600px;
		margin-bottom: 2rem;
		line-height: 1.5;
	}
	.success-steps {
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.25);
		padding: 1.5rem 2rem;
		border-radius: var(--radius-lg);
		max-width: 600px;
		text-align: left;
		margin-bottom: 2.5rem;
	}
	.success-steps h3 {
		font-size: 1.1rem;
		font-weight: 700;
		color: #ffffff;
		margin-bottom: 0.75rem;
	}
	.success-steps ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.success-steps li {
		font-size: 0.9rem;
		color: #ffffff;
		line-height: 1.4;
	}
	.home-link-btn {
		background: #ff7a00;
		color: var(--white);
		padding: 0.9rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s;
	}
	.home-link-btn:hover {
		background: #ea580c;
		transform: translateY(-2px);
	}

	@media (max-width: 900px) {
		.split-signer-container {
			grid-template-columns: 1fr;
			padding: 1.5rem;
			gap: 2rem;
		}
		.success-screen {
			grid-column: span 1;
		}
	}
</style>
