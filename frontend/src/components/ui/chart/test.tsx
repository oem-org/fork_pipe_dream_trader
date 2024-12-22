
import ChartCanvas from './chart-canvas';
import ChartLine from './chart-line';
import ChartHistogram from './chart-histogram';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
import { queryClient } from '@/main';

interface ChartsProps {
	strategyId: number;
	fileId: number | undefined;
}


const Charts = memo(function Charts({ strategyId, fileId }: ChartsProps) {
	const timeperiod = 'recent';
	const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
	const [volume, setVolume] = useState<Volume[]>([]);
	const [indicators, setIndicators] = useState<IndicatorChart[]>([]);
	const histogramsRefs = useRef<(HTMLDivElement)[]>([]);
	const lineSeriesPanesRefs = useRef<(HTMLDivElement)[]>([]);
	const lineSeriesRefs = useRef<(HTMLDivElement)[]>([]);
	const emptyChartRef = useRef<HTMLDivElement>(null);
	console.log("CHAAAAAAAART", strategyId, fileId)
	// Function to load data
	const loadData = useCallback(async () => {
		if (strategyId | fileId) {
			console.log("GG")
			const data = await getTimeseriesApi.getQueryString(`timeperiod=${timeperiod}&strategy=${strategyId}`);
			const parsed = parseJsonStrings(data);
			const timeseriesService = new TimeseriesService();

			// Processing OHLC and volume data
			await timeseriesService.processOhlc(parsed.ohlc);
			await timeseriesService.processVolume(parsed.volume);

			const indicatorInfo = parsed.indicator_info;
			delete parsed.ohlc;
			delete parsed.volume;
			delete parsed.indicator_info;
			await timeseriesService.processBulk(parsed);

			// Mapped indicators
			const mapped = await timeseriesService.updateChart(indicatorInfo);

			setIndicators(mapped);
			setTimeseries(timeseriesService.ohlc);
			setVolume(timeseriesService.volume);

			queryClient.invalidateQueries({ queryKey: ['strategyIndicators'] });
		}
	}, [strategyId, fileId]);

	// Fetch data when `strategyId` or `fileId` changes
	useEffect(() => {
		loadData();
	}, [strategyId, fileId, loadData]);

	// Memoize filtered data based on chart style
	const histogramsMemo = useMemo(() => {
		return indicators.filter(indicator => indicator.chartStyle === 'histogram');
	}, [indicators]);

	const lineSeriesMemo = useMemo(() => {
		return indicators.filter(indicator => indicator.chartStyle === 'line');
	}, [indicators]);

	const lineSeriesPanesMemo = useMemo(() => {
		return indicators.filter(indicator => indicator.chartStyle === 'line_add_pane');
	}, [indicators]);

	// Render the charts only when data exists
	return (
		<>
			{lineSeriesMemo.length > 0 ? (
				lineSeriesMemo.map((line, index) => (
					<div className="w-full h-80 relative" key={index}>
						<ChartCanvas
							indicators={[line]}
							chartContainerRef={lineSeriesRefs.current[index]}
							volume={volume}
							data={timeseries}
						/>
					</div>
				))
			) : (
				<div className="w-full h-80" key="empty">
					<ChartCanvas
						indicators={[]}
						chartRef={emptyChartRef}
						volume={volume}
						data={timeseries}
					/>
				</div>
			)}

			{lineSeriesPanesMemo.length > 0 && lineSeriesPanesMemo.map((lineSeriesPane, index) => (
				<div className="w-full h-40" key={index}>
					<ChartLine
						chartRef={lineSeriesPanesRefs.current[index]}
						data={lineSeriesPane.data}
					/>
				</div>
			))}

			{histogramsMemo.length > 0 && histogramsMemo.map((histogram, index) => (
				<div className="w-full h-40" key={index}>
					<ChartHistogram
						chartRef={histogramsRefs.current[index]}
						data={histogram.data}
					/>
				</div>
			))}
		</>
	);
});

export default Charts;
