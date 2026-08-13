<!-- src/lib/components/SignaturePad.svelte -->
<script>
	import { onMount } from 'svelte';

	// Svelte 5 callback props
	let { 
		ondrawstart = () => {}, 
		ondraw = () => {}, 
		ondrawend = () => {}, 
		onclear = () => {},
		methods = $bindable({})
	} = $props();
	
	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D | null} */
	let ctx = null;
	let drawing = false;

	let isCanvasEmpty = true;

	$effect(() => {
		methods.clear = clear;
		methods.isEmpty = isEmpty;
		methods.toDataURL = toDataURL;
	});

	export function clear() {
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			isCanvasEmpty = true;
			onclear();
		}
	}

	export function isEmpty() {
		return isCanvasEmpty;
	}

	export function toDataURL() {
		if (canvas) {
			return canvas.toDataURL("image/png");
		}
		return '';
	}

	onMount(() => {
		// On force des dimensions internes fixes et propres (proportionnelles à Easy Photo)
		canvas.width = 500;
		canvas.height = 250;

		ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
		}
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
			const mouseEvent = /** @type {MouseEvent} */ (event);
			clientX = mouseEvent.clientX;
			clientY = mouseEvent.clientY;
		}
		
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		// Ajuster les coordonnées brutes par rapport aux dimensions internes du canvas
		const rawX = x * (canvas.width / rect.width);
		const rawY = y * (canvas.height / rect.height);

		// Coordonnées normalisées (toujours entre 0 et 1)
		return {
			rawX,
			rawY,
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
		isCanvasEmpty = false;
		const coords = getCoords(event);
		
		// Forcer le contexte et le style de dessin
		if (!ctx) ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.strokeStyle = '#0f172a';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
		}
		
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
		if (ctx) {
			ctx.beginPath();
			ctx.strokeStyle = '#000000'; // Noir pur
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(coords.rawX, coords.rawY);
			ctx.stroke();
		}
		
		lastX = coords.rawX;
		lastY = coords.rawY;
		
		ondraw({ x: coords.normX, y: coords.normY });
	}

	function handleEnd() {
		if (!drawing) return;
		drawing = false;
		ondrawend();
	}
	// Cache refresh comment
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
