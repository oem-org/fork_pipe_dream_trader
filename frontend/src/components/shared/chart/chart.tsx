import { useEffect, useState } from 'react';

import ChartCanvas from './chart-canvas';

export function Chart() {

	const customData = [
		{ time: '2024-11-01', value: 25.50 },
		{ time: '2024-11-02', value: 27.85 },
		{ time: '2024-11-03', value: 28.90 },
		{ time: '2024-11-04', value: 30.10 },
		{ time: '2024-11-05', value: 29.50 },
		{ time: '2024-11-06', value: 32.30 },
		{ time: '2024-11-07', value: 33.60 },
		{ time: '2024-11-08', value: 34.00 },
		{ time: '2024-11-09', value: 35.10 },
		{ time: '2024-11-10', value: 36.20 },
	];

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
				data={customData}
				colors={customColors}
			/>
		</div>
	);
}
