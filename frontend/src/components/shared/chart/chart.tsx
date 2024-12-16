import React, { useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';

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
		<div className="w-full h-full">
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
			<ChartCanvas
				chartContainerRef={chartContainerRef}
				data={timeseries}
				volume={volume}
				indicators={indicators}
			/>
		</div>
	);
}
