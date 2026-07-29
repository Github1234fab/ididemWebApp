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
	let isClient = false;

	ws.on('message', (/** @type {any} */ message) => {
		try {
			const data = JSON.parse(message);

			switch (data.type) {
				case 'register-client':
					currentSessionId = data.sessionId;
					if (!currentSessionId) break;
					isClient = true;
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}
					
					sessions[currentSessionId].clientSocket = ws;
					console.log(`[Session ${currentSessionId}] Client connecté`);
					
					// Notifier l'admin si présent
					if (sessions[currentSessionId].adminSocket) {
						sessions[currentSessionId].adminSocket.send(JSON.stringify({
							type: 'client-status',
							connected: true
						}));
						// Signaler aussi au client que l'admin est là
						ws.send(JSON.stringify({ type: 'admin-status', connected: true }));
					}
					break;

				case 'register-admin':
					currentSessionId = data.sessionId;
					if (!currentSessionId) break;
					isClient = false;
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}
					
					// Si l'admin n'était pas déjà connecté sur cette session spécifique
					if (!sessions[currentSessionId].adminSocket) {
						activeAdminsCount++;
						console.log(`Admin connecté. Total admins en ligne: ${activeAdminsCount}`);
					}

					sessions[currentSessionId].adminSocket = ws;
					console.log(`[Session ${currentSessionId}] Admin connecté`);
					
					// Signaler le statut du client à l'admin et renvoyer le statut de présence manuelle
					const clientExists = !!sessions[currentSessionId].clientSocket;
					ws.send(JSON.stringify({
						type: 'client-status',
						connected: clientExists
					}));
					ws.send(JSON.stringify({
						type: 'manual-presence-status',
						online: Date.now() < manualPresenceUntil,
						until: manualPresenceUntil
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
				case 'clear':
					if (currentSessionId && sessions[currentSessionId]) {
						const targetSocket = isClient 
							? sessions[currentSessionId].adminSocket 
							: sessions[currentSessionId].clientSocket;
							
						if (targetSocket && targetSocket.readyState === ws.OPEN) {
							targetSocket.send(JSON.stringify(data));
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
			if (isClient) {
				console.log(`[Session ${currentSessionId}] Client déconnecté`);
				sessions[currentSessionId].clientSocket = null;
				if (sessions[currentSessionId].adminSocket) {
					sessions[currentSessionId].adminSocket.send(JSON.stringify({
						type: 'client-status',
						connected: false
					}));
				}
			} else {
				console.log(`[Session ${currentSessionId}] Admin déconnecté`);
				if (sessions[currentSessionId].adminSocket) {
					activeAdminsCount = Math.max(0, activeAdminsCount - 1);
					console.log(`Admin déconnecté. Total admins en ligne: ${activeAdminsCount}`);
				}
				sessions[currentSessionId].adminSocket = null;
			}

			// Nettoyer la session si vide
			if (!sessions[currentSessionId].clientSocket && !sessions[currentSessionId].adminSocket) {
				delete sessions[currentSessionId];
			}
		}
	});
});

server.listen(PORT);
