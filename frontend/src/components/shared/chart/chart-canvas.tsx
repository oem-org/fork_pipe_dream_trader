import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle, LineData } from 'lightweight-charts';
import React from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';

interface ChartCanvasProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: Timeseries[];
	volume: Volume[];
	indicators: { name: string; data: LineData[] }[]; // List of active indicators
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

	useEffect(() => {
		if (!chartRef.current && chartContainerRef.current) {
			// Initialize the chart
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
				scaleMargins: { top: 0.8, bottom: 0.06 },
			});

			volumeSeries.setData(volume);
		}

		return () => {
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, [chartContainerRef, data, volume, backgroundColor, textColor]);

	// Handle adding/removing indicators
	useEffect(() => {
		if (chartRef.current) {
			// Add new indicators
			indicators.forEach((indicator) => {
				if (!seriesRefs.current[indicator.name]) {
					// Create a new line series for the indicator
					const lineSeries = chartRef.current.addLineSeries({
						color: indicator.name === 'SMA' ? '#FFD700' : '#FF4500', // Example: different colors for indicators
						lineWidth: 2,
						lineStyle: LineStyle.Solid,
					});

					lineSeries.setData(indicator.data);
					seriesRefs.current[indicator.name] = lineSeries; // Save reference
				}
			});

			// Remove indicators not in the state
			Object.keys(seriesRefs.current).forEach((name) => {
				if (!indicators.find((indicator) => indicator.name === name)) {
					chartRef.current?.removeSeries(seriesRefs.current[name]);
					delete seriesRefs.current[name];
				}
			});
		}
	}, [indicators]);

	return <div className="w-full h-full" ref={chartContainerRef} />;
}
