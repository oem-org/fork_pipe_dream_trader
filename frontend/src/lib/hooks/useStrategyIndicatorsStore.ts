import Indicator from "@/interfaces/Indicator";
import { create } from "zustand"


interface StrategyIndicatorStore {
	indicators: Indicator[];
	indicatorId: number;
	setIndicators: (indicators: Indicator[]) => void;
	setIndicatorId: (id: number) => void;
	addIndicator: (newIndicator: Indicator) => void;
	deleteIndicator: (id: number) => void;
	getById: () => Indicator | null;
}

const useStrategyIndicatorStore = create<StrategyIndicatorStore>((set, get) => ({
	indicators: [],
	indicatorId: 0,
	setIndicators: (indicators: Indicator[]) => set(() => ({ indicators })),
	setIndicatorId: (id: number) => set(() => ({ indicatorId: id })),

	addIndicator: (newIndicator: Indicator) => {
		set((state) => ({ indicators: [...state.indicators, newIndicator] }));
	},

	deleteIndicator: (id: number) => {
		set((state) => ({
			indicators: state.indicators.filter((indicator) => indicator.id !== id),
		}));
	},

	getById: () => {
		const { indicators, indicatorId } = get();
		console.log(`Selected ID: ${indicatorId}`);
		console.log(`Indicators: ${JSON.stringify(indicators)}`);
		const foundIndicator = indicators.find((indicator) => indicator.id === indicatorId);
		console.log(`Found indicator: ${JSON.stringify(foundIndicator)}`);
		return foundIndicator || null;
	},
}));

export default useStrategyIndicatorStore
