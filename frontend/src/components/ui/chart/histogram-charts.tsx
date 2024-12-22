import React from "react";
import { IndicatorChart } from "@/interfaces/IndicatorChart";
import ChartHistogram from "./chart-histogram";

const HistogramCharts = React.memo(
	({ data }: { data: IndicatorChart[] }) => {
		return (
			<>
				{data.map((histogram, index) => (
					<div className="w-full h-40" key={index}>
						<ChartHistogram
							chartContainerRef={React.createRef()}
							data={histogram.data}
						/>
					</div>
				))}
			</>
		);
	}
);

export default HistogramCharts;
