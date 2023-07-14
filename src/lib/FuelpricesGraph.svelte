<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-moment';

	Chart.defaults.font.family = '"Inter", sans-serif';
	Chart.defaults.font.weight = '500';
	Chart.defaults.color = 'rgb(148, 163, 184)';
	Chart.defaults.scale.grid.color = 'rgb(241, 245, 249)';
	Chart.defaults.plugins.tooltip.titleColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.bodyColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.backgroundColor = '#FFF';
	Chart.defaults.plugins.tooltip.borderWidth = 1;
	Chart.defaults.plugins.tooltip.borderColor = 'rgb(226, 232, 240)';
	Chart.defaults.plugins.tooltip.displayColors = false;
	Chart.defaults.plugins.tooltip.mode = 'nearest';
	Chart.defaults.plugins.tooltip.intersect = false;
	Chart.defaults.plugins.tooltip.position = 'nearest';
	Chart.defaults.plugins.tooltip.caretSize = 0;
	Chart.defaults.plugins.tooltip.caretPadding = 20;
	Chart.defaults.plugins.tooltip.cornerRadius = 4;
	Chart.defaults.plugins.tooltip.padding = 8;

	export let fuelprices: any;
	export let days: number;

	let ctx;
	let chartCanvas: any;

	$: daysFilter = (f: any) => {
		if (days == undefined || days == 0) {
			return true;
		}
		const currentDate = new Date();
		const timestampDate = new Date(f['timestamp']);
		const daysAgo = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
		return timestampDate > daysAgo;
	};

	let chart: any;

	const formatCurrency = (value: any) => {
		return value.toFixed(2) + ' €';
	};

	onMount(() => {
		ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [...fuelprices].filter(daysFilter).map((f) => f['timestamp']),
				datasets: [
					{
						label: 'Avanti',
						backgroundColor: 'rgba(255, 205, 24, 0.05)',
						borderColor: 'rgba(255, 205, 24, 1)',
						pointBackgroundColor: 'rgba(255, 205, 24, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						tension: 0.1,
						data: [...fuelprices].filter(daysFilter).map((f) => f['avanti'])
					},
					{
						label: 'Jet',
						backgroundColor: 'rgba(7, 25, 252, 0.05)',
						borderColor: 'rgba(7, 25, 252, 1)',
						pointBackgroundColor: 'rgba(7, 25, 252, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						tension: 0.1,
						data: [...fuelprices].filter(daysFilter).map((f) => f['jet'])
					}
				]
			},
			options: {
				scales: {
					x: {
						type: 'time',
						grid: {
							display: false
						},
						border: {
							display: false
						}
					},
					y: {
						border: {
							display: false
						},
						ticks: {
							callback: (value) => formatCurrency(value)
						}
					}
				},
				aspectRatio: 3 / 2,
				maintainAspectRatio: false
			}
		});
	});

	afterUpdate(() => {
		chart.data.labels = [...fuelprices].filter(daysFilter).map((f) => f['timestamp']);
		chart.data.datasets[0].data = [...fuelprices].filter(daysFilter).map((f) => f['avanti']);
		chart.data.datasets[1].data = [...fuelprices].filter(daysFilter).map((f) => f['jet']);
		chart.update();
	});
</script>

<div>
	<canvas bind:this={chartCanvas} id="my-chart" class="w-full" />
</div>
