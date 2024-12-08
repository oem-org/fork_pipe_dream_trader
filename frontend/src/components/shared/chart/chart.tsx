import { useRef } from 'react';
import { CandlestickData } from 'lightweight-charts';
import ChartCanvas from './chart-canvas';

interface ChartProps {
	timeseries: timeseries[]
}

export function Chart({ timeseries }: ChartProps) {
	const customColors = {
		backgroundColor: '#f5f5f5',
		textColor: '#212121',
		upColor: '#26a69a',
		downColor: '#ef5350',
		borderUpColor: '#26a69a',
		borderDownColor: '#ef5350',
		wickUpColor: '#26a69a',
		wickDownColor: '#ef5350',
	};

	const chartContainerRef = useRef<HTMLDivElement>(null);

	console.log('Chart component rendered with data:', timeseries);

	return (
		<div className="w-full h-full rounded-lg overflow-hidden">
			<ChartCanvas chartContainerRef={chartContainerRef} data={timeseries} colors={customColors} />
		</div>
	);
}

