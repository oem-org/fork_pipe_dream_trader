import { createChart, CrosshairMode, ColorType, IChartApi } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import Timeseries from '../../../interfaces/Timeseries'
import Volume from '@/interfaces/Volume'
import { volumeData } from './volume'


interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: Timeseries[];
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

	const chartRef = useRef<IChartApi | null>(null);

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

			chartRef.current = createChart(chartContainerRef.current, {
				//layout: {
				//	background: { type: ColorType.Solid, color: backgroundColor },
				//	textColor,
				//},


				layout: {
					background: { type: ColorType.Solid, color: "black" },
					textColor: 'white',
				},
				grid: {
					vertLines: {
						color: '#334158',
					},
					horzLines: {
						color: '#334158',
					},
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
				//priceScale: {
				//	borderColor: '#485c7b',
				//},
				timeScale: {
					borderColor: '#485c7b',
				},


				width: newWidth,
				height: newHeight,
			});

			chartRef.current.timeScale().fitContent();


			const candleSeries = chartRef.current.addCandlestickSeries({
				upColor: '#4bffb5',
				downColor: '#ff4976',
				borderDownColor: '#ff4976',
				borderUpColor: '#4bffb5',
				wickDownColor: '#838ca1',
				wickUpColor: '#838ca1',
			});

			//const newSeries = chartRef.current.addAreaSeries({
			//	lineColor,
			//	topColor: areaTopColor,
			//	bottomColor: areaBottomColor,
			//});
			//
			//newSeries.setData(data);


			const volumeSeries = chartRef.current.addHistogramSeries({
				priceFormat: {
					type: 'volume',
				},
				priceScaleId: '',
			});
			volumeSeries.priceScale().applyOptions({
				// 
				scaleMargins: {
					top: 0.8,
					bottom: 0.001,
				},
			});
			volumeSeries.setData(volumeData);

			candleSeries.setData(data);

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
				if (chartRef.current) {
					chartRef.current.remove();
				}
			};
		}
	}, [
		data,
		backgroundColor,
		lineColor,
		textColor,
		areaTopColor,
		areaBottomColor,
		chartSize.width,
		chartSize.height,
	]);

	return (
		<div
			className="w-full h-full"
			ref={chartContainerRef}
		/>
	);
}

