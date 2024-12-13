let test = {
	"1684886400000": { "time": 1684886400000, "date": "2023-05-24", "symbol": "POLSBUSD", "open": 0.36, "high": 0.36, "low": 0.339, "close": 0.346, "volume pols": 47302.1, "volume": 16372.7486, "tradecount": 221, "CUMLOGRET_1": 0.2985306872, "CUMPCTRET_1": 0.3478768991, "SMA_10": 0.3468 },
	"1684800000000": { "time": 1684800000000, "date": "2023-05-23", "symbol": "POLSBUSD", "open": 0.356, "high": 0.365, "low": 0.355, "close": 0.36, "volume pols": 52188.9, "volume": 18824.4616, "tradecount": 125, "CUMLOGRET_1": 0.3381959436, "CUMPCTRET_1": 0.4024152707, "SMA_10": 0.348 },
	"1684713600000": { "time": 1684713600000, "date": "2023-05-22", "symbol": "POLSBUSD", "open": 0.358, "high": 0.365, "low": 0.353, "close": 0.356, "volume pols": 92311.4, "volume": 32957.4452, "tradecount": 358, "CUMLOGRET_1": 0.327022643, "CUMPCTRET_1": 0.3868328788, "SMA_10": 0.3493 }
}



let formattedData = Object.values(test).map(data => ({
	// Format time to 'YYYY-MM-DD HH:mm:ss'
	time: new Date(data.time).toISOString().split('T').join(' ').split('.')[0],
	open: data.open,
	high: data.high,
	low: data.low,
	close: data.close
}));

console.log(formattedData);

