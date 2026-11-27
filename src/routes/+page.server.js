/** @type {import('./$types').PageServerLoad} */
import { API_URL } from '$app/env/private';
import resolveConfig from 'tailwindcss/resolveConfig';
import configFile from '../../tailwind.config';

// Shown if API_URL is unset or the API is unreachable (e.g. `npm run dev` without the backend)
const sampleData = [
	{ timestamp: '2023-07-07T09:00:00Z', avanti: 1.42, jet: 1.41 },
	{ timestamp: '2023-07-07T10:00:00Z', avanti: 1.44, jet: 1.44 },
	{ timestamp: '2023-07-07T11:00:00Z', avanti: 1.43, jet: 1.44 },
	{ timestamp: '2023-07-07T12:00:00Z', avanti: 1.434, jet: 1.42 },
	{ timestamp: '2023-07-07T13:00:00Z', avanti: 1.51, jet: 1.53 },
	{ timestamp: '2023-07-14T09:00:00Z', avanti: 1.52, jet: 1.51 },
	{ timestamp: '2023-07-14T10:00:00Z', avanti: 1.55, jet: 1.54 },
	{ timestamp: '2023-07-14T11:00:00Z', avanti: 1.53, jet: 1.54 },
	{ timestamp: '2023-07-14T12:00:00Z', avanti: 1.535, jet: 1.52 },
	{ timestamp: '2023-07-14T13:00:00Z', avanti: 1.51, jet: 1.53 }
];

export async function load() {
	let fuelprices = sampleData;

	if (API_URL) {
		try {
			const res = await fetch(API_URL);
			fuelprices = await res.json();
		} catch {
			fuelprices = sampleData;
		}
	}

	const tailwindConfig = resolveConfig(configFile);

	return { fuelprices, tailwindConfig };
}
