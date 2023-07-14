/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	let fuelprices;

	await fetch('http://api.fuelprices.box').then((res) => (fuelprices = res.json()));

	return { fuelprices };
}
