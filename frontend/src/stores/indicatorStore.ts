import { create } from "zustand"

import Indicator from "../models/Indicator" 
import { IndicatorsClient } from "../services/ApiClientInstances"


interface IndicatorStore {
    indicators: Indicator[]
    indicatorId: number | null
    setIndicators: (indicators: Indicator[]) => void
    setIndicatorId: (id: number | undefined) => void
    getById: () => Indicator | undefined
}

const indicatorStore = create<IndicatorStore>((set, get) => ({
    indicators: [],
    indicatorId: null,
    setIndicators: (indicators: Indicator[]) => set(() => ({ indicators })),
    setIndicatorId: (id: number) => set(() => ({ indicatorId: id })),
  
    getById: () => {
        const { indicators, indicatorId } = get()
        console.log(`Selected ID: ${indicatorId}`)
        console.log(`Indicators: ${JSON.stringify(indicators)}`)
        const foundIndicator = indicators.find((indicator) => indicator.id === indicatorId)
        console.log(`Found indicator: ${JSON.stringify(foundIndicator)}`)
        return foundIndicator
    },
}))

export default indicatorStore