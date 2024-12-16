import React, { useEffect, useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import useChartStore from '@/lib/hooks/useChartStore';


export function Chart({ timeseries, volume }: { timeseries: Timeseries[]; volume: Volume[] }) {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const { indicators, addIndicator } = useChartStore((state) => ({
		indicators: state.indicators,
		addIndicator: state.addIndicator,
		//removeIndicator: state.removeIndicator,
	}));

	// Add initial SMA indicator on mount
	useEffect(() => {
		//addIndicator('SMA2',
		//	[
		//		{ time: '2022-03-01', value: 50 },
		//		{ time: '2022-03-02', value: 52 },
		//	],
		//);
	}, []);
	let indicators2 = []
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
			</div>


			<ChartCanvas
				chartContainerRef={chartContainerRef}
				data={timeseries}
				volume={volume}
				indicators={indicators2}
			/>
		</div>
	);
}



//<button
//	onClick={() => removeIndicator('SMA')}
//	className="px-4 py-2 bg-red-500 text-white rounded"
//>
//	Remove SMA
//</button>
