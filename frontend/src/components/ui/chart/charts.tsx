import ChartCanvas from './chart-canvas';
import ChartLine from './chart-line';
import ChartHistogram from './chart-histogram';
import React, { useEffect, useRef, useState } from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
import { queryClient } from '@/main';

interface ChartsProps {
	fileId: number
}

export default function Charts({ fileId }: ChartsProps) {
	let timeperiod = "recent"
	const { strategyId } = useStrategyStore()
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [histograms, setHistograms] = useState<IndicatorChart[]>([])
	const [lineSeries, setLineSeries] = useState<IndicatorChart[]>([])
	const [lineSeriesPanes, setLineSeriesPanes] = useState<IndicatorChart[]>([])
	const [indicators, setIndicators] = useState<IndicatorChart[]>([]);

	const histogramsRefs = useRef<(HTMLDivElement)[]>([]);
	const lineSeriesPanesRefs = useRef<(HTMLDivElement)[]>([]);
	const lineSeriesRefs = useRef<(HTMLDivElement)[]>([]);
	const emptyChartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		async function loadData() {
			if (strategyId | fileId) {
				const data = await getTimeseriesApi.getQueryString(`timeperiod=${timeperiod}&strategy=${strategyId}`);
				const parsed = parseJsonStrings(data);
				console.log(parsed, "parsed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

				const timeseriesService = new TimeseriesService();
				await timeseriesService.processOhlc(parsed.ohlc);
				await timeseriesService.processVolume(parsed.volume);
				const indicatorInfo = parsed.indicator_info;
				delete parsed.ohlc;
				delete parsed.volume;
				delete parsed.indicator_info;
				await timeseriesService.processBulk(parsed);
				const mapped = await timeseriesService.updateChart(indicatorInfo);
				console.log(mapped, "MAPPED")
				setIndicators(mapped)

				setTimeseries(timeseriesService.ohlc);
				setVolume(timeseriesService.volume);
				queryClient.invalidateQueries({ queryKey: ['strategyIndicators'] })
			}
		}
		loadData()

	}, [strategyId, fileId])


	useEffect(() => {
		const hists: IndicatorChart[] = [];
		const lines: IndicatorChart[] = [];
		const linePanes: IndicatorChart[] = [];
		indicators.forEach((indicator) => {
			if (indicator.chartStyle === "histogram") {
				hists.push(indicator)
			}
			if (indicator.chartStyle === "line_add_pane") {
				linePanes.push(indicator)
			}
			if (indicator.chartStyle === "line") {
				lines.push(indicator)
			}
		})
		setHistograms(hists)
		setLineSeries(lines)
		setLineSeriesPanes(linePanes)

		histogramsRefs.current = hists.map((_, index) => histogramsRefs.current[index] || React.createRef());
		lineSeriesRefs.current = lines.map((_, index) => lineSeriesRefs.current[index] || React.createRef());
		lineSeriesPanesRefs.current = linePanes.map((_, index) => lineSeriesPanesRefs.current[index] || React.createRef());

	}, [indicators])
	//TODO: add line color to backend
	return (
		<>


			{lineSeries.length > 0 ? (
				lineSeries.map((line, index) => (
					<div className='w-full h-80 relative' key={index}>

						<p className="absolute top-0 left-0 p-2 z-50 rounded text-white">
							{}

						</p>
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


			{lineSeriesPanes.map((lineSeriesPane, index) => (
				<div className='w-full h-40' key={index} >
					<ChartLine
						chartContainerRef={lineSeriesPanesRefs.current[index]}
						// Pass only 1 array of data
						data={lineSeriesPane.data}
					/>
				</div>
			))}


			{histograms.map((histogram, index) => (
				<div className='w-full h-40' key={index} >
					<ChartHistogram
						chartContainerRef={histogramsRefs.current[index]}
						// Pass only 1 array of data
						data={histogram.data}
					/>
				</div>
			))}

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
