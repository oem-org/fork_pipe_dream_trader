import ChartCanvas from './chart-canvas';
import ChartHistogram from './chart-histogram';
import React, { useEffect, useRef, useState } from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
export default function Charts() {
	let timeperiod = "recent"
	const { strategyId } = useStrategyStore()
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [histograms, setHistograms] = useState<IndicatorChart[]>([])
	const [lineSeries, setLineSeries] = useState<IndicatorChart[]>([])
	const [indicators, setIndicators] = useState<IndicatorChart[]>([]);

	const histogramsRefs = useRef<(HTMLDivElement)[]>([]);
	const lineSeriesRefs = useRef<(HTMLDivElement)[]>([]);
	const emptyChartRef = useRef<HTMLDivElement>(null);

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

			setTimeseries(timeseriesService.ohlc);
			setVolume(timeseriesService.volume);
		}
		loadData()

	}, [strategyId])


	useEffect(() => {
		const hist: IndicatorChart[] = [];
		const line: IndicatorChart[] = [];
		indicators.forEach((indicator) => {
			if (indicator.chartStyle === "histogram") {
				hist.push(indicator)
			}
			if (indicator.chartStyle === "line_add_pane") {
				line.push(indicator)
			}
		})
		setHistograms(hist)
		setLineSeries(line)

		// Dynamically create refs for each histogram
		histogramsRefs.current = hist.map((_, index) => histogramsRefs.current[index] || React.createRef());
		// Dynamically create refs for each line series
		lineSeriesRefs.current = line.map((_, index) => lineSeriesRefs.current[index] || React.createRef());

	}, [indicators])
	//TODO: add line color to backend
	return (
		<>
			{histograms.map((histogram, index) => (
				<div className='w-full h-40' key={index} >
					<ChartHistogram
						chartContainerRef={histogramsRefs.current[index]}
						volume={volume}
						// Pass only 1 array of data
						histogramData={histogram.data}
					/>
				</div>
			))}

			{lineSeries.length > 0 ? (
				lineSeries.map((line, index) => (
					<div className='w-full h-80' key={index}>
						<ChartCanvas
							// Pass list of lineSeries
							indicators={[line]}
							chartContainerRef={lineSeriesRefs.current[index]}
							volume={volume}
							data={timeseries}
						/>
					</div>
				))
			) : (
				<div className='w-full h-80' key="empty">
					<ChartCanvas
						// Pass list of lineSeries
						indicators={[]}
						chartContainerRef={emptyChartRef}
						volume={volume}
						data={timeseries}
					/>
				</div>
			)}
		</>
	)
}


//{/* Main Chart with OHLC */}
//<Chart
//	indicators={lineSeries}
//	chartContainerRef={chartRefs[0]}
//	volume={volume}
//	timeseries={timeseries}
///>
//
//{/* Main Volume Chart */}
//<ChartHistogram
//	chartContainerRef={chartRefs[1]}
//	volume={volume}
///>
//
//{/* Dynamic Histograms */}
//
