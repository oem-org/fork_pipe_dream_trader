import React, { useEffect, useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';

export function Chart() {
	let timeperiod = "recent"
	const { strategyId } = useStrategyStore()

	const [mapped, setMapped] = useState<IndicatorChart[]>([])
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [test, setTest] = useState<any>([])

	useEffect(() => {
		async function loadData() {
			const data = await getTimeseriesApi.getQueryString(`timeperiod=${timeperiod}&strategy=${strategyId}`);
			const parsed = parseJsonStrings(data);
			const timeseriesService = new TimeseriesService();
			await timeseriesService.processOhlc(parsed.ohlc);
			await timeseriesService.processVolume(parsed.volume);
			const indicatorInfo = parsed.indicator_info;
			delete parsed.ohlc;
			delete parsed.volume;
			delete parsed.indicator_info;
			await timeseriesService.processBulk(parsed);
			const mapped = await timeseriesService.updateChart(indicatorInfo);
			setIndicators(mapped)

			loadIndicators(mapped)
			console.log(strategyId, "IDDD")
			setTimeseries(timeseriesService.ohlc); // Update OHLC
			setVolume(timeseriesService.volume);  // Update Volume

		}
		loadData()

	}, [strategyId])
	let sma = "SMA"
	let arr = []
	//useEffect(() => {
	//	if (mapped && mapped.length > 0) {
	//
	//		console.log(mapped[0].data, "mapped");
	//		arr = mapped[0].data
	//		setTest(arr)
	//		console.log(volume, "volumen")
	//		console.log(timeseries, "timeseries")
	//	} else {
	//		console.log("mapped is empty or undefined");
	//	}
	//
	//}, [mapped])

	//function printIds(objects: IndicatorChart[]) {
	//	objects.forEach(obj => {
	//		if ('id' in obj) {
	//			console.log(obj.id);
	//		} else {
	//			console.log("Object does not have an 'id' property.");
	//		}
	//	});
	//}

	const [indicators, setIndicators] = useState<{ name: string; data: any[] }[]>([]);
	const chartContainerRef = useRef<HTMLDivElement>(null);

	const addIndicator = (name: string, color: string, data: any[]) => {
		setIndicators((prev) => [...prev, { name, color, data }]);
	};

	//const removeIndicator = (name: string) => {
	//	setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	//};

	function updateIndicator(id: number) {

	}

	function loadIndicators(mapped: IndicatorChart[]) {

		//mapped.forEach(indicator => {
		//	addIndicator(indicator.name, "hotpink", indicator.data)
		//});
	}

	return (
		<div className="w-full h-full">
			<div>
				{mapped.map((indicators) => (
					<button
						key={indicators.id}
						id={indicators.id.toString()}
						onClick={() => updateIndicator(indicators.id)}
					>
						{indicators.name}
					</button>
				))}
			</div>
			<div className="mb-4">
				<button
					onClick={() =>
						addIndicator(sma, "hotpink", test)
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

			{
				true && (
					<ChartCanvas
						chartContainerRef={chartContainerRef}
						data={timeseries}
						volume={volume}
						indicators={indicators}
					/>
				)
			}
		</div>
	);
}

//onClick={() =>
//	addIndicator(test, [
//		{ time: '2022-01-01', value: 50 },
//		{ time: '2022-01-02', value: 52 },
//	])
//}
//
