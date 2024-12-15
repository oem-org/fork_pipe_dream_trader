


import { IChartApi } from 'lightweight-charts';

class LineSeries {
	public data: any[];

	constructor(data: any[]) {
		this.data = data;
	}

	create(chart: IChartApi, topMargin: number, bottomMargin: number) {
		const lineSeries = chart.addLineSeries({
			color: '#FF0000',
			priceLineVisible: false,
		});
		lineSeries.priceScale().applyOptions({
			scaleMargins: {
				top: topMargin,
				bottom: bottomMargin,
			},
		});

		lineSeries.setData(this.data);
	}
}

export default LineSeries;

