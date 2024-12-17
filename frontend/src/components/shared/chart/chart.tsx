import React, { useEffect, useRef, useState } from 'react';
import ChartCanvas from './chart-canvas';
import Timeseries from '../../../interfaces/Timeseries';
import { Volume } from '@/interfaces/Volume';
import { LineSeries } from '@/interfaces/types/LineSeries';

interface ChartProps {
	chartContainerRef: React.RefObject<HTMLDivElement>;
	volume: Volume[]
	timeseries: Timeseries[]
	indicators: LineSeries[];
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

