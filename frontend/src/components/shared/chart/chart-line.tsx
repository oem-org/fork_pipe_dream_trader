
import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import React from 'react';
import { LineData } from 'lightweight-charts';

interface ChartLineProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	data: LineData[];
	colors?: {
		backgroundColor?: string;
		textColor?: string;
	};
}

export default function ChartLine({
	data,
	chartContainerRef,
	colors: { backgroundColor = '#253248', textColor = 'white' } = {},
}: ChartLineProps): React.ReactElement {

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

			// Documentation:
			// https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApiBase#addlineseries
			const lineSeries = chartRef.current.addLineSeries({
				priceScaleId: '',
			});

			lineSeries.priceScale().applyOptions({
				scaleMargins: { top: 0.08, bottom: 0 },
			});

			lineSeries.setData(data);
		}

		// Cleanup chart on unmount
		return () => {
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, [chartContainerRef, data, backgroundColor, textColor]);


	return <div className="w-full h-full" ref={chartContainerRef} />;
}
