// Generates realistic-looking fuel prices for when the API is not available (e.g. `npm run dev`
// without the backend). The rows have the same shape as the API's `GET /` response.

export type FuelPriceRow = {
	timestamp: string;
	avanti: number | null;
	jet: number | null;
	jetLangenrohr: number | null;
	bp: number | null;
};

const SLOT_MS = 30 * 60 * 1000; // the collector runs every 30 minutes
const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = 400; // a bit more than a year, so "Jahr" is full and "Gesamt" is longer

// Small deterministic PRNG, so the curve stays the same between reloads
function mulberry32(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const viennaTime = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Europe/Vienna',
	weekday: 'short',
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23'
});

function localTime(date: Date) {
	const parts = Object.fromEntries(viennaTime.formatToParts(date).map((p) => [p.type, p.value]));
	return { weekday: parts.weekday, hour: Number(parts.hour), minute: Number(parts.minute) };
}

const round = (price: number) => Math.round(price * 1000) / 1000;

type Station = {
	offset: number; // distance to the market base price in €
	raiseChance: number; // chance to raise the price at a permitted time
	raiseMin: number;
	raiseMax: number;
	dropChance: number; // chance per half-hour (during the day) to lower the price
	dropShare: [number, number]; // a drop removes this share of the distance to the floor
};

// Modelled on the production chart: Avanti and Jet St. Pölten spike and fall in many small steps,
// Jet Langenrohr is cheaper with long flat stretches, BP is more expensive and changes rarely.
// Jet St. Pölten isn't simulated on its own: it follows Avanti, JET_OFFSET more expensive.
const JET_OFFSET = 0.003;
const STATIONS: Record<'avanti' | 'jetLangenrohr' | 'bp', Station> = {
	avanti: {
		offset: 0,
		raiseChance: 0.85,
		raiseMin: 0.06,
		raiseMax: 0.1,
		dropChance: 0.12,
		dropShare: [0.05, 0.2]
	},
	jetLangenrohr: {
		offset: -0.045,
		raiseChance: 0.5,
		raiseMin: 0.02,
		raiseMax: 0.07,
		dropChance: 0.025,
		dropShare: [0.3, 0.7]
	},
	bp: {
		offset: 0.02,
		raiseChance: 0.4,
		raiseMin: 0.01,
		raiseMax: 0.04,
		dropChance: 0.01,
		dropShare: [0.3, 0.6]
	}
};

export function generateSampleData(now = new Date()): FuelPriceRow[] {
	const end = Math.floor(now.getTime() / SLOT_MS) * SLOT_MS;
	// Start at a day boundary and seed with it: the data is stable for the whole day and only grows
	const start = Math.floor((end - DAYS * DAY_MS) / DAY_MS) * DAY_MS;
	const random = mulberry32(start / DAY_MS);
	const between = (min: number, max: number) => min + random() * (max - min);

	let base = 1.55; // market price level, slow random walk
	const prices = {
		...(Object.fromEntries(
			Object.entries(STATIONS).map(([key, s]) => [key, base + s.offset])
		) as Record<keyof typeof STATIONS, number>),
		jet: base + JET_OFFSET
	};
	let bpGap = 0; // BP is sometimes missing for a few hours, like in production

	const rows: FuelPriceRow[] = [];
	for (let t = start; t <= end; t += SLOT_MS) {
		const date = new Date(t);
		const { weekday, hour, minute } = localTime(date);

		// Base price: daily random walk plus a gentle seasonal swing, kept in a realistic range
		if (hour === 0 && minute === 0) {
			base += between(-0.006, 0.006) + (1.55 - base) * 0.02; // pulled back towards 1.55
			base = Math.min(1.72, Math.max(1.42, base));
		}
		const season = 0.03 * Math.sin((2 * Math.PI * t) / (365 * DAY_MS));

		// In Austria, prices may only be raised at 12:00 on Monday, Wednesday and Friday
		const raiseAllowed = hour === 12 && minute === 0 && ['Mon', 'Wed', 'Fri'].includes(weekday);
		const daytime = hour >= 6 && hour < 22;
		const raiseNoise = between(0, 1);

		for (const [key, s] of Object.entries(STATIONS) as [keyof typeof STATIONS, Station][]) {
			const floor = base + season + s.offset;
			let price = prices[key];
			if (raiseAllowed && random() < s.raiseChance) {
				price = Math.max(price, floor) + s.raiseMin + raiseNoise * (s.raiseMax - s.raiseMin);
			} else if (
				daytime &&
				price > floor + 0.001 &&
				// the further above the floor, the faster the price falls (spikes are short)
				random() < s.dropChance * (1 + (price - floor) / 0.015)
			) {
				const share = between(...s.dropShare);
				price = Math.max(floor, price - Math.max(0.001, (price - floor) * share));
			}
			prices[key] = price;
		}
		// Jet St. Pölten follows Avanti, sometimes half an hour late (outside 12:00 that only lowers it)
		if (raiseAllowed || random() < 0.6) prices.jet = prices.avanti + JET_OFFSET;

		if (bpGap > 0) bpGap--;
		else if (random() < 0.003) bpGap = 2 + Math.floor(random() * 8);

		rows.push({
			timestamp: date.toISOString(),
			avanti: round(prices.avanti),
			jet: round(prices.jet),
			jetLangenrohr: round(prices.jetLangenrohr),
			bp: bpGap > 0 ? null : round(prices.bp)
		});
	}
	return rows;
}

// Generating ~19,000 rows is cheap, but only redo it when a new half-hour slot has started
let cache: { slot: number; rows: FuelPriceRow[] } | undefined;

export function getSampleData(now = new Date()): FuelPriceRow[] {
	const slot = Math.floor(now.getTime() / SLOT_MS);
	if (cache?.slot !== slot) cache = { slot, rows: generateSampleData(now) };
	return cache.rows;
}
