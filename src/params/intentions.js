// src/params/intentions.js

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return [
		'photo-identite-en-ligne',
		'e-photo-ANTS-en-ligne',
		'photo-passeport-en-ligne',
		'photo-carte-identite-en-ligne',
		'portrait-professionnel-en-ligne'
	].includes(param);
}
