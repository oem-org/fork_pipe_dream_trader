import Histogram from "@/components/shared/chart/histogram"


class ChartService {
	private chartStyles: Record<string, any>
	private indicatorData: Record<String, any>

	constructor(chartStyles: Record<string, any>, indicatorData: Record<string, any>) {
		this.chartStyles = chartStyles
		this.indicatorData = indicatorData
	}

	addIndicators() {

	}

}
