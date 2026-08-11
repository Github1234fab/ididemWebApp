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
	let messages = $state([]);
	let newChatMessage = $state('');
	/** @type {HTMLDivElement} */
	let chatContainer;

	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

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
				} else if (data.type === 'chat') {
					console.log('Chat reçu côté client:', data);
					messages = [...messages, {
						sender: 'admin',
						text: data.text,
						time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					}];
					setTimeout(scrollToBottom, 50);
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

		return () => {
			if (socket) socket.close();
		};
	});

	function handleSendChat(event) {
		event.preventDefault();
		if (!newChatMessage.trim()) return;

		const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		const msg = {
			type: 'chat',
			sessionId,
			sender: 'client',
			text: newChatMessage,
			time
		};

		messages = [...messages, { sender: 'client', text: newChatMessage, time }];
		sendMsg(msg);
		newChatMessage = '';
		setTimeout(scrollToBottom, 50);
	}

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
	<div class="split-signer-container">
		
		<!-- Panel Chat en direct -->
		<div class="chat-panel">
			<div class="chat-header">
				<h2>💬 Message en direct</h2>
				<span class="chat-status-indicator" class:online={isConnected}>
					{isConnected ? 'Connecté' : 'Hors ligne'}
				</span>
			</div>
			
			<div class="chat-messages" bind:this={chatContainer}>
				{#each messages as msg}
					<div class="message-bubble" class:mine={msg.sender === 'client'}>
						<span class="sender-name">{msg.sender === 'client' ? 'Vous' : 'Photographe'}</span>
						<p class="message-text">{msg.text}</p>
						<span class="message-time">{msg.time}</span>
					</div>
				{/each}
				{#if messages.length === 0}
					<div class="chat-placeholder">
						<p>Discutez ici en temps réel avec le photographe.</p>
					</div>
				{/if}
			</div>

			<form class="chat-input-area" onsubmit={handleSendChat}>
				<input 
					type="text" 
					placeholder="Écrivez votre message..." 
					bind:value={newChatMessage} 
					disabled={!isConnected}
				/>
				<button type="submit" disabled={!isConnected || !newChatMessage.trim()}>
					Envoyer
				</button>
			</form>
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
	.chat-panel {
		display: flex;
		flex-direction: column;
		background: rgba(15, 23, 42, 0.4);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.15);
		min-height: 400px;
		height: 100%;
		overflow: hidden;
	}
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(15, 23, 42, 0.2);
	}
	.chat-header h2 {
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0;
	}
	.chat-status-indicator {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.15);
	}
	.chat-status-indicator.online {
		background: rgba(34, 197, 94, 0.25);
		color: var(--green-400);
		font-weight: 600;
	}
	.chat-messages {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 250px;
		max-height: 340px;
	}
	.message-bubble {
		max-width: 80%;
		padding: 0.6rem 0.8rem;
		border-radius: 12px;
		font-size: 0.9rem;
		line-height: 1.4;
		display: flex;
		flex-direction: column;
		background: rgba(255, 255, 255, 0.1);
		align-self: flex-start;
		border-bottom-left-radius: 2px;
	}
	.message-bubble.mine {
		background: var(--blue-600);
		color: var(--white);
		align-self: flex-end;
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 2px;
	}
	.sender-name {
		font-size: 0.7rem;
		font-weight: 700;
		opacity: 0.6;
		margin-bottom: 0.15rem;
	}
	.message-text {
		margin: 0;
		word-break: break-word;
	}
	.message-time {
		font-size: 0.6rem;
		opacity: 0.5;
		align-self: flex-end;
		margin-top: 0.25rem;
	}
	.chat-placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		text-align: center;
		opacity: 0.5;
		font-size: 0.9rem;
		padding: 2rem;
		color: var(--white);
	}
	.chat-input-area {
		display: flex;
		padding: 0.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		gap: 0.5rem;
		background: rgba(15, 23, 42, 0.2);
	}
	.chat-input-area input {
		flex: 1;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		color: var(--white);
		padding: 0.6rem 0.8rem;
		font-size: 0.9rem;
		transition: var(--transition-fast);
	}
	.chat-input-area input:focus {
		outline: none;
		border-color: var(--blue-400);
		background: rgba(255, 255, 255, 0.12);
	}
	.chat-input-area button {
		background: var(--white);
		color: var(--blue-900);
		border: none;
		padding: 0.6rem 1rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}
	.chat-input-area button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.chat-input-area button:not(:disabled):hover {
		background: var(--blue-100);
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
		.chat-panel {
			min-height: 300px;
		}
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
