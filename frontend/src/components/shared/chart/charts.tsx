import { Chart } from './chart'
import ChartHistogram from './chart-histogram';
import React, { useEffect, useRef, useState } from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
import { LineSeries } from '@/interfaces/types/LineSeries';

export default function Charts() {
	let timeperiod = "recent"
	const { strategyId } = useStrategyStore()
	const [key, setKey] = useState(0);
	const [mapped, setMapped] = useState<IndicatorChart[]>([])
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [histograms, setHistograms] = useState<any>([])
	const [lineSeries, setLineSeries] = useState<any>([])
	const chartContainerRef1 = useRef<HTMLDivElement>(null);
	const chartContainerRef2 = useRef<HTMLDivElement>(null);
	const [indicators, setIndicators] = useState<{ name: string; color: "string", data: LineSeries[] }[]>([]);

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

			//loadIndicators(mapped)
			console.log(strategyId, "IDDD", mapped)
			setTimeseries(timeseriesService.ohlc); // Update OHLC
			setVolume(timeseriesService.volume);  // Update Volume

		}
		loadData()

	}, [strategyId])


	useEffect(() => {
		let hist = []
		let line = []
		indicators.forEach((indicator) => {
			if (indicator.chartStyle === "histogram")
				hist.push(indicator)
			if (indicator.chartStyle === "line_add_pane")
				line.push(indicator)
		})
		setHistograms(hist)
		setLineSeries(line)
		console.log("hist", hist);

	}, [indicators])

	return (


		<>
			<Chart indicators={lineSeries} chartContainerRef={chartContainerRef1} volume={volume} timeseries={timeseries} />
			<ChartHistogram chartContainerRef={chartContainerRef2} volume={volume} />
		</>
	)
}

