<script lang="ts">
	import PriceChange from './PriceChange.svelte';

	import { afterUpdate, onMount } from 'svelte';
	import { page } from '$app/stores';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-moment';

	export let darkMode: boolean;
	const tailwindConfig = $page.data.tailwindConfig;

	Chart.defaults.font.family = '"Raleway", sans-serif';
	Chart.defaults.font.weight = '500';
	Chart.defaults.color = 'rgb(107 114 128)';
	Chart.defaults.plugins.tooltip.titleColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.bodyColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.backgroundColor = '#FFF';
	Chart.defaults.plugins.tooltip.borderWidth = 1;
	Chart.defaults.plugins.tooltip.borderColor = 'rgb(226, 232, 240)';
	Chart.defaults.plugins.tooltip.displayColors = true;
	Chart.defaults.plugins.tooltip.caretSize = 0;
	Chart.defaults.plugins.tooltip.caretPadding = 20;
	Chart.defaults.plugins.tooltip.cornerRadius = 4;
	Chart.defaults.plugins.tooltip.padding = 8;

	export let fuelprices: any;
	export let days: number;
	$: minDays = days == 0 ? undefined : new Date().getTime() - days * 24 * 60 * 60 * 1000;

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
		return value.toLocaleString('de', { style: 'currency', currency: 'EUR' });
	};

	onMount(() => {
		darkMode = document.documentElement.classList.contains('dark');
		ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Avanti St. Pölten',
						backgroundColor: 'rgba(255, 205, 24, 0.05)',
						borderColor: 'rgba(255, 205, 24, 1)',
						pointBackgroundColor: 'rgba(255, 205, 24, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						data: [...fuelprices].map((f) => {
							return {
								x: new Date(f['timestamp']).getTime(),
								y: parseFloat(f['avanti'])
							};
						})
					},
					{
						label: 'Jet St. Pölten',
						backgroundColor: 'rgba(7, 25, 252, 0.05)',
						borderColor: 'rgba(7, 25, 252, 1)',
						pointBackgroundColor: 'rgba(7, 25, 252, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						data: [...fuelprices].map((f) => {
							return {
								x: new Date(f['timestamp']).getTime(),
								y: parseFloat(f['jet'])
							};
						})
					},
					{
						label: 'BP Böheimkirchen',
						backgroundColor: 'rgba(112, 87, 0, 0.05)',
						borderColor: 'rgba(112, 87, 0, 1)',
						pointBackgroundColor: 'rgba(112, 87, 0, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						data: [...fuelprices].map((f) => {
							return {
								x: new Date(f['timestamp']).getTime(),
								y: parseFloat(f['bp'])
							};
						})
					},
					{
						label: 'Jet Langenrohr',
						backgroundColor: 'rgba(131, 140, 253, 0.05)',
						borderColor: 'rgba(131, 140, 253, 1)',
						pointBackgroundColor: 'rgba(131, 140, 253, 1)',
						fill: true,
						spanGaps: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 3,
						data: [...fuelprices].map((f) => {
							return {
								x: new Date(f['timestamp']).getTime(),
								y: parseFloat(f['jetLangenrohr'])
							};
						})
					}
				]
			},
			options: {
				parsing: false,
				normalized: true,
				scales: {
					x: {
						type: 'time',
						min: minDays,
						grid: {
							display: false
						},
						border: {
							display: false
						},
						ticks: {
							callback: (value) => {
								let date = new Date(value);
								return date.toLocaleDateString('de', { dateStyle: 'medium' });
							},
							maxTicksLimit: 10
						}
					},
					y: {
						type: 'linear',
						border: {
							display: false
						},
						grid: {
							color: darkMode
								? tailwindConfig.theme.colors['background-dark']
								: tailwindConfig.theme.colors['background']
						},
						ticks: {
							callback: (value) => formatCurrency(value)
						}
					}
				},
				aspectRatio: 3 / 2,
				maintainAspectRatio: true,
				responsive: true,
				plugins: {
					decimation: {
						enabled: true,
						threshold: 1
					},
					tooltip: {
						mode: 'index',
						axis: 'x',
						intersect: false,
						callbacks: {
							title: (tooltipItems) => {
								let label = tooltipItems[0].label;
								let formattedLabel = new Date(label).toLocaleString('de', {
									dateStyle: 'long',
									timeStyle: 'short'
								});
								return formattedLabel;
							},
							label: (tooltipItem) => {
								let gasStation = tooltipItem.dataset.label;
								let gasPrice = tooltipItem.parsed.y;
								let formattedPrice =
									gasPrice.toLocaleString('de', {
										minimumFractionDigits: 3,
										maximumFractionDigits: 3
									}) + ' €';
								return ' ' + gasStation + ': ' + formattedPrice;
							}
						}
					},
					legend: {
						labels: {
							generateLabels: (chart) => {
								return chart.data.datasets.map((dataset, index) => ({
									text: dataset.label,
									borderRadius: 5,
									datasetIndex: index,
									fillStyle: dataset.borderColor,
									fontColor: dataset.borderColor,
									hidden: !chart.isDatasetVisible(index),
									// lineCap: 'null',
									// lineDash: [],
									// lineDashOffset: 0,
									// lineJoin: 'null',
									// lineWidth: 0,
									strokeStyle: 'black'
									// pointStyle: 'circle',
									// rotation: 0
								}));
							}
						}
					}
				},
				animations: {
					x: { duration: 0 },
					y: { duration: 300, easing: 'easeOutBack' }
				}
			}
		});
	});

	afterUpdate(() => {
		// chart styles
		chart.options.scales.y.grid.color = darkMode
			? tailwindConfig.theme.colors['background-dark']
			: tailwindConfig.theme.colors['background'];

		// x axis min
		chart.options.scales.x.min = minDays;
		chart.update();
	});
</script>

<div class="my-2 grid grid-cols-2 md:my-4 md:grid-cols-4">
	<PriceChange title="Avanti St. Pölten" label="avanti" data={[...fuelprices].filter(daysFilter)} />
	<PriceChange title="Jet St. Pölten" label="jet" data={[...fuelprices].filter(daysFilter)} />
	<PriceChange
		title="Jet Langenrohr"
		label="jetLangenrohr"
		data={[...fuelprices].filter(daysFilter)}
	/>
	<PriceChange title="BP Böheimkirchen" label="bp" data={[...fuelprices].filter(daysFilter)} />
</div>

<div class="my-2 rounded-xl bg-grid p-4 drop-shadow-xl dark:bg-grid-dark md:my-4">
	<canvas bind:this={chartCanvas} id="my-chart" class="w-full" />
</div>

<svelte:window on:resize={() => chart.resize()} />
