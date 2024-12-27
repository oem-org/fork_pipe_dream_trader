import { create } from "zustand"
import Indicator from "../../interfaces/Indicator"

interface IndicatorStore {
	indicators: Indicator[]
	indicatorId: number
	setIndicators: (indicators: Indicator[]) => void
	setIndicatorId: (id: number) => void
	getById: () => Indicator | null
}

const useIndicatorStore = create<IndicatorStore>((set, get) => ({
	indicators: [],
	indicatorId: 0,
	setIndicators: (indicators: Indicator[]) => set(() => ({ indicators })),
	setIndicatorId: (id: number) => set(() => ({ indicatorId: id })),

	getById: () => {
		const { indicators, indicatorId } = get()
		console.log(`Selected ID: ${indicatorId}`)
		console.log(`Indicators: ${JSON.stringify(indicators)}`)
		const foundIndicator = indicators.find((indicator) => indicator.id === indicatorId)
		console.log(`Found indicator: ${JSON.stringify(foundIndicator)}`)
		return foundIndicator || null
	},
}))

export default useIndicatorStore
