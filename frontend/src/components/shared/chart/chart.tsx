import { useRef } from 'react';
import { CandlestickData } from 'lightweight-charts';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries'
import { Volume } from '@/interfaces/Volume';


interface ChartProps {
	timeseries: Timeseries[]
	volume: Volume[]
}

// Time settings
//https://github.com/tradingview/lightweight-charts/blob/v3.7.0/docs/time-scale.md#time-scale-options
export function Chart({ timeseries, volume }: ChartProps) {
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
			<ChartCanvas chartContainerRef={chartContainerRef} data={timeseries} volume={volume} colors={customColors} />
		</div>
	);
}

