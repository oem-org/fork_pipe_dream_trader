import { IndicatorChart } from "@/interfaces/IndicatorChart";
import ChartLine from "./chart-line";
import React from "react";


const LinePaneCharts = React.memo(({ data }: { data: IndicatorChart[] }) => {
	return (
		<>
			{data.map((lineSeriesPane, index) => (
				<div className="w-full h-40" key={index}>
					<ChartLine
						chartContainerRef={React.createRef()}
						data={lineSeriesPane.data}
					/>
				</div>
			))}
		</>
	);
}
);

export default LinePaneCharts
