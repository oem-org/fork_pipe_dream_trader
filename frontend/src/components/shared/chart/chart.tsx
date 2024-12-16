import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries'
import { Volume } from '@/interfaces/Volume';

import { useRef, useState } from 'react';

interface ChartProps {
	timeseries: Timeseries[]
	volume: Volume[]
	lineSeries: Array<any>
}

// Lightweight charts accept UTCtimestamp, BuisnessDay or buisness day string in ISO format
// https://tradingview.github.io/lightweight-charts/docs/api#time

// Time settings
//https://github.com/tradingview/lightweight-charts/blob/v3.7.0/docs/time-scale.md#time-scale-options

export function Chart({ timeseries, volume }: { timeseries: Timeseries[]; volume: Volume[] }) {
	const [indicators, setIndicators] = useState<{ name: string; data: any[] }[]>([]);
	const chartContainerRef = useRef<HTMLDivElement>(null);

	const addIndicator = (name: string, data: any[]) => {
		setIndicators((prev) => [...prev, { name, data }]);
	};

	const removeIndicator = (name: string) => {
		setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	};

	return (
		<>
			<div className="mb-4">
				<button
					onClick={() =>
						addIndicator('SMA', [
							{ time: '2022-01-01', value: 50 },
							{ time: '2022-01-02', value: 52 },
						])
					}
					className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Add SMA
				</button>
				<button
					onClick={() => removeIndicator('SMA')}
					className="px-4 py-2 bg-red-500 text-white rounded"
				>
					Remove SMA
				</button>
			</div>
			<div className="w-full h-full">
				<ChartCanvas
					chartContainerRef={chartContainerRef}
					data={timeseries}
					volume={volume}
					indicators={indicators}
				/>
			</div>
		</>);
}
