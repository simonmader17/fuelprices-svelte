/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	let fuelprices;

	await fetch('http://api.fuelprices.box')
		.then((res) => (fuelprices = res.json()))
		.catch(
			(error) =>
				(fuelprices = [
					{ timestamp: '2023-07-14T09:00:00Z', avanti: 1.52, jet: 1.51 },
					{ timestamp: '2023-07-14T10:00:00Z', avanti: 1.55, jet: 1.54 },
					{ timestamp: '2023-07-14T11:00:00Z', avanti: 1.53, jet: 1.54 },
					{ timestamp: '2023-07-14T12:00:00Z', avanti: 1.535, jet: 1.52 },
					{ timestamp: '2023-07-14T13:00:00Z', avanti: 1.545, jet: 1.53 }
				])
		);

	return { fuelprices };
}
