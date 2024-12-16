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
			setMapped(mapped)
			setTimeseries(timeseriesService.ohlc); // Update OHLC
			setVolume(timeseriesService.volume);  // Update Volume

		}
		loadData()

	}, [strategyId])

	useEffect(() => {
		console.log(mapped, "mapped");


	}, [mapped, volume, timeseries])





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
