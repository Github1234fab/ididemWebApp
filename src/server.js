// src/server.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5001 });

// Gestion des sessions de signature actives
// Structure : { [sessionId]: { clientSocket: ws, adminSocket: ws } }
const sessions = {};

console.log('Serveur Pont de Signature IDidem actif sur le port 5001...');

wss.on('connection', (ws) => {
	let currentSessionId = null;
	let isClient = false;

	ws.on('message', (message) => {
		try {
			const data = JSON.parse(message);

			switch (data.type) {
				case 'register-client':
					currentSessionId = data.sessionId;
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
					isClient = false;
					
					if (!sessions[currentSessionId]) {
						sessions[currentSessionId] = {};
					}
					
					sessions[currentSessionId].adminSocket = ws;
					console.log(`[Session ${currentSessionId}] Admin connecté`);
					
					// Signaler le statut du client à l'admin
					const clientExists = !!sessions[currentSessionId].clientSocket;
					ws.send(JSON.stringify({
						type: 'client-status',
						connected: clientExists
					}));
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
				sessions[currentSessionId].adminSocket = null;
			}

			// Nettoyer la session si vide
			if (!sessions[currentSessionId].clientSocket && !sessions[currentSessionId].adminSocket) {
				delete sessions[currentSessionId];
			}
		}
	});
});
