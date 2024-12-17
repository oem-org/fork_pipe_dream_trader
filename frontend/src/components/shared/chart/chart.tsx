import React, { useEffect, useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import ChartHistogram from './chart-histogram';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import TimeseriesService from '@/lib/services/TimeseriesService';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { getTimeseriesApi } from '@/lib/apiClientInstances';
import { parseJsonStrings } from '@/lib/utils/object-utils';
import { IndicatorChart } from '@/interfaces/IndicatorChart';
import { LineSeries } from '@/interfaces/types/LineSeries';

interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	volume: Volume[]
	timeseries: Timeseries[]
	indicators: { name: string; lineColor: string, data: LineSeries[] }[]; // List of active indicators
}

export function Chart({ indicators, timeseries, chartContainerRef, volume }: ChartProps) {

	return (
		<ChartCanvas
			chartContainerRef={chartContainerRef}
			data={timeseries}
			volume={volume}
			indicators={indicators}
		/>

	);
}

//			<button onClick={reloadChart} className="px-4 py-2 bg-green-500 text-white rounded">
//				Reload Chart
//			</button>
//			<div>
//				{mapped.map((indicators) => (
//					<button
//						key={indicators.id}
//						id={indicators.id.toString()}
//						onClick={() => updateIndicator(indicators.id)}
//					>
//						{indicators.name}
//					</button>
//				))}
//			</div>
//			<div className="mb-4">
//				<button
//					onClick={() =>
//						addIndicator(sma, "hotpink", t)
//					}
//					className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
//				>
//					Add SMA
//				</button>
//				<button
//					onClick={() => removeIndicator('SMA')}
//					className="px-4 py-2 bg-red-500 text-white rounded"
//				>
//					Remove SMA
//				</button>
//			</div>
////onClick={() =>
//	addIndicator(test, [
//		{ time: '2022-01-01', value: 50 },
//		{ time: '2022-01-02', value: 52 },
//	])
//}
//
