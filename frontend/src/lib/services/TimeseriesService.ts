import { IndicatorBase } from "@/interfaces/indicators/IndicatorBase";
import Timeseries from "@/interfaces/Timeseries";
import { Volume, VolumeBackend } from "@/interfaces/Volume";
import { findStringIndex } from "../utils/string-utils";
import Histogram from "@/components/shared/chart/histogram";
import useChartStore from "../hooks/useChartStore";


export default class TimeseriesService {
	public ohlc: Timeseries[];
	public volume: Volume[];
	public indicators: Record<string, any>;

	constructor() {
		this.ohlc = [];
		this.volume = [];
		this.indicators = {};
	}

	async updateChart(indicatorInfo: Record<string, any>) {

		// Must access the fresh non reactive state of the store
		//

		const mappedIndicators = [];
		//const lineSeriesIndicators = [];
		//const mappedIndicators = [];

		for (let key in indicatorInfo) {
			// Key is dataframe column name fx "RSI_14"
			// The value stored in the key is chart styl

			mappedIndicators.push({ "name": `${key}`, "chartStyle": indicatorInfo[key].indicator_info, "id": indicatorInfo[key].id, "data": this.indicators[key] });  // Fixed template literal


			console.log(this.indicators[key]);
		}

		console.log("aaaaaaaaaaaaaaaaaaaaaaaindiCAT", mappedIndicators);
		return mappedIndicators
	}

	// TODO: add types
	async processBulk(indicatorsTimeseries: Record<string, any>) {
		// Saved time and value for each KeyName corresponding to the dataframe columns
		const notAllowedKeys = ["time", "volume pols", "columns", "pair"];

		for (const keyName in indicatorsTimeseries) {
			let indicator = [];
			if (notAllowedKeys.includes(keyName)) {
				continue;
			} else {
				Object.values(indicatorsTimeseries[keyName]).forEach((data) => {
					indicator.push({
						time: data.time,
						value: data[keyName],
					});
				});

				this.indicators[keyName] = indicator;
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
