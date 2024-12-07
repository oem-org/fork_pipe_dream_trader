import { createChart, ColorType, IChartApi } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import Timeseries from '../../../interfaces/Timeseries'

interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: Timeseries[];
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
			backgroundColor = 'white',
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
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartSize.width,
				height: chartSize.height,
			});

			chartRef.current.timeScale().fitContent();
			const newSeries = chartRef.current.addAreaSeries({
				lineColor,
				topColor: areaTopColor,
				bottomColor: areaBottomColor,
			});
			newSeries.setData(data);

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

	return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
}
