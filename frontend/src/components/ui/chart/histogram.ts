import { IChartApi } from 'lightweight-charts';
interface ChartHistogram {
	create(chart: IChartApi, topMargin: number, bottomMargin: number): void
}

class Histogram implements ChartHistogram {
	public data: any[];
	private name: string;

	constructor(data: any[], name: string = 'Histogram') {
		this.data = data;
		this.name = name;
	}

	create(chart: IChartApi, topMargin: number, bottomMargin: number) {
		console.log(chart, "chart")
		const histogram = chart.addHistogramSeries({
			priceFormat: { type: 'volume' },
			priceScaleId: '',
		});

		histogram.priceScale().applyOptions({
			scaleMargins: {
				top: topMargin,
				bottom: bottomMargin,
			},
		});

		histogram.setData(this.data);
	}

	getName(): string {
		return this.name;
	}

	setName(newName: string): void {
		this.name = newName;
	}
}

export default Histogram;
