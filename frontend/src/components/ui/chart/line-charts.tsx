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
	return data.length > 0 ? (
		<div style={{ height: "28rem" }} className="w-full h-96 relative rounded-tl-lg rounded-tr-lg overflow-hidden">
			<ChartCanvas
				indicators={data}
				chartContainerRef={React.createRef()}
				volume={volume}
				data={timeseries}
			/>
		</div>
	) : (
		<div style={{ height: "28rem" }} className="w-full h-96 relative rounded-tl-lg rounded-tr-lg overflow-hidden">
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
