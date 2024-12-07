import { useEffect, useState } from 'react';
import Timeseries from '@/interfaces/Timeseries';
import ChartCanvas from './chart-canvas';

interface ChartProps {
	timeseries: Timeseries[]
}

export function Chart({ timeseries }: ChartProps) {


	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	})

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const customColors = {
		backgroundColor: '#f5f5f5', // Light gray background
		lineColor: '#FF5722', // Orange line color
		textColor: '#212121', // Dark text color
		areaTopColor: '#FF5722', // Orange area top color
		areaBottomColor: 'rgba(255, 87, 34, 0.2)', // Lighter orange bottom area color
	};

	return (
		<div>
			<ChartCanvas windowSize={windowSize.width}
				data={timeseries}
				colors={customColors}
			/>
		</div>
	);
}
