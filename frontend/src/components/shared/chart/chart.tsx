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

export function Chart() {
	let timeperiod = "recent"
	const { strategyId } = useStrategyStore()
	const [key, setKey] = useState(0);
	const [mapped, setMapped] = useState<IndicatorChart[]>([])
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [histograms, setHistograms] = useState<any>([])

	const chartContainerRef = useRef<HTMLDivElement>(null);


	const reloadChart = () => {
		setKey(prevKey => prevKey + 1); // Increment the key to trigger a remount
	};

	const [indicators, setIndicators] = useState<{ name: string; data: any[] }[]>([]);
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
			console.log(strategyId, "IDDD", mapped)
			setTimeseries(timeseriesService.ohlc); // Update OHLC
			setVolume(timeseriesService.volume);  // Update Volume

		}
		loadData()

	}, [strategyId])

	useEffect(() => {
		let hist = []
		indicators.forEach((indicator) => {
			if (indicator.chartStyle === "histogram")
				hist.push(indicator)
		})
		setHistograms(hist)
		console.log("hist", hist);

	}, [indicators])



	let sma = "SMA"
	let arr = []

	let t = [{
		"time": 1621382400000,
		"value": 2.5017735294
	},
	{
		"time": 1621468800000,
		"value": 5.3788264706
	},
	{
		"time": 1621555200000,
		"value": 9.3206029412
	},
	{
		"time": 1621641600000,
		"value": 3.2980470588
	},
	{
		"time": 1621728000000,
		"value": 3.3684176471
	},]
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


	const addIndicator = (name: string, color: string, data: any[]) => {
		setIndicators((prev) => [...prev, { name, color, data }]);
	};

	//const removeIndicator = (name: string) => {
	//	setIndicators((prev) => prev.filter((indicator) => indicator.name !== name));
	//};

	function updateIndicator(id: number) {

	}

	function loadIndicators(mapped: IndicatorChart[]) {

		mapped.forEach(indicator => {
			addIndicator(indicator.name, "hotpink", indicator.data)
		});
	}

	return (
		<div className="w-full h-full">
			<button onClick={reloadChart} className="px-4 py-2 bg-green-500 text-white rounded">
				Reload Chart
			</button>
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
						addIndicator(sma, "hotpink", t)
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
			<ChartCanvas key={key}
				chartContainerRef={chartContainerRef}
				data={timeseries}
				volume={volume}
				indicators={indicators}
			/>

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
