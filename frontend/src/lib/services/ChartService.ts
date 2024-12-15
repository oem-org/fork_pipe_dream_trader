import Histogram from "@/components/shared/chart/histogram"


export default class ChartService {
	private chartStyles: Record<string, any>
	private indicatorData: Record<string, any>

	constructor(chartStyles: Record<string, any>, indicatorData: Record<string, any>) {
		this.chartStyles = chartStyles
		this.indicatorData = indicatorData
	}

	addIndicators() {
		for (let key in this.chartStyles) {
			console.log(key, "KEEEEEEEEEEEEEEEEEY");

		}
	}

}
