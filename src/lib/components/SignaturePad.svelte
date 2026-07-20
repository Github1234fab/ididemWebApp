<!-- src/lib/components/SignaturePad.svelte -->
<script>
	import { onMount } from 'svelte';

	// Svelte 5 callback props
	let { 
		ondrawstart = () => {}, 
		ondraw = () => {}, 
		ondrawend = () => {}, 
		onclear = () => {} 
	} = $props();
	
	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D} */
	let ctx;
	let drawing = false;

	export function clear() {
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			onclear();
		}
	}

	onMount(() => {
		// On force des dimensions internes fixes et propres (proportionnelles à Easy Photo)
		canvas.width = 500;
		canvas.height = 250;

		ctx = canvas.getContext('2d');
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	});

	/**
	 * @param {MouseEvent | TouchEvent} event
	 */
	function getCoords(event) {
		const rect = canvas.getBoundingClientRect();
		
		// Support mobile tactile amélioré (changedTouches et targetTouches)
		let clientX = 0;
		let clientY = 0;
		
		if ('touches' in event && event.touches.length > 0) {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		} else if ('changedTouches' in event && event.changedTouches.length > 0) {
			clientX = event.changedTouches[0].clientX;
			clientY = event.changedTouches[0].clientY;
		} else {
			clientX = event.clientX;
			clientY = event.clientY;
		}
		
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		// Coordonnées normalisées
		return {
			rawX: x,
			rawY: y,
			normX: x / rect.width,
			normY: y / rect.height
		};
	}

	let lastX = 0;
	let lastY = 0;

	/**
	 * @param {MouseEvent | TouchEvent} event
	 */
	function handleStart(event) {
		event.preventDefault();
		drawing = true;
		const coords = getCoords(event);
		
		// Forcer le contexte et le style de dessin
		if (!ctx) ctx = canvas.getContext('2d');
		ctx.strokeStyle = '#0f172a';
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		
		lastX = coords.rawX;
		lastY = coords.rawY;
		
		ondrawstart({ x: coords.normX, y: coords.normY });
	}

	/**
	 * @param {MouseEvent | TouchEvent} event
	 */
	function handleMove(event) {
		if (!drawing) return;
		event.preventDefault();
		const coords = getCoords(event);
		
		if (!ctx) ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle = '#000000'; // Noir pur
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(coords.rawX, coords.rawY);
		ctx.stroke();
		
		lastX = coords.rawX;
		lastY = coords.rawY;
		
		ondraw({ x: coords.normX, y: coords.normY });
	}

	function handleEnd() {
		if (!drawing) return;
		drawing = false;
		ondrawend();
	}
</script>

<div class="pad-container">
	<canvas
		bind:this={canvas}
		onmousedown={handleStart}
		onmousemove={handleMove}
		onmouseup={handleEnd}
		onmouseleave={handleEnd}
		ontouchstart={handleStart}
		ontouchmove={handleMove}
		ontouchend={handleEnd}
	></canvas>
</div>

<style>
	.pad-container {
		width: 100%;
		height: 100%;
		min-height: 250px;
		position: relative;
		background: #ffffff;
		border-radius: var(--radius-md);
		overflow: hidden;
		touch-action: none;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 250px;
		cursor: crosshair;
	}
</style>
