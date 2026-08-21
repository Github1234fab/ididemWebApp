// desktop-bridge/simulate.js
import robot from 'robotjs';
import WebSocket from 'ws';
import readline from 'readline';

function askQuestion(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => rl.question(query, (ans) => {
		rl.close();
		resolve(ans.trim().toLowerCase());
	}));
}

// Récupération de l'ID de session depuis l'argument de commande (ex: node simulate.js ID-XXXXXX)
const args = process.argv.slice(2);
let sessionId = args[0] || '1234';

// Config : local ou production
const isLocal = args.includes('--local');
const apiDomain = isLocal ? 'http://localhost:5173' : 'https://ididem.com';
const wsUrl = isLocal ? 'ws://localhost:5001' : 'wss://ididemwebapp.onrender.com';

// Coordonnées de calibration
let bounds = {
	topLeft: { x: 0, y: 0 },
	bottomRight: { x: 0, y: 0 },
	width: 0,
	height: 0
};

// Historique des coordonnées chargées depuis le serveur
let savedCoords = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
				process.stdout.write(`⏱️ Action dans ${current}... \r`);
				current--;
			} else {
				clearInterval(interval);
				console.log('📸 ENREGISTRÉ !                    \n');
				resolve();
			}
		}, 1000);
	});
}

// 1. Récupérer les coordonnées de signature depuis le serveur
async function fetchSignatureCoords() {
	const apiUrl = `${apiDomain}/api/get-signature-coords?sessionId=${sessionId}`;
	console.log(`\n[Replay] Téléchargement du tracé depuis : ${apiUrl}...`);

	try {
		const res = await fetch(apiUrl);
		if (!res.ok) {
			if (res.status === 404) {
				throw new Error("Aucun tracé de signature trouvé pour cette session.");
			}
			throw new Error(`Erreur API (${res.status} ${res.statusText})`);
		}

		const data = await res.json();
		savedCoords = data.coords || [];
		console.log(`[Replay] Tracé récupéré avec succès : ${savedCoords.length} points de dessin trouvés.`);
		
		if (savedCoords.length === 0) {
			console.log("⚠️ Le tracé est vide. Rien à rejouer.");
			process.exit(0);
		}

		// Lancer la calibration puis le replay
		await calibrate();
	} catch (err) {
		console.error("\n❌ Impossible de récupérer la signature :", err.message);
		console.log("Assurez-vous que le client a bien validé sa signature sur son écran.");
		process.exit(1);
	}
}

// 2. Calibrer la zone écran de dessin Easy Photo
async function calibrate() {
	console.log('\n=== CALIBRATION DU PONT DE REPLAY IDIDEM ===');
	console.log(`Session client ciblée : [${sessionId}]`);
	console.log('La calibration se fera par compte à rebours. Placez votre curseur aux bons endroits.');
	
	// Étape 1 : Coin Haut-Gauche
	console.log('\n--- ÉTAPE 1 : COIN HAUT-GAUCHE ---');
	await countdown(6, 'Placez votre souris sur le coin HAUT-GAUCHE du cadre de dessin Easy Photo et laissez-la immobile...');
	bounds.topLeft = robot.getMousePos();
	console.log(`-> Position enregistrée : X = ${bounds.topLeft.x}, Y = ${bounds.topLeft.y}`);

	// Étape 2 : Coin Bas-Droit
	console.log('\n--- ÉTAPE 2 : COIN BAS-DROIT ---');
	await countdown(6, 'Déplacez maintenant votre souris sur le coin BAS-DROIT du cadre Easy Photo et laissez-la immobile...');
	bounds.bottomRight = robot.getMousePos();
	console.log(`-> Position enregistrée : X = ${bounds.bottomRight.x}, Y = ${bounds.bottomRight.y}`);

	// Calcul des dimensions de la zone cible
	bounds.width = bounds.bottomRight.x - bounds.topLeft.x;
	bounds.height = bounds.bottomRight.y - bounds.topLeft.y;

	console.log(`\n✅ Calibration terminée ! Zone cible : ${bounds.width}px x ${bounds.height}px.`);
	
	// Attendre un peu puis exécuter le replay automatique
	await startReplay();
}

// 3. Rejouer les coordonnées physiques sur l'écran
async function startReplay() {
	console.log("\n=== DÉMARRAGE DU REPLAY AUTOMATIQUE DE LA SIGNATURE ===");
	console.log("⚠️ Ne touchez pas à votre souris pendant l'exécution (durée estimée : 3-5 secondes)...");
	await countdown(3, "Début du tracé de la signature...");

	for (let i = 0; i < savedCoords.length; i++) {
		const step = savedCoords[i];

		try {
			if (step.type === 'drawstart') {
				const startX = Math.round(bounds.topLeft.x + (step.x * bounds.width));
				const startY = Math.round(bounds.topLeft.y + (step.y * bounds.height));
				robot.moveMouse(startX, startY);
				robot.mouseToggle('down', 'left'); // Enfoncer le clic
			} else if (step.type === 'draw') {
				const drawX = Math.round(bounds.topLeft.x + (step.x * bounds.width));
				const drawY = Math.round(bounds.topLeft.y + (step.y * bounds.height));
				robot.dragMouse(drawX, drawY); // Dessiner
			} else if (step.type === 'drawend') {
				robot.mouseToggle('up', 'left'); // Relâcher le clic
			}
		} catch (e) {
			console.error("Erreur de simulation souris:", e);
		}

		// Délai de 8ms entre chaque point pour donner un rendu de tracé fluide et naturel
		await sleep(8);
	}

	// S'assurer que le clic est bien relâché à la fin
	robot.mouseToggle('up', 'left');
	console.log("\n🎉 Replay de la signature terminé avec succès !");

	if (sessionId.startsWith('urface_')) {
		console.log("\nℹ️ Session URFace détectée. Pas de paiement Stripe à capturer (débité via Apple/Google In-App Purchases).");
		process.exit(0);
	}

	const answer = await askQuestion("\n❓ La signature a-t-elle été dessinée correctement ? Capturer le paiement Stripe ? (y/n) : ");
	if (answer === 'y' || answer === 'yes') {
		console.log(`\n[Payment] Tentative de capture du paiement pour la session ${sessionId}...`);
		try {
			const captureUrl = `${apiDomain}/api/capture-payment`;
			const res = await fetch(captureUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId })
			});
			const result = await res.json();
			if (res.ok && result.success) {
				console.log(`✅ Paiement Stripe capturé avec succès ! (Statut: ${result.status})`);
			} else {
				console.error(`❌ Échec de capture du paiement : ${result.error || 'Erreur inconnue'}`);
			}
		} catch (err) {
			console.error(`❌ Erreur réseau lors de la capture du paiement : ${err.message}`);
		}
	} else {
		console.log("\n⚠️ Capture de paiement ignorée. Le client n'a PAS été débité.");
	}

	process.exit(0);
}

// Lancement du processus en allant chercher les coordonnées d'abord
fetchSignatureCoords();
