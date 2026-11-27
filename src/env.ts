import { defineEnvVars } from '@sveltejs/kit/env';

// All variables are read when the server starts (not at build time), so one image works for every deployment.
// Each is optional: without API_URL the page shows sample data, without the ntfy values the subscribe button is hidden.
const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	API_URL: {
		description: 'Base URL of fuelprices-api, e.g. http://fuelprices-api:30011',
		schema: optional
	},
	PUBLIC_NTFY_URL: {
		public: true,
		description: 'Public URL of the ntfy server, used by the "Preisalarme abonnieren" button',
		schema: optional
	},
	PUBLIC_NTFY_TOPIC: {
		public: true,
		description: 'ntfy topic the "Preisalarme abonnieren" button links to',
		schema: optional
	}
});
