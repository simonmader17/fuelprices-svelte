<script lang="ts">
	import FuelpricesGraph from '$lib/FuelpricesGraph.svelte';

	export let data: any;
	let fuelprices = data.fuelprices;

	let days: number = 30; // dirty solution for default value;
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
	@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&display=swap');

	* {
		font-family: 'Raleway', sans-serif;
	}

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
			@apply lg:m-4 w-full cursor-pointer flex-wrap rounded-xl bg-gray-50 lg:p-8 text-center lg:text-3xl transition-all m-1 p-2;

			& > input {
				@apply hidden;
			}

			&:has(> input:checked) {
				@apply bg-gray-200;
			}

			&:active {
				@apply scale-90;
			}
		}
	}
</style>
