<script lang="ts">
	import FuelpricesGraph from '$lib/FuelpricesGraph.svelte';

	export let data: any;
	let fuelprices = data.fuelprices;

	let days: number = 7; // dirty solution for default value;
</script>

<main>
	<h1>Benzinpreise</h1>

	<FuelpricesGraph {fuelprices} {days} />

	<div class="days-select">
		<label><input type="radio" bind:group={days} value={7} />Woche</label>
		<label><input type="radio" bind:group={days} value={30} />Monat</label>
		<label><input type="radio" bind:group={days} value={365} />Jahr</label>
		<label><input type="radio" bind:group={days} value={0} />Gesamt</label>
	</div>
</main>

<style lang="scss">
	main {
		@apply container mx-auto px-4 lg:max-w-5xl;
	}

	main > * {
		@apply my-4;
	}

	h1 {
		@apply text-center text-6xl;
	}

	.days-select {
		@apply flex justify-between;

		& > label {
			@apply m-1 w-full cursor-pointer flex-wrap rounded-xl bg-gray-50 px-2 py-4 text-center transition-all lg:m-4 lg:p-8 lg:text-3xl;

			& > input {
				@apply hidden;
			}

			&:has(> input:checked) {
				@apply bg-gradient-to-br from-blue-600 to-blue-400 text-white;
			}

			&:active {
				@apply scale-90;
			}
		}
	}
</style>
