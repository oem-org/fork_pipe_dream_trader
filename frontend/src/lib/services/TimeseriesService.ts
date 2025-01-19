import Timeseries from "@/interfaces/Timeseries";
import { Volume, VolumeBackend } from "@/interfaces/Volume";
import { IndicatorChart } from "@/interfaces/IndicatorChart";
import { UTCTimestamp } from "lightweight-charts";
// TODO: fix typing errors
export default class TimeseriesService {
	public ohlc: Timeseries[];
	public volume: Volume[];
	public indicators: Record<string, any>;

	constructor() {
		this.ohlc = [];
		this.volume = [];
		this.indicators = {};
	}

	formatTimestamp(timestamp: any) {
		// Print the type and value of timestamp
		//console.log('Type of timestamp:', typeof timestamp);
		//console.log('Value of timestamp:', timestamp);
		let modifiedTimestamp = Math.floor(timestamp / 1000);
		timestamp = modifiedTimestamp
		//console.log('Modified Timestamp:', modifiedTimestamp);
		return timestamp as UTCTimestamp
	}
	async updateChart(indicatorInfo: Record<string, any>) {

		const mappedIndicators: IndicatorChart[] = [];

		for (let key in indicatorInfo) {
			// Key is dataframe column name fx "RSI_14"
			mappedIndicators.push({
				"name": `${key}`,
				"chartStyle": indicatorInfo[key].indicator_info,
				"id": indicatorInfo[key].id,
				"data": this.indicators[key]
			});
		}

		return mappedIndicators;
	}

	// TODO: add types
	async processBulk(indicatorsTimeseries: Record<string, any>): Promise<void> {

		// Saved time and value for each KeyName corresponding to the dataframe columns
		const notAllowedKeys = ["time", "volume pols", "columns", "pair"];

		for (const keyName in indicatorsTimeseries) {
			let indicator: any = [];
			if (notAllowedKeys.includes(keyName)) {
				continue;
			} else {
				Object.values(indicatorsTimeseries[keyName]).forEach((data: any) => {
					indicator.push({
						time: this.formatTimestamp(data.time),  // Divide by 1000 and convert to integer
						value: data[keyName],
					});
				});

				this.indicators[keyName] = indicator;
			}
		}
	}

	async processVolume(volume: VolumeBackend[]): Promise<void> {
		Object.values(volume).forEach((data) => {
			this.volume.push({
				time: this.formatTimestamp(data.time),  // Divide by 1000 and convert to integer
				value: data.volume,
			});
		});
	}

	async processOhlc(ohlc: Timeseries[]): Promise<void> {
		this.ohlc = [];

		Object.values(ohlc).forEach((data) => {
			this.ohlc.push({
				time: this.formatTimestamp(data.time),  // Divide by 1000 and convert to integer
				open: data.open,
				high: data.high,
				low: data.low,
				close: data.close,
			});
		});
	}
}
