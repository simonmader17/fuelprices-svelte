<script lang="ts">
	import FuelpricesGraph from '$lib/FuelpricesGraph.svelte';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	export let data: any;

	// Set at runtime on the container; the subscribe button is hidden if either is missing
	const ntfyLink =
		env.PUBLIC_NTFY_URL && env.PUBLIC_NTFY_TOPIC
			? `${env.PUBLIC_NTFY_URL.replace(/\/+$/, '')}/${encodeURIComponent(env.PUBLIC_NTFY_TOPIC)}`
			: null;
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

	{#if ntfyLink}
		<div class="flex justify-center">
			<a
				href={ntfyLink}
				target="_blank"
				rel="noopener"
				title="Öffnet das ntfy-Topic: dort Benachrichtigungen bei neuen Wochen- und Monatstiefs/-hochs abonnieren"
				class="m-1 flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-300 to-[#338574] p-2 text-white shadow-lg shadow-emerald-500 drop-shadow-xl transition-all active:scale-90 md:m-4 md:p-4 md:text-xl"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					class="h-10 w-10 drop-shadow-xl md:h-12 md:w-12"
				>
					<path
						d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z"
					/>
					<path
						fill-rule="evenodd"
						d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>Preisalarme abonnieren</p>
			</a>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		@apply container relative mx-auto px-4 md:max-w-3xl;
	}

	main > * {
		@apply my-2 md:my-4;
	}

	h1 {
		@apply inline-block bg-gradient-to-br from-primary to-secondary bg-clip-text text-center text-5xl font-[800] text-transparent  drop-shadow-lg dark:from-primary-dark dark:to-secondary-dark md:text-7xl;
	}

	.days-select {
		@apply flex select-none justify-between gap-2 md:gap-4;

		& > label {
			@apply w-full cursor-pointer flex-wrap rounded-xl bg-grid px-2 py-4 text-center drop-shadow-xl transition-all dark:bg-grid-dark dark:shadow-xl md:p-8 md:text-2xl;

			& > input {
				@apply hidden;
			}

			&:has(> input:checked) {
				@apply bg-gradient-to-br from-primary to-secondary font-[800] text-grid shadow-xl shadow-secondary/40 dark:from-primary-dark dark:to-secondary-dark dark:text-background-dark dark:shadow-secondary-dark/40;
			}

			&:active {
				@apply scale-90;
			}
		}
	}
</style>
