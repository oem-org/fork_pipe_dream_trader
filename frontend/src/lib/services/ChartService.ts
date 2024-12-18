import Histogram from "@/components/ui/chart/histogram"


export default class ChartService {
	private indicatorInfo: Record<string, any>
	private indicatorData: Record<string, any>

	constructor(indicatorInfo: Record<string, any>, indicatorData: Record<string, any>) {
		this.indicatorInfo = indicatorInfo
		this.indicatorData = indicatorData
	}

	addIndicators() {
		for (let key in this.indicatorInfo) {
			console.log(key, "KEEEEEEEEEEEEEEEEEY");

		}
	}

}
