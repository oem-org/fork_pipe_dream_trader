//import { IndicatorBase } from "@/interfaces/indicators/IndicatorBase";
import Timeseries from "@/interfaces/Timeseries";
import { Volume, VolumeBackend } from "@/interfaces/Volume";

export default class TimeseriesService {
	public ohlc: Timeseries[];
	public volume: Volume[];
	//public ao: IndicatorBase[];

	constructor() {
		this.ohlc = [];
		this.volume = [];
		//this.ao = [];
		//this.indicators = {}
	}

	// Lightweight charts accept UTCtimestamp, BuisnessDay or buisness day string in ISO format
	// https://tradingview.github.io/lightweight-charts/docs/api#time

	//async processBulk(obj: Record<string, any>) {
	//	const allIndicators: Record<string, any> = {}; // Create an object to store the results
	//	for (const key in obj) {
	//		if (obj.hasOwnProperty(key)) {
	//			const indicator = [];
	//			// Iterate over the values of the object (assuming each key maps to an array)
	//			obj[key].forEach((data: any) => {
	//				indicator.push({
	//					time: data.time,
	//					value: data[key], // Use the key to get the corresponding value
	//				});
	//			});
	//			// Store the processed data in the allIndicators object with the key name as identifier
	//			allIndicators[key] = indicator;
	//		}
	//	}
	//	return allIndicators; // Return the object with the processed data
	//}

	async processVolume(volume: VolumeBackend[]) {
		Object.values(volume).forEach((data) => {

			this.volume.push({
				time: data.time,
				value: data.volume,
			});
		});
	}

	async processOhlc(ohlc: Timeseries[]) {
		this.ohlc = [];
		this.volume = [];

		Object.values(ohlc).forEach((data) => {
			this.ohlc.push({
				time: data.time,
				open: data.open,
				high: data.high,
				low: data.low,
				close: data.close,
			});

		});
	}
}
