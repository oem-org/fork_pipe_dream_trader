import Timeseries from "@/interfaces/Timeseries";
import Volume from "@/interfaces/Volume";

export default class TimeseriesService {
	public ohlc: Timeseries[];
	public volume: Volume[];

	constructor() {
		this.ohlc = [];
		this.volume = [];
	}

	// Lightweight charts accept UTCtimestamp, BuisnessDay or buisness day string in ISO format
	// https://tradingview.github.io/lightweight-charts/docs/api#time
	processOHLC(rawData: Record<string, any>) {
		this.ohlc = [];
		this.volume = [];

		// Javascript references to the same string object in both ohlc and volume
		Object.values(rawData).forEach((data) => {
			// Format time to 'YYYY-MM-DD HH:mm:ss'
			//const formattedTime = new Date(data.time).toISOString().split('T').join(' ').split('.')[0];

			this.ohlc.push({
				time: data.time,
				open: data.open,
				high: data.high,
				low: data.low,
				close: data.close,
			});

			this.volume.push({
				time: data.time,
				value: data.volume,
			});
		});
	}
}
