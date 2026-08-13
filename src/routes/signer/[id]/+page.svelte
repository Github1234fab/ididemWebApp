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
	let pad = $state();

	// Données du formulaire
	let clientName = $state('');
	let clientBirthdate = $state('');
	let clientEmail = $state('');
	let clientPhone = $state('');
	let certCheck = $state(false);

	let isSubmitting = $state(false);
	let submitMessage = $state('');
	let isSubmitted = $state(false);

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
					if (pad) pad.clear();
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
	 * @param {{x: number, y: number}} detail
	 */
	function handleDrawStart(detail) {
		sendMsg({ type: 'drawstart', sessionId, x: detail.x, y: detail.y });
	}

	/**
	 * @param {{x: number, y: number}} detail
	 */
	function handleDraw(detail) {
		sendMsg({ type: 'draw', sessionId, x: detail.x, y: detail.y });
	}

	function handleDrawEnd() {
		sendMsg({ type: 'drawend', sessionId });
	}

	function handleClear() {
		if (pad) pad.clear();
		sendMsg({ type: 'clear', sessionId });
	}

	async function handleSubmit() {
		if (!clientName || !clientEmail || !clientBirthdate || !clientPhone) {
			submitMessage = "Veuillez remplir tous les champs obligatoires.";
			return;
		}
		if (!certCheck) {
			submitMessage = "Vous devez certifier l'exactitude des informations sur l'honneur.";
			return;
		}
		if (!pad || pad.isEmpty()) {
			submitMessage = "Veuillez apposer votre signature dans le cadre blanc.";
			return;
		}

		isSubmitting = true;
		submitMessage = "Envoi de votre signature et certification en cours...";

		try {
			const signatureData = pad.toDataURL();
			const photoData = localStorage.getItem('ididem_captured_image') || '';

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
					photoData
				})
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || "Une erreur est survenue lors de la transmission.");
			}

			isSubmitted = true;
			submitMessage = "Votre signature et certification ont été transmises avec succès ! Notre photographe finalise votre planche photo.";
		} catch (err) {
			console.error("Erreur d'envoi:", err);
			submitMessage = err instanceof Error ? err.message : "Une erreur réseau est survenue.";
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
					<ul>
						<li>🌱 Notre opérateur vérifie et finalise votre planche conforme ANTS.</li>
						<li>📧 Votre code e-Photo et votre planche conforme vous seront envoyés par mail à <strong>{clientEmail}</strong>.</li>
						<li>📬 Si vous avez choisi l'envoi postal, la planche partira au courrier sous 24h.</li>
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
							<strong>Je certifie sur l'honneur</strong> mon identité ainsi que l'exactitude des informations saisies. Je m'engage à fournir une signature conforme.
						</label>
					</div>

					<p class="warning-text">
						⚠️ La loi sur l'usage de faux (article 441-1 du Code pénal) punit la fausse déclaration et la signature frauduleuse d'une peine pouvant aller jusqu'à 3 ans d'emprisonnement et 45 000 € d'amende.
					</p>
				</form>
			</div>

			<!-- Panel Signature Pad -->
			<div class="signer-container">
				<header class="signer-header">
					<h2>Votre Signature</h2>
					<p class="status" class:connected={isConnected}>{status}</p>
				</header>

				<div class="instructions">
					<p>Signez avec votre doigt ou un stylet à l'intérieur du cadre ci-dessous.</p>
				</div>

				<div class="pad-wrapper">
					<SignaturePad
						bind:this={pad}
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
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
	}
	.input-group input {
		padding: 0.65rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.1);
		color: var(--white);
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.input-group input:focus {
		border-color: var(--orange-500);
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
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.3;
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
		margin: 0;
	}
	.status {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.6);
		margin-top: 0.25rem;
	}
	.status.connected {
		color: var(--green-400);
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
		margin-bottom: 1rem;
	}
	.success-desc {
		font-size: 1.05rem;
		color: rgba(255, 255, 255, 0.8);
		max-width: 600px;
		margin-bottom: 2rem;
		line-height: 1.5;
	}
	.success-steps {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1.5rem 2rem;
		border-radius: var(--radius-lg);
		max-width: 600px;
		text-align: left;
		margin-bottom: 2.5rem;
	}
	.success-steps h3 {
		font-size: 1.1rem;
		font-weight: 700;
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
		color: rgba(255, 255, 255, 0.85);
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
