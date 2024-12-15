import { createChart, CrosshairMode, ColorType, IChartApi } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import { useChartStore } from '@/lib/hooks/useChartStore';

interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: Timeseries[];
	histograms: Array<any>;
	volume: Volume[];
	colors?: {
		backgroundColor?: string;
		lineColor?: string;
		textColor?: string;
		areaTopColor?: string;
		areaBottomColor?: string;
	};
}

export default function ChartCanvas(props: ChartProps): React.ReactElement {
	const {
		chartContainerRef,
		data,
		volume,
		histograms,
		colors: {
			backgroundColor = '#253248',
			lineColor = '#2962FF',
			textColor = 'black',
			areaTopColor = '#2962FF',
			areaBottomColor = 'rgba(41, 98, 255, 0.28)',
		} = {},
	} = props;

	const [chartSize, setChartSize] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});

	const { chartRef, setChartRef } = useChartStore(); // Use the chart store

	const handleResize = () => {
		if (chartContainerRef.current) {
			const newWidth = chartContainerRef.current.clientWidth;
			const newHeight = chartContainerRef.current.clientHeight;
			if (newWidth !== chartSize.width || newHeight !== chartSize.height) {
				setChartSize({
					width: newWidth,
					height: newHeight,
				});
			}
		}
	};

	useEffect(() => {
		if (chartContainerRef.current) {
			const newWidth = chartContainerRef.current.clientWidth;
			const newHeight = chartContainerRef.current.clientHeight;

			if (newWidth !== chartSize.width || newHeight !== chartSize.height) {
				setChartSize({ width: newWidth, height: newHeight });
			}

			// Create the chart instance and store it in the global Zustand store
			const chartInstance = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: 'black' },
					textColor: 'white',
				},
				grid: {
					vertLines: { color: '#334158' },
					horzLines: { color: '#334158' },
				},
				crosshair: { mode: CrosshairMode.Normal },
				timeScale: {
					borderColor: '#485c7b',
					timeVisible: true,
				},
				width: newWidth,
				height: newHeight,
			});

			chartInstance.timeScale().fitContent();
			setChartRef(chartInstance); // Store the chart globally

			// Add candlestick series
			const candleSeries = chartInstance.addCandlestickSeries({
				upColor: '#4bffb5',
				downColor: '#ff4976',
				borderDownColor: '#ff4976',
				borderUpColor: '#4bffb5',
				wickDownColor: '#838ca1',
				wickUpColor: '#838ca1',
			});
			candleSeries.setData(data);

			// Add histogram series for volume
			const histogram = chartInstance.addHistogramSeries({
				priceFormat: { type: 'volume' },
				priceScaleId: '',
			});
			histogram.priceScale().applyOptions({
				scaleMargins: { top: 0.8, bottom: 0 },
			});
			histogram.setData(volume);

			window.addEventListener('resize', handleResize);

			// Cleanup
			return () => {
				window.removeEventListener('resize', handleResize);
				if (chartInstance) {
					chartInstance.remove();
				}
				setChartRef(null); // Clear the global store
			};
		}
	}, [
		chartContainerRef,
		data,
		volume,
		backgroundColor,
		lineColor,
		textColor,
		areaTopColor,
		areaBottomColor,
		chartSize.width,
		chartSize.height,
	]);

	return <div className="w-full h-full" ref={chartContainerRef} />;
}
