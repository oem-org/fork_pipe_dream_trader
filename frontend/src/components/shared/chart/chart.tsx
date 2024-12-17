import React, { useEffect, useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import ChartHistogram from './chart-histogram';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
import { LineSeries } from '@/interfaces/types/LineSeries';

interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	volume: Volume[]
	timeseries: Timeseries[]
	indicators: { name: string; lineColor: string, data: LineSeries[] }[]; // List of active indicators
}

export function Chart({ indicators, timeseries, chartContainerRef, volume }: ChartProps) {
	//let timeperiod = "recent"
	//const { strategyId } = useStrategyStore()
	//const [key, setKey] = useState(0);
	//const [mapped, setMapped] = useState<IndicatorChart[]>([])
	////const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	////const [volume, setVolume] = useState<Volume[]>([]);
	//const [histograms, setHistograms] = useState<any>([])
	//
	////const [indicators, setIndicators] = useState<{ name: string; data: any[] }[]>([]);
	//
	//
	//const reloadChart = () => {
	//	setKey(prevKey => prevKey + 1); // Increment the key to trigger a remount
	//};

	//useEffect(() => {
	//	let hist = []
	//	indicators.forEach((indicator) => {
	//		if (indicator.chartStyle === "histogram")
	//			hist.push(indicator)
	//	})
	//	setHistograms(hist)
	//	console.log("hist", hist);
	//
	//}, [indicators])



	//const addIndicator = (name: string, color: string, data: any[]) => {
	//	setIndicators((prev) => [...prev, { name, color, data }]);
	//};

	//const removeIndicator = (name: string) => {
	//	setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	//};

	//function updateIndicator(id: number) {
	//
	//}
	//
	//function loadIndicators(mapped: IndicatorChart[]) {
	//
	//	mapped.forEach(indicator => {
	//		addIndicator(indicator.name, "hotpink", indicator.data)
	//	});
	//}

	return (
		<div className="w-full h-full">
			<ChartCanvas
				chartContainerRef={chartContainerRef}
				data={timeseries}
				volume={volume}
				indicators={indicators}
			/>

		</div>
	);
}

//			<button onClick={reloadChart} className="px-4 py-2 bg-green-500 text-white rounded">
//				Reload Chart
//			</button>
//			<div>
//				{mapped.map((indicators) => (
//					<button
//						key={indicators.id}
//						id={indicators.id.toString()}
//						onClick={() => updateIndicator(indicators.id)}
//					>
//						{indicators.name}
//					</button>
//				))}
//			</div>
//			<div className="mb-4">
//				<button
//					onClick={() =>
//						addIndicator(sma, "hotpink", t)
//					}
//					className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
//				>
//					Add SMA
//				</button>
//				<button
//					onClick={() => removeIndicator('SMA')}
//					className="px-4 py-2 bg-red-500 text-white rounded"
//				>
//					Remove SMA
//				</button>
//			</div>
////onClick={() =>
//	addIndicator(test, [
//		{ time: '2022-01-01', value: 50 },
//		{ time: '2022-01-02', value: 52 },
//	])
//}
//
