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
	/** @type {SignaturePad} */
	let pad;

	onMount(() => {
		// Connexion WebSocket en temps réel
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${protocol}//${window.location.hostname}:5001`;
		
		status = 'Connexion au serveur de signature...';
		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			isConnected = true;
			status = 'Prêt à signer';
			// S'enregistrer auprès du serveur avec l'identifiant de session
			sendMsg({ type: 'register-client', sessionId });
		};

		socket.onclose = () => {
			isConnected = false;
			status = 'Déconnecté du serveur';
		};

		socket.onerror = () => {
			isConnected = false;
			status = 'Erreur de connexion';
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
</svelte:head>

<main class="signer-page">
	<div class="signer-container">
		<header class="signer-header">
			<h1>IDidem</h1>
			<p class="status" class:connected={isConnected}>{status}</p>
		</header>

		<div class="instructions">
			<h3>Signez dans le cadre ci-dessous</h3>
			<p>Utilisez votre doigt ou un stylet. Restez bien à l'intérieur du cadre.</p>
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
			<button class="confirm-btn" disabled={!isConnected}>Confirmer ma signature</button>
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
		padding: 1.5rem;
		color: var(--white);
	}
	.signer-container {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
