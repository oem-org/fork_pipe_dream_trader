import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries'
import { Volume } from '@/interfaces/Volume';
import { useEffect, useRef } from 'react';
import useChartStore from '@/lib/hooks/useChartStore';
import { IndicatorChart } from '@/interfaces/IndicatorChart';

export function Chart({ timeseries, volume }: { timeseries: Timeseries[]; volume: Volume[] }) {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const { indicators, lineSeriesIndicators, histogramIndicators, setLineSeriesIndicators, setHistogramIndicators, addHistogramIndicator, addLineSeriesIndicator } = useChartStore();



	useEffect(() => {
		const histograms: IndicatorChart[] = [];
		const lineSeries: IndicatorChart[] = [];

		indicators.forEach((indicator) => {
			switch (indicator.chartStyle) {
				case "histogram":
					histograms.push(indicator);
					break;

				case "line_add_pane":
					lineSeries.push(indicator);
					break;

				default:
					break;
			}
		});

		setHistogramIndicators(histograms);
		setLineSeriesIndicators(lineSeries);
	}, [indicators]);
	// Subscribe to the `lineSeriesIndicators` and update the chart when state changes
	useEffect(() => {
		const unsubscribe = useChartStore.subscribe(
			(state) => state.lineSeriesIndicators, // Listen to lineSeriesIndicators
			(updatedLineSeriesIndicators) => {
				console.log('lineSeriesIndicators updated', updatedLineSeriesIndicators);
				// Trigger any additional updates, like re-rendering the chart
			}
		);

		// Cleanup the subscription when the component is unmounted
		return () => unsubscribe();
	}, []);

	// Subscribe to the `histogramIndicators` and update the chart when state changes
	useEffect(() => {
		const unsubscribe = useChartStore.subscribe(
			(state) => state.histogramIndicators, // Listen to histogramIndicators
			(updatedHistogramIndicators) => {
				console.log('histogramIndicators updated', updatedHistogramIndicators);
				// Trigger any additional updates, like re-rendering the chart
			}
		);

		// Cleanup the subscription when the component is unmounted
		return () => unsubscribe();
	}, []);
	const indicatorstest = [
		{
			name: 'SMA',
			chartStyle: 'line_add_pane',
			data: volume,
		},
		{
			name: 'Volume Histogram',
			chartStyle: 'histogram',
			data: [
				{ time: '2023-12-01', value: 5000 },
				{ time: '2023-12-02', value: 6200 },
				{ time: '2023-12-03', value: 4500 },
				{ time: '2023-12-04', value: 5800 },
				{ time: '2023-12-05', value: 6100 },
			],
		},
	];

	return (
		<div className="w-full h-full">
			<ChartCanvas
				chartContainerRef={chartContainerRef}
				data={timeseries}
				volume={volume}
				indicators={indicatorstest} // Pass both line and histogram indicators to the chart
			/>
		</div>
	);
}






// Lightweight charts accept UTCtimestamp, BuisnessDay or buisness day string in ISO format
// https://tradingview.github.io/lightweight-charts/docs/api#time

// Time settings
//https://github.com/tradingview/lightweight-charts/blob/v3.7.0/docs/time-scale.md#time-scale-options

