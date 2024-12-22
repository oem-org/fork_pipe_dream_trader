import { create } from "zustand"

interface StrategyStore {
	strategyId: number
	fileId: number | undefined
	setStrategyId: (id: number) => void
	setFileId: (id: number | undefined) => void
}

const useStrategyStore = create<StrategyStore>((set) => ({
	strategyId: 0,
	fileId: 0,
	setStrategyId: (id: number) => set(() => ({ strategyId: id })),
	setFileId: (id: number | undefined) => set(() => ({ fileId: id })),

}))

export default useStrategyStore


