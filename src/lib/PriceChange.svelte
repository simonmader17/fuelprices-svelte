<script lang="ts">
	export let title: String;
	export let data: any;

	$: oldest = [...data.map((f: any) => f[`${title.toLowerCase()}`])].find((p) => p != null);
	$: current = [...data.map((f: any) => f[`${title.toLowerCase()}`])]
		.reverse()
		.find((p) => p != null);
	$: change = current / oldest;

	$: currentDate = new Date(data.map((f: any) => f['timestamp']).at(-1));
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex items-center gap-1">
		<p class="text-4xl">{current.toFixed(3)} €</p>
		{#if change > 1}
			<p class="text-sm text-green-600">+{((change - 1) * 100).toFixed(2)}%</p>
		{:else if change < 1}
			<p class="text-sm text-red-600">-{((1 - change) * 100).toFixed(2)}%</p>
		{:else}
			<p class="text-sm text-gray-600">0%</p>
		{/if}
	</div>
	<p class="text-lg text-gray-500">
		{title} ({currentDate.toLocaleString('de', {
			dateStyle: 'short',
			timeStyle: 'short'
		})})
	</p>
</div>
