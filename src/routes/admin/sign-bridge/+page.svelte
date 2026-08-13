<!-- src/routes/admin/sign-bridge/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';

	let sessionId = $state('1234'); // ID de session par défaut pour le test
	/** @type {WebSocket | null} */
	let socket = null;
	let status = $state('Non connecté');
	let isConnected = $state(false);
	let isClientConnected = $state(false);

	let isManualOnline = $state(false);
	let manualPresenceUntil = $state(0);

	function toggleManualPresence(/** @type {boolean} */ online) {
		if (socket && isConnected) {
			socket.send(JSON.stringify({ type: 'set-manual-presence', online }));
		}
	}

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D | null} */
	let ctx = null;

	onMount(() => {
		const urlSessionId = page.url.searchParams.get('session_id');
		if (urlSessionId) {
			sessionId = urlSessionId;
		}
		ctx = canvas.getContext('2d');
		resetCanvas();

		// Connexion automatique au pont WebSocket
		connectToBridge();

		return () => {
			if (socket) socket.close();
		};
	});

	function resetCanvas() {
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = '#0f172a';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
		}
	}

	function disconnectFromBridge() {
		if (socket) {
			try {
				socket.close();
			} catch (e) {
				console.error(e);
			}
			socket = null;
		}
		isConnected = false;
		status = 'Déconnecté';
		isClientConnected = false;
	}

	function connectToBridge() {
		if (socket) {
			try {
				socket.close();
			} catch (e) {
				console.error(e);
			}
		}

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
			? `${protocol}//${window.location.hostname}:5001`
			: 'wss://ididemwebapp.onrender.com';
		
		status = 'Connexion au serveur...';
		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			isConnected = true;
			status = `Connecté – Session ${sessionId}`;
			
			// Met à jour l'URL sans recharger la page
			window.history.replaceState(null, '', `?session_id=${sessionId}`);
			
			if (socket) {
				socket.send(JSON.stringify({ type: 'register-admin', sessionId }));
			}
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			switch (data.type) {
				case 'client-status':
					isClientConnected = data.connected;
					break;

				case 'manual-presence-status':
					isManualOnline = data.online;
					manualPresenceUntil = data.until;
					break;

				case 'clear':
					resetCanvas();
					break;

				case 'drawstart':
					if (ctx && canvas) {
						ctx.beginPath();
						ctx.moveTo(data.x * canvas.width, data.y * canvas.height);
					}
					break;

				case 'draw':
					if (ctx && canvas) {
						ctx.lineTo(data.x * canvas.width, data.y * canvas.height);
						ctx.stroke();
					}
					break;

				case 'drawend':
					if (ctx) {
						ctx.closePath();
					}
					break;
			}
		};

		socket.onclose = () => {
			isConnected = false;
			status = 'Déconnecté';
		};

		socket.onerror = () => {
			status = 'Erreur serveur';
		};
	}

	let isCapturing = $state(false);
	let captureMessage = $state('');
	let captureSuccess = $state(false);

	async function capturePayment() {
		if (!sessionId) return;
		isCapturing = true;
		captureMessage = 'Capture en cours...';
		captureSuccess = false;

		try {
			const response = await fetch('/api/capture-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ sessionId })
			});
			const data = await response.json();
			if (response.ok && data.success) {
				captureSuccess = true;
				captureMessage = 'Paiement de 6,99 € capturé avec succès !';
			} else {
				captureSuccess = false;
				captureMessage = `Erreur: ${data.error || 'Erreur inconnue'}`;
			}
		} catch (err) {
			captureSuccess = false;
			captureMessage = 'Erreur réseau lors de la capture';
			console.error(err);
		} finally {
			isCapturing = false;
		}
	}
</script>

<svelte:head>
	<title>Tableau de Bord Pont de Signature - IDidem</title>
</svelte:head>

<Header />

