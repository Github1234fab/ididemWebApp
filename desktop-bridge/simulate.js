// desktop-bridge/simulate.js
import robot from 'robotjs';
import WebSocket from 'ws';

// Récupération de l'ID de session depuis l'argument de commande (ex: node simulate.js ID-XXXXXX)
const args = process.argv.slice(2);
let sessionId = args[0] || '1234';

// Config : utilise Render par défaut pour la prod, et localhost si le flag --local est présent
const isLocal = args.includes('--local');
const wsUrl = isLocal ? 'ws://localhost:5001' : 'wss://ididemwebapp.onrender.com';

// Coordonnées de calibration
let bounds = {
	topLeft: { x: 0, y: 0 },
	bottomRight: { x: 0, y: 0 },
	width: 0,
	height: 0
};

/**
 * Lance un compte à rebours visuel dans la console
 * @param {number} seconds Nombre de secondes
 * @param {string} message Message à afficher
 */
function countdown(seconds, message) {
	return new Promise((resolve) => {
		let current = seconds;
		console.log(`\n👉 ${message}`);
		
		const interval = setInterval(() => {
			if (current > 0) {
				process.stdout.write(`⏱️ Enregistrement dans ${current}... \r`);
				current--;
			} else {
				clearInterval(interval);
				console.log('📸 ENREGISTRÉ !                    \n');
				resolve();
			}
		}, 1000);
	});
}

async function calibrate() {
	console.log('\n=== CALIBRATION DU PONT DE SIGNATURE IDIDEM ===');
	console.log(`Session client ciblée : [${sessionId}]`);
	console.log('La calibration se fera automatiquement par compte à rebours. Ne cliquez pas sur le terminal.');
	
	// Étape 1 : Coin Haut-Gauche
	console.log('\n--- ÉTAPE 1 : COIN HAUT-GAUCHE ---');
	await countdown(10, 'Placez votre souris sur le coin HAUT-GAUCHE du cadre de dessin Easy Photo et laissez-la immobile...');
	bounds.topLeft = robot.getMousePos();
	console.log(`-> Position enregistrée : X = ${bounds.topLeft.x}, Y = ${bounds.topLeft.y}`);

	// Étape 2 : Coin Bas-Droit
	console.log('\n--- ÉTAPE 2 : COIN BAS-DROIT ---');
	await countdown(10, 'Déplacez maintenant votre souris sur le coin BAS-DROIT du cadre Easy Photo et laissez-la immobile...');
	bounds.bottomRight = robot.getMousePos();
	console.log(`-> Position enregistrée : X = ${bounds.bottomRight.x}, Y = ${bounds.bottomRight.y}`);

	// Calcul des dimensions de la zone cible
	bounds.width = bounds.bottomRight.x - bounds.topLeft.x;
	bounds.height = bounds.bottomRight.y - bounds.topLeft.y;

	console.log(`\n✅ Calibration terminée avec succès !`);
	console.log(`Zone cible : ${bounds.width}px x ${bounds.height}px.`);
	
	startBridgeConnection();
}

function startBridgeConnection() {
	console.log(`\nConnexion au pont de signature IDidem (${wsUrl})...`);
	const socket = new WebSocket(wsUrl);

	socket.on('open', () => {
		console.log(`Pont actif ! Écoute de la session client [${sessionId}]...`);
		socket.send(JSON.stringify({ type: 'register-bridge', sessionId }));
	});

	socket.on('message', (message) => {
		try {
			const data = JSON.parse(message);

			switch (data.type) {
				case 'client-status':
					console.log(data.connected ? '-> Client connecté en direct' : '-> Client déconnecté');
					break;

				case 'drawstart':
					// Calcul des coordonnées cibles sur ton écran Mac à partir des pourcentages (0->1) reçus du mobile
					const startX = Math.round(bounds.topLeft.x + (data.x * bounds.width));
					const startY = Math.round(bounds.topLeft.y + (data.y * bounds.height));
					console.log(`[DRAW_START] Reçu: x=${data.x.toFixed(3)}, y=${data.y.toFixed(3)} -> Cible Mac: X=${startX}, Y=${startY}`);
					
					robot.moveMouse(startX, startY);
					robot.mouseToggle('down', 'left'); // On enfonce le clic gauche
					break;

				case 'draw':
					const drawX = Math.round(bounds.topLeft.x + (data.x * bounds.width));
					const drawY = Math.round(bounds.topLeft.y + (data.y * bounds.height));
					console.log(`[DRAW_MOVE]  Reçu: x=${data.x.toFixed(3)}, y=${data.y.toFixed(3)} -> Cible Mac: X=${drawX}, Y=${drawY}`);
					
					robot.dragMouse(drawX, drawY); // On glisse la souris avec le clic enfoncé
					break;

				case 'drawend':
					robot.mouseToggle('up', 'left'); // On relâche le clic
					break;

				case 'clear':
					console.log('Nettoyage du cadre...');
					robot.mouseToggle('up', 'left');
					break;
			}
		} catch (err) {
			console.error('Erreur traitement message:', err);
		}
	});

	socket.on('close', () => {
		console.log('Connexion au pont perdue. Reconnexion...');
		setTimeout(startBridgeConnection, 3000);
	});

	socket.on('error', (err) => {
		console.error('Erreur pont de signature:', err.message);
	});
}

// Lancement du processus
calibrate();
