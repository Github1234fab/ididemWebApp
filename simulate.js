// simulate.js
import robot from 'robotjs';
import WebSocket from 'ws';
import readline from 'readline';

// Config
const wsUrl = 'ws://localhost:5001';
const sessionId = '1234'; // Doit correspondre à la session de l'admin et du client

// Coordonnées de calibration de ton cadre Easy Photo sur ton écran Mac
let bounds = {
	topLeft: { x: 0, y: 0 },
	bottomRight: { x: 0, y: 0 },
	width: 0,
	height: 0
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

async function calibrate() {
	console.log('\n=== CALIBRATION DU PONT DE SIGNATURE IDIDEM ===');
	console.log('Nous allons enregistrer la position de votre cadre de signature Easy Photo.');
	
	// Étape 1 : Coin Haut-Gauche
	await question('\n1. Placez votre souris physique sur le coin HAUT-GAUCHE du cadre de dessin Easy Photo, puis appuyez sur ENTREE...');
	bounds.topLeft = robot.getMousePos();
	console.log(`-> Enregistré : X = ${bounds.topLeft.x}, Y = ${bounds.topLeft.y}`);

	// Étape 2 : Coin Bas-Droit
	await question('\n2. Placez maintenant votre souris physique sur le coin BAS-DROIT du cadre de dessin Easy Photo, puis appuyez sur ENTREE...');
	bounds.bottomRight = robot.getMousePos();
	console.log(`-> Enregistré : X = ${bounds.bottomRight.x}, Y = ${bounds.bottomRight.y}`);

	// Calcul des dimensions de la zone cible
	bounds.width = bounds.bottomRight.x - bounds.topLeft.x;
	bounds.height = bounds.bottomRight.y - bounds.topLeft.y;

	console.log(`\nCalibration terminée avec succès ! Zone de signature détectée : ${bounds.width}px x ${bounds.height}px.`);
	rl.close();
	
	startBridgeConnection();
}

function startBridgeConnection() {
	console.log(`\nConnexion au pont de signature IDidem (${wsUrl})...`);
	const socket = new WebSocket(wsUrl);

	socket.on('open', () => {
		console.log(`Pont actif ! Écoute de la session client [${sessionId}]...`);
		socket.send(JSON.stringify({ type: 'register-admin', sessionId }));
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
					const startX = bounds.topLeft.x + (data.x * bounds.width);
					const startY = bounds.topLeft.y + (data.y * bounds.height);
					
					robot.moveMouse(startX, startY);
					robot.mouseToggle('down', 'left'); // On enfonce le clic gauche
					break;

				case 'draw':
					const drawX = bounds.topLeft.x + (data.x * bounds.width);
					const drawY = bounds.topLeft.y + (data.y * bounds.height);
					
					robot.dragMouse(drawX, drawY); // On glisse la souris avec le clic enfoncé
					break;

				case 'drawend':
					robot.mouseToggle('up', 'left'); // On relâche le clic
					break;

				case 'clear':
					console.log('Nettoyage du cadre...');
					// Optionnel : on peut faire cliquer le script sur le bouton effacer d'Easy Photo
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
