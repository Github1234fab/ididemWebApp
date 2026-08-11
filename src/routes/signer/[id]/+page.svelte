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
	let pad;
	let jitsiApi = null;

	onMount(() => {
		// Connexion WebSocket en temps réel
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
			? `${protocol}//${window.location.hostname}:5001`
			: 'wss://ididemwebapp.onrender.com';
		
		status = 'Connexion au serveur de signature...';
		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			isConnected = true;
			status = 'Prêt à signer';
			// S'enregistrer auprès du serveur avec l'identifiant de session
			sendMsg({ type: 'register-client', sessionId });

			const isInstant = page.url.searchParams.get('instant') === 'true';
			if (isInstant) {
				sendMsg({
					type: 'instant-call-request',
					sessionId,
					email: localStorage.getItem('ididem_user_email') || 'Client e-Photo'
				});
			}
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
			status = 'Déconnecté du serveur';
		};

		socket.onerror = () => {
			isConnected = false;
			status = 'Erreur de connexion';
		};

		// Charger la visioconférence Jitsi Meet
		// @ts-ignore
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
						prejoinPageEnabled: false, // Désactivé pour entrer directement
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

		return () => {
			clearInterval(checkJitsi);
			if (socket) socket.close();
			if (jitsiApi) jitsiApi.dispose();
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

	// Simulation clavier pour le test local sur le même écran
	let simX = 0.5;
	let simY = 0.5;
	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeyDown(event) {
		const step = 0.05;
		let active = false;

		if (event.key === 'ArrowUp') { simY -= step; active = true; }
		else if (event.key === 'ArrowDown') { simY += step; active = true; }
		else if (event.key === 'ArrowLeft') { simX -= step; active = true; }
		else if (event.key === 'ArrowRight') { simX += step; active = true; }
		else if (event.key === 'c') { handleClear(); return; }

		// Garder les coordonnées dans le canvas (0->1)
		simX = Math.max(0, Math.min(1, simX));
		simY = Math.max(0, Math.min(1, simY));

		if (active) {
			event.preventDefault();
			// On envoie le mouvement
			sendMsg({ type: 'drawstart', sessionId, x: simX, y: simY });
			sendMsg({ type: 'draw', sessionId, x: simX, y: simY });
			sendMsg({ type: 'drawend', sessionId });
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
	<title>Signer votre e-Photo - IDidem</title>
	<script src="https://meet.jit.si/external_api.js"></script>
</svelte:head>

<main class="signer-page">
	<div class="split-signer-container">
		
		<!-- Panel visioconférence Jitsi -->
		<div class="video-panel">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
				<h2>Votre photographe en direct</h2>
				<button class="reload-btn" onclick={() => window.location.reload()}>
					🔄 Reconnecter
				</button>
			</div>
			<div id="jitsi-container" class="jitsi-frame"></div>
		</div>

		<!-- Panel Signature Pad -->
		<div class="signer-container">
			<header class="signer-header">
				<h1>IDidem</h1>
				<p class="status" class:connected={isConnected}>{status}</p>
			</header>

			<div class="instructions">
				<h3>Signez dans le cadre ci-dessous</h3>
				<p>Utilisez votre doigt ou un stylet. Suivez les instructions du photographe en direct.</p>
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
				<button class="clear-btn" onclick={handleClear}>Effacer</button>
				<button class="confirm-btn" disabled={!isConnected} onclick={() => alert('Signature validée !')}>
					Confirmer ma signature
				</button>
			</div>
		</div>

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
	}
	.split-signer-container {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
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
	.video-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 480px;
	}
	.video-panel h2 {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--white);
		margin: 0;
	}
	.jitsi-frame {
		flex: 1;
		background: #0f172a;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: var(--shadow-inner);
	}
	.signer-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	@media (max-width: 900px) {
		.split-signer-container {
			grid-template-columns: 1fr;
			padding: 1.5rem;
			gap: 1.5rem;
		}
		.video-panel {
			min-height: 280px;
		}
	}
	.reload-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: var(--white);
		padding: 0.4rem 0.8rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.8rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		transition: var(--transition-fast);
	}
	.reload-btn:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.4);
	}
	.signer-header {
		text-align: center;
	}
	.signer-header h1 {
		color: var(--white);
		font-size: 2rem;
		font-weight: 800;
	}
	.status {
		font-size: 0.85rem;
		opacity: 0.8;
		margin-top: 0.25rem;
	}
	.status.connected {
		color: var(--green-400);
		opacity: 1;
		font-weight: 600;
	}
	.instructions {
		background: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		border-radius: var(--radius-md);
		text-align: center;
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	.instructions h3 {
		color: var(--white);
		font-size: 1.05rem;
		margin-bottom: 0.25rem;
	}
	.instructions p {
		font-size: 0.85rem;
		opacity: 0.9;
	}
	.pad-wrapper {
		height: 260px;
		border: 2px dashed rgba(255, 255, 255, 0.3);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}
	.actions {
		display: flex;
		gap: 1rem;
	}
	.clear-btn {
		flex: 1;
		background: rgba(255, 255, 255, 0.15);
		color: var(--white);
		padding: 0.9rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		transition: var(--transition-fast);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	.clear-btn:hover {
		background: rgba(255, 255, 255, 0.25);
	}
	.confirm-btn {
		flex: 2;
		background: var(--white);
		color: var(--blue-700);
		padding: 0.9rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		transition: var(--transition-fast);
		box-shadow: var(--shadow-md);
	}
	.confirm-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.confirm-btn:not(:disabled):hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}
</style>
