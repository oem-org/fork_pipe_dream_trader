import { useRef, useEffect, useState } from 'react';
import Timeseries from '@/interfaces/Timeseries';
import ChartCanvas from './chart-canvas';

interface ChartProps {
	timeseries: Timeseries[]
}

export function Chart({ timeseries }: ChartProps) {


	const customColors = {
		backgroundColor: '#f5f5f5',
		lineColor: '#FF5722',
		textColor: '#212121',
		areaTopColor: '#FF5722',
		areaBottomColor: 'rgba(255, 87, 34, 0.2)',
	};

	const chartContainerRef = useRef<HTMLDivElement>(null);


	return (
		<div ref={chartContainerRef} className="w-full h-full rounded-lg">
			<ChartCanvas chartContainerRef={chartContainerRef} data={timeseries} />
		</div>
	);
}
