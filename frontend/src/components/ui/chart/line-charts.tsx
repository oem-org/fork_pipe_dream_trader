import React from "react";
import ChartCanvas from "./chart-canvas";
import { IndicatorChart } from "@/interfaces/IndicatorChart";
import Timeseries from "@/interfaces/Timeseries";
import { Volume } from "@/interfaces/Volume";

interface LineChartProps {
	data: IndicatorChart[];
	timeseries: Timeseries[];
	volume: Volume[];
}

const LineCharts = React.memo(({ data, timeseries, volume }: LineChartProps) => {
	console.log(data, "CHARTS DATAAAAAAAAAAAAAAAAAAa");
	return data.length > 0 ? (
		<div className="w-full h-80 relative rounded-tl-lg rounded-tr-lg overflow-hidden">
			<ChartCanvas
				indicators={data}
				chartContainerRef={React.createRef()}
				volume={volume}
				data={timeseries}
			/>
		</div>
	) : (
		<div className="w-full h-80 relative rounded-tl-lg rounded-tr-lg overflow-hidden">
			<ChartCanvas
				indicators={[]}
				chartContainerRef={React.createRef()}
				volume={volume}
				data={timeseries}
			/>
		</div>
	);
});

export default LineCharts;
