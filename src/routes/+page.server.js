/** @type {import('./$types').PageServerLoad} */
import { API_URL } from '$app/env/private';
import resolveConfig from 'tailwindcss/resolveConfig';
import configFile from '../../tailwind.config';
import { getSampleData } from '#lib/sampleData.ts';

async function fetchFuelprices() {
	if (!API_URL) return null;
	try {
		const res = await fetch(API_URL);
		return await res.json();
	} catch {
		return null;
	}
}

export async function load() {
	// Generated sample data if API_URL is unset or the API is unreachable (e.g. `npm run dev` without the backend)
	const fuelprices = (await fetchFuelprices()) ?? getSampleData();

	const tailwindConfig = resolveConfig(configFile);

	return { fuelprices, tailwindConfig };
}
