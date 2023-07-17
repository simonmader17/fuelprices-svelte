<script lang="ts">
	export let title: String;
	export let data: any;

	$: oldest = [...data.map((f: any) => f[`${title.toLowerCase()}`])].find((p) => p != null);
	$: current = [...data.map((f: any) => f[`${title.toLowerCase()}`])]
		.reverse()
		.find((p) => p != null);
	$: change = current / oldest;

	$: currentDate = new Date(
		[...data].reverse().find((f) => f[`${title.toLowerCase()}`] != null)['timestamp']
	);
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex items-center gap-1">
		<p class="text-3xl lg:text-4xl">
			{current.toLocaleString('de', {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3
			})} €
		</p>
		{#if change > 1}
			<p class="text-xs text-red-600 lg:text-sm">
				+{((change - 1) * 100).toLocaleString('de', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}%
			</p>
		{:else if change < 1}
			<p class="text-xs text-green-600 lg:text-sm">
				-{((1 - change) * 100).toLocaleString('de', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}%
			</p>
		{:else}
			<p class="text-xs text-gray-600 lg:text-sm">0%</p>
		{/if}
	</div>
	<p class="text-gray-500 lg:text-lg">
		{title} ({currentDate.toLocaleString('de', {
			dateStyle: 'short',
			timeStyle: 'short'
		})})
	</p>
</div>
