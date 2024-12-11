
let formattedData = Object.values(test).map(data => ({
	// Format time to 'YYYY-MM-DD HH:mm:ss'
	time: new Date(data.time).toISOString().split('T').join(' ').split('.')[0],
	open: data.open,
	high: data.high,
	low: data.low,
	close: data.close
}));
