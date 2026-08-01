<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Remonter en haut de la page à chaque changement de route
	$effect(() => {
		$page.url.pathname;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});
</script>

<Header />
{@render children()}
<Footer />
