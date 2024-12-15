import { useChartStore } from "@/lib/hooks/useChartStore";

import { IChartApi } from 'lightweight-charts';

class Histogram {
	public data: any[];

	constructor(data: any[]) {
		this.data = data;
	}

	create(chart: IChartApi, topMargin: number, bottomMargin: number) {
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
}

export default Histogram;
