import React, { memo, useRef, useEffect } from 'react';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import { IndicatorChart } from '@/interfaces/IndicatorChart';

interface ChartProps {
	timeseries: Timeseries[];
	volume: Volume[];
	indicators: IndicatorChart[];
	setIndicators: React.Dispatch<React.SetStateAction<IndicatorChart[]>>;
}

function ChartMemo({ timeseries, volume, indicators, setIndicators }: ChartProps) {
	// will only rerender if props change

	useEffect(() => {
		console.log(indicators, "HOOOOOOOOOOOOOOOOOOOOOOOOOOO")

	}, [])


	const chartContainerRef = useRef<HTMLDivElement>(null);

	const addIndicator = (indicator: IndicatorChart) => {
		setIndicators((prev) => [
			...prev,
			{ name: indicator.name, id: indicator.id, chartStyle: indicator.chartStyle, data: indicator.data },
		]);
	};

	const removeIndicator = (name: string) => {
		setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	};

	return (
		<div className="w-full h-full">
			<div className="mb-4">
				<button
					onClick={() =>
						addIndicator({
							name: 'SMA',
							id: 1,
							chartStyle: 'line',
							data: [
								{ time: '2022-01-01', value: 50 },
								{ time: '2022-01-02', value: 52 },
							],
						})
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


export const Chart = memo(ChartMemo);
