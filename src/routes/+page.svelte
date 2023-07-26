<script lang="ts">
	import FuelpricesGraph from '$lib/FuelpricesGraph.svelte';
	import { onMount } from 'svelte';

	export let data: any;
	let fuelprices = data.fuelprices;

	let days: number = 7; // dirty solution for default value;#

	let darkMode: boolean;
	const toggleDarkMode = () => {
		darkMode = document.documentElement.classList.toggle('dark');
	};

	onMount(() => {
		darkMode = document.documentElement.classList.contains('dark');
	});
</script>

<main>
	<button class="absolute right-0 p-2" on:click={toggleDarkMode}>
		{#if darkMode}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="h-8 w-8"
			>
				<path
					d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="h-8 w-8"
			>
				<path
					fill-rule="evenodd"
					d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>

	<div class="grid place-items-center">
		<h1>Benzinpreise</h1>
	</div>

	<FuelpricesGraph {fuelprices} {days} {darkMode} />

	<div class="days-select">
		<label><input type="radio" bind:group={days} value={7} />Woche</label>
		<label><input type="radio" bind:group={days} value={30} />Monat</label>
		<label><input type="radio" bind:group={days} value={365} />Jahr</label>
		<label><input type="radio" bind:group={days} value={0} />Gesamt</label>
	</div>

	<div class="flex justify-center">
		<a
			href="https://t.me/simonmader_fuelprices_bot"
			target="_blank"
			class="m-1 flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-300 to-[#2097D4] p-2 text-white shadow-lg shadow-blue-400 drop-shadow-xl transition-all active:scale-90 lg:m-4 lg:p-4 lg:text-xl"
		>
			<img src="telegram.webp" alt="Telegram Logo" class="h-10 drop-shadow-xl lg:h-12" />
			<p>Telegram Bot</p>
		</a>
	</div>
</main>

<style lang="scss">
	main {
		@apply container relative mx-auto px-4 lg:max-w-5xl;
	}

	main > * {
		@apply my-2 lg:my-4;
	}

	h1 {
		@apply inline-block bg-gradient-to-br from-primary to-accent bg-clip-text text-center text-5xl font-[800] text-transparent drop-shadow-lg dark:from-secondary-dark dark:to-accent-dark lg:text-7xl;
	}

	.days-select {
		@apply flex select-none justify-between gap-2 lg:gap-4;

		& > label {
			@apply w-full cursor-pointer flex-wrap rounded-xl bg-background px-2 py-4 text-center drop-shadow-xl transition-all dark:bg-grid-dark dark:shadow-xl lg:p-8 lg:text-3xl;

			& > input {
				@apply hidden;
			}

			&:has(> input:checked) {
				@apply bg-gradient-to-br from-primary to-accent font-[800] text-background shadow-xl shadow-accent/40 dark:from-secondary-dark dark:to-accent-dark dark:text-background-dark dark:shadow-accent-dark/40;
			}

			&:active {
				@apply scale-90;
			}
		}
	}
</style>