<main class="admin-bridge">
	<div class="container">
		<div class="header-section">
			<h1>Tableau de bord IDidem — Pont de Signature</h1>
			<p class="status-indicator">
				Statut du pont : <span class="status-badge" class:connected={isConnected}>{status}</span>
			</p>
		</div>

		<div class="controls-panel">
			<div class="session-info">
				<div class="info-group">
					<label for="session-id">Identifiant de session client :</label>
					<div class="session-input-row">
						<input type="text" id="session-id" bind:value={sessionId} placeholder="Ex: ID-ABC123XYZ" />
						{#if isConnected}
							<button class="disconnect-btn" onclick={disconnectFromBridge}>Désactiver le Pont</button>
						{:else}
							<button class="connect-btn" onclick={connectToBridge}>Activer le Pont</button>
						{/if}
					</div>
				</div>

				<div class="status-row">
					<div class="client-indicator">
						<span class="dot" class:active={isClientConnected}></span>
						<span>Client : {isClientConnected ? 'En ligne (Page de signature active)' : 'Hors-ligne / En attente de connexion'}</span>
					</div>
				</div>

				<div class="stripe-capture-action">
					<span style="font-size: 0.85rem; font-weight: 700; color: var(--gray-700);">Paiement sécurisé Stripe (e-Photo) :</span>
					<button class="capture-btn" onclick={capturePayment} disabled={isCapturing || !sessionId}>
						{isCapturing ? 'Capture en cours...' : '💳 Débiter l\'empreinte bancaire (6,99 €)'}
					</button>
					{#if captureMessage}
						<span class="capture-status-msg" class:success-msg={captureSuccess} class:error-msg={!captureSuccess}>
							{captureMessage}
						</span>
					{/if}
				</div>
			</div>

			<div class="manual-presence-action">
				<span class="section-title">Disponibilité globale (sans garder l'onglet ouvert) :</span>
				<div class="btn-group">
					<button class="presence-btn available" onclick={() => toggleManualPresence(true)} disabled={!isConnected}>
						🟢 Me rendre disponible (6h)
					</button>
					<button class="presence-btn unavailable" onclick={() => toggleManualPresence(false)} disabled={!isConnected}>
						🔴 Me rendre indisponible
					</button>
				</div>
				<div class="presence-status">
					{#if isManualOnline}
						<span class="online-txt">Statut : Disponible (jusqu'à {manualPresenceUntil ? new Date(manualPresenceUntil).toLocaleTimeString() : ''})</span>
					{:else}
						<span class="offline-txt">Statut : Indisponible</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="bridge-grid">
			<!-- Zone d'aperçu de signature -->
			<div class="preview-area">
				<h3>Aperçu de la signature reçue (Easy Photo)</h3>
				<div class="canvas-container">
					<canvas bind:this={canvas} width="600" height="300"></canvas>
				</div>
				<button class="clear-btn" onclick={() => { resetCanvas(); socket?.send(JSON.stringify({ type: 'clear', sessionId })); }}>
					Effacer tout
				</button>
			</div>

			<!-- Zone d'instructions du pont de simulation -->
			<div class="instructions-area">
				<h3>Pont de Simulation robotisé</h3>
				<div class="instructions-content">
					<h4>Comment fonctionne la recopie automatique sur Easy Photo ?</h4>
					<ol>
						<li>Assurez-vous que ce pont d'administration est <strong>connecté</strong> (statut vert) et que votre simulateur local est démarré.</li>
						<li>Ouvrez votre navigateur sur l'écran de signature de la plateforme <strong>Easy Photo</strong> de l'ANTS.</li>
						<li>Lorsque le client dessine sa signature sur son téléphone, celle-ci s'affiche en temps réel ci-contre et est <strong>immédiatement recopiée</strong> par le simulateur sur votre écran de travail.</li>
						<li>Une fois validée, la signature et la photo finale d'identité vous sont envoyées par e-mail dans un dossier unique pour archivage.</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.admin-bridge {
		padding: 2rem;
		background: #f8fafc;
		min-height: 100vh;
		font-family: 'Inter', sans-serif;
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.header-section h1 {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--blue-900);
		margin-bottom: 0.5rem;
	}
	.status-indicator {
		font-size: 0.95rem;
		color: var(--gray-600);
		font-weight: 600;
	}
	.status-badge {
		color: var(--danger);
		font-weight: 700;
	}
	.status-badge.connected {
		color: var(--success);
	}
	.controls-panel {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 2rem;
		background: var(--white);
		padding: 2rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
	}
	.session-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.info-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.info-group label {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--gray-700);
	}
	.session-input-row {
		display: flex;
		gap: 0.75rem;
	}
	.session-input-row input {
		flex: 1;
		padding: 0.6rem 0.85rem;
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-weight: 600;
	}
	.connect-btn, .disconnect-btn, .presence-btn {
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.connect-btn {
		background: #ff7a00;
		color: var(--white);
	}
	.disconnect-btn {
		background: var(--danger);
		color: var(--white);
	}
	.status-row {
		margin-top: 0.5rem;
	}
	.client-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 0.95rem;
	}
	.dot {
		width: 12px;
		height: 12px;
		background: var(--gray-400);
		border-radius: 50%;
	}
	.dot.active {
		background: var(--success);
		box-shadow: 0 0 10px var(--success);
	}
	.manual-presence-action {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border-left: 1px solid var(--gray-200);
		padding-left: 2rem;
	}
	.section-title {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--gray-700);
	}
	.btn-group {
		display: flex;
		gap: 0.75rem;
	}
	.presence-btn.available {
		background: var(--success);
		color: var(--white);
	}
	.presence-btn.unavailable {
		background: var(--danger);
		color: var(--white);
	}
	.presence-status {
		font-size: 0.85rem;
		font-weight: 600;
	}
	.online-txt {
		color: #16a34a;
	}
	.offline-txt {
		color: var(--gray-500);
	}
	.bridge-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 2.5rem;
	}
	.preview-area, .instructions-area {
		background: var(--white);
		padding: 2rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
	}
	.preview-area h3, .instructions-area h3 {
		margin-bottom: 1.5rem;
		color: var(--blue-700);
		font-size: 1.2rem;
		font-weight: 800;
	}
	.canvas-container {
		border: 1px solid var(--gray-300);
		background: #f8fafc;
		border-radius: var(--radius-md);
		margin-bottom: 1rem;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	canvas {
		display: block;
		background: white;
		max-width: 100%;
		height: auto;
	}
	.clear-btn {
		background: var(--gray-100);
		color: var(--gray-700);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--gray-300);
		font-weight: 600;
		cursor: pointer;
	}
	.clear-btn:hover {
		background: var(--gray-200);
	}
	.instructions-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.instructions-content h4 {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--gray-800);
		margin: 0;
	}
	.instructions-content ol {
		padding-left: 1.25rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--gray-600);
	}
	.stripe-capture-action {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--gray-200);
		width: 100%;
	}
	.capture-btn {
		background: #6366f1;
		color: var(--white);
		padding: 0.65rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.capture-btn:hover:not(:disabled) {
		background: #4f46e5;
	}
	.capture-btn:disabled {
		background: var(--gray-300);
		cursor: not-allowed;
	}
	.capture-status-msg {
		font-size: 0.85rem;
		font-weight: 600;
	}
	.success-msg {
		color: #15803d;
	}
	.error-msg {
		color: #b91c1c;
	}
</style>
