import Timeseries from "@/interfaces/Timeseries";

interface TimeseriesService {
	candlesticks: Timeseries[]
}


export default class FileTimeseriesService implements TimeseriesService {
	constructor() {

	}

	candlesticks(): Timeseries[];
}
