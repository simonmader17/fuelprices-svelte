<script lang="ts">
	import PriceChange from './PriceChange.svelte';

	import { afterUpdate, onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-moment';

	Chart.defaults.font.family = '"Inter", sans-serif';
	Chart.defaults.font.weight = '500';
	Chart.defaults.color = 'rgb(107 114 128)';
	Chart.defaults.scale.grid.color = 'rgb(241, 245, 249)';
	Chart.defaults.plugins.tooltip.titleColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.bodyColor = 'rgb(30, 41, 59)';
	Chart.defaults.plugins.tooltip.backgroundColor = '#FFF';
	Chart.defaults.plugins.tooltip.borderWidth = 1;
	Chart.defaults.plugins.tooltip.borderColor = 'rgb(226, 232, 240)';
	Chart.defaults.plugins.tooltip.displayColors = true;
	Chart.defaults.plugins.tooltip.mode = 'nearest';
	Chart.defaults.plugins.tooltip.intersect = false;
	Chart.defaults.plugins.tooltip.position = 'nearest';
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
						ticks: {
							callback: (value) => formatCurrency(value)
						}
					}
				},
				aspectRatio: 3 / 2,
				maintainAspectRatio: false,
				plugins: {
					decimation: {
						enabled: true,
						threshold: 1
					},
					tooltip: {
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
		chart.options.scales.x.min = minDays;
		chart.update();
	});

	// let test1: any;
	// let test2: any;
</script>

<div class="flex justify-around">
	<PriceChange title="Avanti" data={[...fuelprices].filter(daysFilter)} />
	<PriceChange title="Jet" data={[...fuelprices].filter(daysFilter)} />
</div>

<div>
	<canvas bind:this={chartCanvas} id="my-chart" class="w-full" />
</div>

<!-- <p>{test1}</p>

{test2} -->
