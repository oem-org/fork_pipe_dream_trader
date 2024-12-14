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


	async processBulk(obj: Record<string, any>) {
		for (const key in obj) {
			try {
				console.log((obj[key]));

			} catch (error) {
				console.warn(`Key "${key}" contains invalid JSON:`, obj[key]);
			}
		}
		return obj; // Return the updated object
	}

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
