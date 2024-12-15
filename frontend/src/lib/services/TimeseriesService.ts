//import { IndicatorBase } from "@/interfaces/indicators/IndicatorBase";
import Timeseries from "@/interfaces/Timeseries";
import { Volume, VolumeBackend } from "@/interfaces/Volume";
import { findStringIndex } from "../utils/string-utils";


export default class TimeseriesService {
	public ohlc: Timeseries[];
	public volume: Volume[];
	public indicators: Record<string, any>
	//public ao: IndicatorBase[];

	constructor() {
		this.ohlc = [];
		this.volume = [];
		this.indicators = {}
	}


	updateChart(chartStyles: Record<string, any>, column: Array<string>) {
		console.log(column, "column");

		for (let key in chartStyles) {
			console.log(key, "KEEEEEEEEEEEEEEEEEY");

		}
	}


	async processBulk(indicatorsTimeseries: Record<string, any>) {
		// Saved time and value for each KeyName corrosponding to the dataframe columns
		const notAllowedKeys = ["time", "volume pols", "columns", "pair"];

		for (const keyName in indicatorsTimeseries) {
			let indicator = []
			if (notAllowedKeys.includes(keyName)) {
				continue;
			} else {
				Object.values(indicatorsTimeseries[keyName]).forEach((data) => {
					indicator.push({
						time: data.time,
						value: data[keyName]
					});
				});

				this.indicators[keyName] = indicator
			}
		}
		console.log("FINALLY");

		console.log("INDICATORS!!!!!!!", this.indicators);

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
