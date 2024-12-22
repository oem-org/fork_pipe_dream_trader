import React from "react";
import ChartCanvas from "./chart-canvas";
import { IndicatorChart } from "@/interfaces/IndicatorChart";
import Timeseries from "@/interfaces/Timeseries";
import { Volume } from "@/interfaces/Volume";

interface LineChartProps { data: IndicatorChart[], timeseries: Timeseries[], volume: Volume[] }

const LineCharts = React.memo(({ data, timeseries, volume }: LineChartProps) => {
	return data.length > 0 ? (
		data.map((line, index) => (
			<div className="w-full h-80 relative" key={index}>
				<ChartCanvas
					indicators={[line]}
					chartContainerRef={React.createRef()}
					volume={volume}
					data={timeseries}
				/>
			</div>
		))
	) : (<div>hej</div>
	);
}
);

export default LineCharts
