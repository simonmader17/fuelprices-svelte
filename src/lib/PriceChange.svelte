<script lang="ts">
	export let oldest: number;
	export let current: number;
	export let title: String;

	$: change = current / oldest;
</script>

<div>
	<div class="flex items-center gap-1">
		<p class="text-4xl">{current} €</p>
		{#if change > 1}
			<p class="text-sm text-green-600">+{((change - 1) * 100).toFixed(2)}%</p>
		{:else if change < 1}
			<p class="text-sm text-red-600">-{((1 - change) * 100).toFixed(2)}%</p>
		{:else}
			<p class="text-sm text-gray-600">0%</p>
		{/if}
	</div>
    <p class="text-lg text-gray-500 text-center">{title}</p>
</div>
