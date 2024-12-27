import LineChartPanes from './line-pane-charts';
import LineCharts from './line-charts';
import HistogramCharts from './histogram-charts';
import { useChartStore } from '@/lib/hooks/stores/useChartStore';

//TODO: add colors
export default function Charts() {
	const { lineSeries, lineSeriesPanes, histograms, timeseries, volume } = useChartStore()

	//All charts receive an array of indicators
	//LineCharts maps them all on a single chart, the rest generate 1 chart pr indicator

	return (
		<>
			<LineCharts data={lineSeries} timeseries={timeseries} volume={volume} />
			<LineChartPanes data={lineSeriesPanes} />
			<HistogramCharts data={histograms} />
		</>
	);
}
