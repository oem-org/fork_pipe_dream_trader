export default class TimeseriesService {
	private data: Record<any, any>;

	constructor(data: Record<any, any>) {
		this.data = data;
	}

	getOHLC() {
		return Object.values(this.data).map((data) => {
			// Format time to 'YYYY-MM-DD HH:mm:ss'
			const formattedTime = new Date(data.time).toISOString().split('T').join(' ').split('.')[0];

			return {
				ohlc: {
					time: formattedTime,
					open: data.open,
					high: data.high,
					low: data.low,
					close: data.close,
				},
				volume: {
					time: formattedTime,
					value: data.volume,
				}
			};
		});
	}
}

