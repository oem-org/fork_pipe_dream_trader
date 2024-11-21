import { create } from "zustand"

import Strategy from "../models/Strategy" 
import { StrategiesClient } from "../services/ApiClientInstances"


interface StrategyStore {
strategies: Strategy[]
selectedId: number | null
setStrategies: (strategies: Strategy[]) => void
setStrategyId: (id: number) => void
getById: () => Strategy | undefined
}

const strategyStore = create<StrategyStore>((set, get) => ({
    strategies: [],
    selectedId: null,
    setStrategies: (strategies: Strategy[]) => set(() => ({ strategies })),
    setStrategyId: (id: number) => set(() => ({ selectedId: id })),
  
    getById: () => {
        const { strategies, selectedId } = get()
        console.log(`Selected ID: ${selectedId}`)
        console.log(`Strategies: ${JSON.stringify(strategies)}`)
        const foundStrategy = strategies.find((strategy) => strategy.id === selectedId)
        console.log(`Found strategy: ${JSON.stringify(foundStrategy)}`)
        return foundStrategy
      },
  }))

export default strategyStore


