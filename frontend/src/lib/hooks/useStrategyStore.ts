import { create } from "zustand"
import { Strategy } from "../../interfaces/Strategy"

interface StrategyStore {
	strategies: Strategy[]
	strategyId: number
	setStrategies: (strategies: Strategy[]) => void
	setStrategyId: (id: number) => void
	getById: () => Strategy | null
}

const useStrategyStore = create<StrategyStore>((set, get) => ({
	strategies: [],
	strategyId: 0,
	setStrategies: (strategies: Strategy[]) => set(() => ({ strategies })),
	setStrategyId: (id: number) => set(() => ({ strategyId: id })),

	getById: () => {
		const { strategies, strategyId } = get()
		console.log(`Selected ID: ${strategyId}`)
		console.log(`Strategies: ${JSON.stringify(strategies)}`)
		const foundStrategy = strategies.find((strategy) => strategy.id === strategyId)
		console.log(`Found strategy: ${JSON.stringify(foundStrategy)}`)
		return foundStrategy || null
	},
}))

export default useStrategyStore


