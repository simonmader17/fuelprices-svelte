<script lang="ts">
	export let title: String;
	export let label: String;
	export let data: any;

	$: oldest = [...data.map((f: any) => f[`${label}`])].find((p) => p != null) ?? '-,---';
	$: current = [...data.map((f: any) => f[`${label}`])].reverse().find((p) => p != null) ?? '-,---';
	$: change = current / oldest;

	$: currentDate = new Date([...data].reverse().find((f) => f[`${label}`] != null)?.['timestamp']);
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex items-center gap-1">
		<p class="text-3xl tracking-tight sm:text-4xl">
			{current?.toLocaleString('de', {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3
			})} €
		</p>
		{#if change > 1}
			<p class="text-xs font-[800] text-secondary dark:text-secondary-dark sm:text-sm">
				<!--text-red-600-->
				+{((change - 1) * 100)?.toLocaleString('de', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}%
			</p>
		{:else if change < 1}
			<p class="text-xs font-[800] text-primary dark:text-primary-dark sm:text-sm">
				<!--text-green-600-->
				-{((1 - change) * 100)?.toLocaleString('de', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}%
			</p>
		{:else}
			<p class="text-xs font-[800] text-gray-600 sm:text-sm">0%</p>
		{/if}
	</div>
	<p class="sm:text-md text-center text-sm text-gray-500">
		{title}
		<span class="text-xs sm:text-sm">
			{#if currentDate instanceof Date && !isNaN(currentDate.getTime())}
				({currentDate.toLocaleString('de', {
					timeStyle: 'short'
				})})
			{:else}
				(Keine Daten)
			{/if}
		</span>
	</p>
</div>
