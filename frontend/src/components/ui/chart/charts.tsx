

import React from 'react';
import LineChartPanes from './line-pane-charts';
import LineCharts from './line-charts';
import HistogramCharts from './histogram-charts';
import { useChartStore } from '@/lib/hooks/useChartStore';


const Charts = React.memo(() => {
	const { lineSeries, lineSeriesPanes, histograms, timeseries, volume } = useChartStore()

	return (
		<>
			<LineCharts data={lineSeries} timeseries={timeseries} volume={volume} />
			<LineChartPanes data={lineSeriesPanes} />
			<HistogramCharts data={histograms} />
		</>
	);
})
export default Charts
