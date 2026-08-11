<!-- src/routes/admin/sign-bridge/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	
	let sessionId = $state('1234'); // ID de session par défaut pour le test
	/** @type {WebSocket | null} */
	let socket = null;
	let status = $state('Non connecté');
	let isConnected = $state(false);
	let isClientConnected = $state(false);

	/** @type {{ sessionId: string, clientEmail: string } | null} */
	let incomingCall = $state(null);

	let isManualOnline = $state(false);
	let manualPresenceUntil = $state(0);

	function toggleManualPresence(/** @type {boolean} */ online) {
		if (socket && isConnected) {
			socket.send(JSON.stringify({ type: 'set-manual-presence', online }));
		}
	}

	function playRingtone() {
		try {
			// @ts-ignore
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (!AudioContextClass) return;
			const ctx = new AudioContextClass();
			
			// Note 1 (Do 5)
			const osc1 = ctx.createOscillator();
			const gain1 = ctx.createGain();
			osc1.type = 'triangle';
			osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
			osc1.connect(gain1);
			gain1.connect(ctx.destination);
			gain1.gain.setValueAtTime(0.08, ctx.currentTime);
			osc1.start();
			osc1.stop(ctx.currentTime + 0.25);

			// Note 2 (Mi 5)
			setTimeout(() => {
				const osc2 = ctx.createOscillator();
				const gain2 = ctx.createGain();
				osc2.type = 'triangle';
				osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
				osc2.connect(gain2);
				gain2.connect(ctx.destination);
				gain2.gain.setValueAtTime(0.08, ctx.currentTime);
				osc2.start();
				osc2.stop(ctx.currentTime + 0.25);
			}, 250);
		} catch (e) {
			console.error("Web Audio API blocked or not supported", e);
		}
	}

	function acceptCall() {
		if (incomingCall) {
			sessionId = incomingCall.sessionId;
			incomingCall = null;
			if (socket && isConnected) {
				socket.send(JSON.stringify({ type: 'register-admin', sessionId }));
			}
			initJitsiAdmin();
		}
	}

	function rejectCall() {
		incomingCall = null;
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

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D | null} */
	let ctx = null;

	/** @type {any} */
	let jitsiApi = null;

	onMount(() => {
		const urlSessionId = page.url.searchParams.get('session_id');
		if (urlSessionId) {
			sessionId = urlSessionId;
		}
		ctx = canvas.getContext('2d');
		resetCanvas();

		return () => {
			if (socket) socket.close();
			if (jitsiApi) jitsiApi.dispose();
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
		if (jitsiApi) {
			jitsiApi.dispose();
			jitsiApi = null;
		}
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
			if (socket) {
				socket.send(JSON.stringify({ type: 'register-admin', sessionId }));
			}
			initJitsiAdmin();
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			switch (data.type) {
				case 'client-status':
					isClientConnected = data.connected;
					break;

				case 'incoming-call':
					incomingCall = {
						sessionId: data.sessionId,
						clientEmail: data.clientEmail
					};
					playRingtone();
					break;

				case 'manual-presence-status':
					isManualOnline = data.online;
					manualPresenceUntil = data.until;
					break;

				case 'drawstart':
					if (ctx && canvas) {
						// Conversion des coordonnées normalisées (0->1) à la taille locale du canvas d'Easy Photo
						const x = data.x * canvas.width;
						const y = data.y * canvas.height;
						ctx.beginPath();
						ctx.moveTo(x, y);
					}
					break;

				case 'draw':
					if (ctx && canvas) {
						const x = data.x * canvas.width;
						const y = data.y * canvas.height;
						ctx.lineTo(x, y);
						ctx.stroke();
					}
					break;

				case 'drawend':
					// Fin du tracé sur le canvas
					break;

				case 'clear':
					resetCanvas();
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

	function initJitsiAdmin() {
		if (jitsiApi) {
			jitsiApi.dispose();
			jitsiApi = null;
		}

		const checkJitsi = setInterval(() => {
			// @ts-ignore
			if (window.JitsiMeetExternalAPI) {
				clearInterval(checkJitsi);
				const domain = 'meet.jit.si';
				const options = {
					roomName: `ididem_ephoto_session_${sessionId}`,
					width: '100%',
					height: '100%',
					parentNode: document.getElementById('jitsi-container'),
					configOverwrite: {
						startWithAudioMuted: false,
						startWithVideoMuted: false,
						prejoinPageEnabled: false,
						disableDeepLinking: true
					},
					interfaceConfigOverwrite: {
						TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup']
					}
				};
				// @ts-ignore
				jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
			}
		}, 100);
	}
</script>

<svelte:head>
	<title>Pont de Signature Admin - IDidem</title>
	<script src="https://meet.jit.si/external_api.js"></script>
</svelte:head>

<main class="admin-bridge">
	<div class="container">
		{#if incomingCall}
			<div class="incoming-call-banner">
				<div class="call-info">
					<span class="pulse-icon">📞</span>
					<div>
						<strong>Appel Entrant - Signature e-Photo</strong>
						<p>{incomingCall.clientEmail} demande une signature instantanée (Session {incomingCall.sessionId})</p>
					</div>
				</div>
				<div class="call-actions">
					<button class="accept-btn-call" onclick={acceptCall}>Répondre</button>
					<button class="reject-btn-call" onclick={rejectCall}>Refuser</button>
				</div>
			</div>
		{/if}

		<header class="bridge-header">
			<h1>Tableau de bord IDidem — Pont de Signature</h1>
			<p class="status">Statut du pont : <strong class:active={isConnected}>{status}</strong></p>
		</header>

		<div class="setup-panel">
			<div class="input-group">
				<label for="session">Identifiant de session client :</label>
				<input type="text" id="session" bind:value={sessionId} disabled={isConnected} />
				{#if isConnected}
					<button class="connect-btn disconnect-btn" onclick={disconnectFromBridge}>
						Désactiver le Pont
					</button>
				{:else}
					<button class="connect-btn" onclick={connectToBridge}>
						Activer le Pont
					</button>
				{/if}
			</div>

			<div class="client-indicator">
				<span class="dot" class:active={isClientConnected}></span>
				<span>Client : {isClientConnected ? 'En ligne et connecté' : 'En attente de connexion client'}</span>
			</div>

			<div class="stripe-capture-action">
				<button class="capture-btn" onclick={capturePayment} disabled={isCapturing || !sessionId}>
					{isCapturing ? 'Capture...' : '💳 Débiter l\'empreinte (6,99 €)'}
				</button>
				{#if captureMessage}
					<span class="capture-status-msg" class:success-msg={captureSuccess} class:error-msg={!captureSuccess}>
						{captureMessage}
					</span>
				{/if}
			</div>

			<div class="manual-presence-action" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-200); width: 100%; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
				<span style="font-size: 0.85rem; font-weight: 700; color: var(--gray-700);">Disponibilité globale (sans garder l'onglet ouvert) :</span>
				<div style="display: flex; gap: 0.5rem;">
					<button style="background: var(--success); color: var(--white); padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: none; font-weight: 700; cursor: pointer;" onclick={() => toggleManualPresence(true)} disabled={!isConnected}>
						🟢 Me rendre disponible (6h)
					</button>
					<button style="background: var(--danger); color: var(--white); padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: none; font-weight: 700; cursor: pointer;" onclick={() => toggleManualPresence(false)} disabled={!isConnected}>
						🔴 Me rendre indisponible
					</button>
				</div>
				{#if isManualOnline}
					<span style="font-size: 0.8rem; font-weight: 600; color: #16a34a;">
						Statut : Disponible (jusqu'à {manualPresenceUntil ? new Date(manualPresenceUntil).toLocaleTimeString() : ''})
					</span>
				{:else}
					<span style="font-size: 0.8rem; font-weight: 600; color: var(--gray-500);">
						Statut : Indisponible
					</span>
				{/if}
			</div>
		</div>

		<div class="bridge-grid">
			<div class="preview-area">
				<h3>Aperçu de la signature reçue (Easy Photo)</h3>
				<div class="canvas-container">
					<!-- Cadre de dessin proportionnel à l'image du Easy Photo de l'ANTS -->
					<canvas bind:this={canvas} width="600" height="300"></canvas>
				</div>
				<button class="clear-btn" onclick={() => { resetCanvas(); socket?.send(JSON.stringify({ type: 'clear', sessionId })); }}>
					Effacer tout
				</button>
			</div>

			<div class="video-area">
				<h3>Client en direct (Visioconférence)</h3>
				<div id="jitsi-container" class="jitsi-admin-frame">
					{#if !isConnected}
						<div class="placeholder-jitsi">
							<p>Veuillez activer le pont pour démarrer la visioconférence</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="instructions-section">
			<h3>Pont de Simulation robotisé</h3>
			<div class="instructions-card">
				<h4>Comment fonctionne la recopie automatique sur Easy Photo ?</h4>
				<ol>
					<li>Assurez-se que le pont est connecté et que le client est en ligne.</li>
					<li>Ouvrez votre navigateur sur l'écran de signature **Easy Photo**.</li>
					<li>Lancez le script de simulation local sur votre Mac (`node simulate.js`).</li>
					<li>Calibrez les coordonnées de votre écran comme demandé par le script.</li>
					<li>Demandez au client de signer sur son téléphone : son doigt guide le stylet sur votre écran à 100% de manière automatique.</li>
				</ol>
			</div>
		</div>
	</div>
</main>

<style>
	.admin-bridge {
		min-height: 100vh;
		background: var(--gray-50);
		padding: 3rem 0;
	}
	.bridge-header {
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--gray-200);
		padding-bottom: 1.5rem;
	}
	.status strong {
		color: var(--danger);
	}
	.status strong.active {
		color: var(--success);
	}
	.setup-panel {
		background: var(--white);
		padding: 1.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	.input-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.input-group input {
		padding: 0.6rem;
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		font-weight: 700;
		text-align: center;
		width: 100px;
	}
	.connect-btn {
		background: var(--blue-600);
		color: var(--white);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		cursor: pointer;
	}
	.connect-btn.disconnect-btn {
		background: var(--danger);
	}
	.connect-btn:disabled {
		background: var(--gray-400);
		cursor: not-allowed;
	}
	.client-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
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
	.bridge-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 2.5rem;
	}
	.preview-area, .video-area {
		background: var(--white);
		padding: 2rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
	}
	.preview-area h3, .video-area h3 {
		margin-bottom: 1.5rem;
		color: var(--blue-700);
	}
	.video-area {
		display: flex;
		flex-direction: column;
		min-height: 420px;
	}
	.jitsi-admin-frame {
		flex: 1;
		background: #0f172a;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid var(--gray-200);
		position: relative;
	}
	.placeholder-jitsi {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gray-400);
		font-weight: 600;
		text-align: center;
		padding: 2rem;
	}
	.instructions-section {
		background: var(--white);
		padding: 2rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--gray-200);
		box-shadow: var(--shadow-sm);
		margin-top: 2.5rem;
	}
	.instructions-section h3 {
		margin-bottom: 1.5rem;
		color: var(--blue-700);
	}
	.canvas-container {
		width: 100%;
		aspect-ratio: 2/1;
		background: #f8fafc;
		border: 2px dashed var(--gray-300);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
	}
	canvas {
		background: #ffffff;
		display: block;
		box-shadow: var(--shadow-md);
	}
	.clear-btn {
		background: var(--danger);
		color: var(--white);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
	}
	.instructions-card h4 {
		margin-bottom: 1rem;
		color: var(--gray-800);
	}
	.instructions-card ol {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--gray-600);
	}

	/* Incoming Call Banner */
	.incoming-call-banner {
		background: #fef3c7;
		border: 1px solid #fde68a;
		border-left: 5px solid #d97706;
		padding: 1.25rem 2rem;
		border-radius: var(--radius-md);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		box-shadow: var(--shadow-md);
		animation: slide-down 0.3s ease-out;
	}
	@keyframes slide-down {
		from { transform: translateY(-20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
	.call-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: #92400e;
		text-align: left;
	}
	.pulse-icon {
		font-size: 1.75rem;
		animation: pulse-phone 1.5s infinite;
		display: inline-block;
	}
	@keyframes pulse-phone {
		0% { transform: scale(1); }
		50% { transform: scale(1.2); }
		100% { transform: scale(1); }
	}
	.call-info p {
		margin: 0.25rem 0 0 0;
		font-size: 0.9rem;
		color: #b45309;
	}
	.call-actions {
		display: flex;
		gap: 0.75rem;
	}
	.accept-btn-call {
		background: var(--success);
		color: var(--white);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.accept-btn-call:hover {
		opacity: 0.9;
	}
	.reject-btn-call {
		background: var(--danger);
		color: var(--white);
		padding: 0.6rem 1.25rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.reject-btn-call:hover {
		opacity: 0.9;
	}

	/* Stripe Capture action styling */
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
		background: #6366f1; /* Indigo color */
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
