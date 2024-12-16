import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries'
import { Volume } from '@/interfaces/Volume';

import { useRef, useState } from 'react';
import useChartStore from '@/lib/hooks/useChartStore';

interface ChartProps {
	timeseries: Timeseries[]
	volume: Volume[]
}


// Lightweight charts accept UTCtimestamp, BuisnessDay or buisness day string in ISO format
// https://tradingview.github.io/lightweight-charts/docs/api#time

// Time settings
//https://github.com/tradingview/lightweight-charts/blob/v3.7.0/docs/time-scale.md#time-scale-options

export function Chart({ timeseries, volume }: { timeseries: Timeseries[]; volume: Volume[] }) {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const { indicators } = useChartStore()
	console.log(indicators, "indcatorsssssssssssssssssssss")
	//const [indicators, setIndicators] = useState<{ name: string; data: any[] }[]>([]);
	//const addIndicator = (name: string, data: any[]) => {
	//	setIndicators((prev) => [...prev, { name, data }]);
	//};
	//
	//const removeIndicator = (name: string) => {
	//	setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	//};

	return (
		<>
			<div className="mb-4">
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
