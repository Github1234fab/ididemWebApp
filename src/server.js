// src/server.js
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 5001;

// Suivi de la présence admin globale
let activeAdminsCount = 0;
let manualPresenceUntil = 0;

// Gestion des sessions de signature actives
// Structure : { [sessionId]: { clientSocket: ws, adminSocket: ws } }
/** @type {Record<string, { clientSocket?: any, adminSocket?: any }>} */
const sessions = {};

const server = createServer((req, res) => {
	// CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		res.end();
		return;
	}

	if (req.method === 'GET' && req.url === '/api/admin-presence') {
		const isAdminOnline = Date.now() < manualPresenceUntil || Object.values(sessions).some(s => s.adminSocket && s.adminSocket.readyState === 1); // 1 = OPEN
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ online: isAdminOnline }));
	} else {
		res.writeHead(404);
		res.end('Not Found');
	}
});

const wss = new WebSocketServer({ server });

console.log(`Serveur Pont de Signature IDidem actif sur le port ${PORT}...`);

wss.on('connection', (ws) => {
	/** @type {string | null} */
	let currentSessionId = null;
	/** @type {'client' | 'admin' | 'bridge' | null} */
	let connectionType = null;

	ws.on('message', (/** @type {any} */ message) => {
		try {
			const data = JSON.parse(message);

			switch (data.type) {
				case 'register-client':
					currentSessionId = data.sessionId;
					if (!currentSessionId) break;
					connectionType = 'client';
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}
					
					sessions[currentSessionId].clientSocket = ws;
					console.log(`[Session ${currentSessionId}] Client connecté`);
					
					// Notifier l'admin et le pont s'ils sont présents
					if (sessions[currentSessionId].adminSocket) {
						sessions[currentSessionId].adminSocket.send(JSON.stringify({
							type: 'client-status',
							connected: true
						}));
					}
					if (sessions[currentSessionId].bridgeSocket) {
						sessions[currentSessionId].bridgeSocket.send(JSON.stringify({
							type: 'client-status',
							connected: true
						}));
					}
					// Signaler aussi au client que l'admin est là
					ws.send(JSON.stringify({ type: 'admin-status', connected: !!sessions[currentSessionId].adminSocket }));
					break;

				case 'register-admin':
					currentSessionId = data.sessionId;
					if (!currentSessionId) break;
					connectionType = 'admin';
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}
					
					if (!sessions[currentSessionId].adminSocket) {
						activeAdminsCount++;
						console.log(`Admin connecté. Total admins en ligne: ${activeAdminsCount}`);
					}

					sessions[currentSessionId].adminSocket = ws;
					console.log(`[Session ${currentSessionId}] Admin web connecté`);
					
					// Signaler le statut du client à l'admin et renvoyer le statut de présence manuelle
					ws.send(JSON.stringify({
						type: 'client-status',
						connected: !!sessions[currentSessionId].clientSocket
					}));
					ws.send(JSON.stringify({
						type: 'manual-presence-status',
						online: Date.now() < manualPresenceUntil,
						until: manualPresenceUntil
					}));
					break;

				case 'register-bridge':
					currentSessionId = data.sessionId;
					if (!currentSessionId) break;
					connectionType = 'bridge';
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}

					sessions[currentSessionId].bridgeSocket = ws;
					console.log(`[Session ${currentSessionId}] Pont Bureau (simulate.js) connecté`);
					
					// Signaler le statut du client au pont Bureau
					ws.send(JSON.stringify({
						type: 'client-status',
						connected: !!sessions[currentSessionId].clientSocket
					}));
					break;

				case 'check-admin-presence':
					const anyAdminOnline = Date.now() < manualPresenceUntil || Object.values(sessions).some(
						s => s.adminSocket && s.adminSocket.readyState === 1 // 1 = OPEN
					);
					ws.send(JSON.stringify({
						type: 'admin-presence-response',
						online: anyAdminOnline
					}));
					break;

				case 'set-manual-presence':
					if (data.online) {
						// Disponible pour 6 heures (21600000 ms)
						manualPresenceUntil = Date.now() + 21600000;
					} else {
						manualPresenceUntil = 0;
					}
					console.log(`Statut de disponibilité manuelle mis à jour : ${data.online ? 'En Ligne (6h)' : 'Hors-Ligne'}`);
					
					// Envoyer la confirmation à l'admin
					ws.send(JSON.stringify({
						type: 'manual-presence-status',
						online: Date.now() < manualPresenceUntil,
						until: manualPresenceUntil
					}));
					break;

				case 'instant-call-request':
					console.log(`[Appel Entrant] Client demande signature instantanée pour la session: ${data.sessionId}`);
					
					// Envoyer la notification push système sur le canal ntfy
					const ntfyChannel = process.env.NTFY_CHANNEL || 'ididem-calls-alerts-f2x';
					fetch(`https://ntfy.sh/${ntfyChannel}`, {
						method: 'POST',
						body: `Client : ${data.email || 'Client e-Photo'}`,
						headers: {
							'Title': '📞 IDidem - Appel Entrant',
							'Priority': '5',
							'Tags': 'phone,bell',
							'Actions': `view, Rejoindre la session, https://ididemwebapp.netlify.app/admin/sign-bridge?session_id=${data.sessionId}`
						}
					})
					.then(res => console.log(`Notification ntfy envoyée. Statut: ${res.status}`))
					.catch(err => console.error('Erreur d\'envoi ntfy:', err));

					Object.values(sessions).forEach(session => {
						if (session.adminSocket && session.adminSocket.readyState === ws.OPEN) {
							session.adminSocket.send(JSON.stringify({
								type: 'incoming-call',
								sessionId: data.sessionId,
								clientEmail: data.email || 'Client'
							}));
						}
					});
					break;

				// Relais en temps réel des événements de dessin
				case 'drawstart':
				case 'draw':
				case 'drawend':
					if (currentSessionId && sessions[currentSessionId]) {
						if (connectionType === 'client') {
							// Envoyer le dessin au site admin ET au pont bureau
							const admin = sessions[currentSessionId].adminSocket;
							if (admin && admin.readyState === ws.OPEN) {
								admin.send(JSON.stringify(data));
							}
							const bridge = sessions[currentSessionId].bridgeSocket;
							if (bridge && bridge.readyState === ws.OPEN) {
								bridge.send(JSON.stringify(data));
							}
						}
					}
					break;

				case 'clear':
					if (currentSessionId && sessions[currentSessionId]) {
						const session = sessions[currentSessionId];
						if (connectionType !== 'client' && session.clientSocket && session.clientSocket.readyState === ws.OPEN) {
							session.clientSocket.send(JSON.stringify(data));
						}
						if (connectionType !== 'admin' && session.adminSocket && session.adminSocket.readyState === ws.OPEN) {
							session.adminSocket.send(JSON.stringify(data));
						}
						if (connectionType !== 'bridge' && session.bridgeSocket && session.bridgeSocket.readyState === ws.OPEN) {
							session.bridgeSocket.send(JSON.stringify(data));
						}
					}
					break;

				case 'reload-jitsi':
					if (currentSessionId && sessions[currentSessionId]) {
						const session = sessions[currentSessionId];
						if (session.clientSocket && session.clientSocket.readyState === ws.OPEN) {
							session.clientSocket.send(JSON.stringify({ type: 'reload-jitsi' }));
						}
					}
					break;

				case 'chat':
					if (currentSessionId && sessions[currentSessionId]) {
						const session = sessions[currentSessionId];
						// Le chat se fait strictement entre le téléphone (client) et le tableau de bord (admin)
						if (connectionType === 'client') {
							const admin = session.adminSocket;
							if (admin && admin.readyState === ws.OPEN) {
								admin.send(JSON.stringify(data));
							}
						} else if (connectionType === 'admin') {
							const client = session.clientSocket;
							if (client && client.readyState === ws.OPEN) {
								client.send(JSON.stringify(data));
							}
						}
					}
					break;
			}
		} catch (err) {
			console.error('Erreur de décodage du message:', err);
		}
	});

	ws.on('close', () => {
		if (currentSessionId && sessions[currentSessionId]) {
			const session = sessions[currentSessionId];
			if (connectionType === 'client') {
				console.log(`[Session ${currentSessionId}] Client déconnecté`);
				session.clientSocket = null;
				if (session.adminSocket) {
					session.adminSocket.send(JSON.stringify({
						type: 'client-status',
						connected: false
					}));
				}
				if (session.bridgeSocket) {
					session.bridgeSocket.send(JSON.stringify({
						type: 'client-status',
						connected: false
					}));
				}
			} else if (connectionType === 'admin') {
				console.log(`[Session ${currentSessionId}] Admin web déconnecté`);
				if (session.adminSocket) {
					activeAdminsCount = Math.max(0, activeAdminsCount - 1);
					console.log(`Admin déconnecté. Total admins en ligne: ${activeAdminsCount}`);
				}
				session.adminSocket = null;
			} else if (connectionType === 'bridge') {
				console.log(`[Session ${currentSessionId}] Pont Bureau (simulate.js) déconnecté`);
				session.bridgeSocket = null;
			}

			// Nettoyer la session si vide
			if (!session.clientSocket && !session.adminSocket && !session.bridgeSocket) {
				delete sessions[currentSessionId];
			}
		}
	});
});

server.listen(PORT);
