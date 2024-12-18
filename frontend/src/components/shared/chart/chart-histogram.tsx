
import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import React from 'react';
import { Volume } from '@/interfaces/Volume';


interface ChartCanvasProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	volume: Volume[];
	colors?: {
		backgroundColor?: string;
		textColor?: string;
	};
}

export default function ChartHistogram({
	volume,
	chartContainerRef,
	colors: { backgroundColor = '#253248', textColor = 'white' } = {},
}: ChartCanvasProps): React.ReactElement {

	const chartRef = useRef<IChartApi | null>(null);


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

			const volumeSeries = chartRef.current.addHistogramSeries({
				priceFormat: { type: 'volume' },
				priceScaleId: '',
			});

			volumeSeries.priceScale().applyOptions({
				scaleMargins: { top: 0.08, bottom: 0 },
			});

			volumeSeries.setData(volume);
		}

		// Cleanup chart on unmount
		return () => {
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, [chartContainerRef, volume, backgroundColor, textColor]);


	return <div className="w-full h-full" ref={chartContainerRef} />;
}
