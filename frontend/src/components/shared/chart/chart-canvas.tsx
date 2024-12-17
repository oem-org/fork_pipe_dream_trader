import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle, LineData } from 'lightweight-charts';
import React from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import { gg } from './json';
import { LineSeries } from '@/interfaces/types/LineSeries';

interface ChartCanvasProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: Timeseries[];
	volume: Volume[];
	indicators: LineSeries[];
	colors?: {
		backgroundColor?: string;
		textColor?: string;
	};
}

export default function ChartCanvas({
	chartContainerRef,
	data,
	volume,
	indicators,
	colors: { backgroundColor = '#253248', textColor = 'white' } = {},
}: ChartCanvasProps): React.ReactElement {
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRefs = useRef<{ [key: string]: ISeriesApi<'Line'> }>({}); // Track indicator series
	const [chartReady, setChartReady] = useState(false)

	useEffect(() => {
		if (!chartRef.current && chartContainerRef.current) {
			chartRef.current = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: "black" },
					textColor,
				},
				grid: {
					vertLines: { color: '#334158' },
					horzLines: { color: '#334158' },
				},
				timeScale: { borderColor: '#485c7b', timeVisible: true },
			});


			if (chartRef.current) {
				indicators.forEach((indicator) => {
					if (!seriesRefs.current[indicator.name]) {
						const lineSeries = chartRef.current.addLineSeries({
							color: indicator.lineColor,
							lineWidth: 2,
							lineStyle: LineStyle.Solid,
							priceScaleId: "line",
						});

						lineSeries.setData(indicator.data);
						seriesRefs.current[indicator.name] = lineSeries; // Save reference
					}
				});

			}

			const candleSeries = chartRef.current.addCandlestickSeries({
				upColor: '#4bffb5',
				downColor: '#ff4976',
				borderDownColor: '#ff4976',
				borderUpColor: '#4bffb5',
				wickDownColor: '#838ca1',
				wickUpColor: '#838ca1',
			});

			candleSeries.setData(data);

			const volumeSeries = chartRef.current.addHistogramSeries({
				priceFormat: { type: 'volume' },
				priceScaleId: '',
			});

			volumeSeries.priceScale().applyOptions({
				scaleMargins: { top: 0.8, bottom: 0.001 },
			});

			volumeSeries.setData(volume);
		}

		// Cleanup chart on unmount
		return () => {
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
				seriesRefs.current = {}
			}
		};
	}, [indicators, chartContainerRef, data, volume, backgroundColor, textColor]);

	return <div className="w-full h-full" ref={chartContainerRef} />;
}
