import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { image } = await request.json();
		if (!image) {
			return json({ error: 'No image provided' }, { status: 400 });
		}

		// Convert base64 to binary buffer
		const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');

		// Prepare FormData for Photoroom API
		const formData = new FormData();
		formData.append('crop', 'false');
		formData.append('format', 'png');

		// Wrap buffer in standard Blob for Node 18+ fetch compatibility
		const blob = new Blob([buffer], { type: 'image/jpeg' });
		formData.append('image_file', blob, 'photo.jpg');

		// Get API Key from environment or fallback to default
		const apiKey = env.PHOTOROOM_API_KEY || 'sk_pr_default_3485625a30ea93e0c8a4f1fae777bd91a70ebe1b';

		console.log('Sending photo to Photoroom API for background removal...');
		const response = await fetch('https://sdk.photoroom.com/v1/segment', {
			method: 'POST',
			headers: {
				'x-api-key': apiKey
			},
			body: formData
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Photoroom API returned an error:', response.status, errorText);
			return json({ error: `Photoroom API Error: ${response.status} - ${errorText}` }, { status: response.status });
		}

		const arrayBuffer = await response.arrayBuffer();
		const base64Result = Buffer.from(arrayBuffer).toString('base64');

		return json({
			image: `data:image/png;base64,${base64Result}`
		});

	} catch (err) {
		console.error('Error during background removal:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}
