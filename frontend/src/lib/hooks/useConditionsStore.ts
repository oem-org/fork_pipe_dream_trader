
import { create } from 'zustand';

interface ConditionsState {
	buyConditions: Array<any>;
	sellConditions: Array<any>;
	setBuyConditions: (newConditions: Array<any>) => void;
	setSellConditions: (newConditions: Array<any>) => void;
	deleteBuyCondition: (index: number) => void;
	deleteSellCondition: (index: number) => void;
}

const useConditionsStore = create<ConditionsState>((set) => ({
	buyConditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 100 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	],


	sellConditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 100 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	],

	deleteBuyCondition: (index: number) =>
		set((state) => ({
			buyConditions: state.buyConditions.filter((_, i) => i !== index),
		})), setBuyConditions: (newConditions) => set({ buyConditions: newConditions }),


	deleteSellCondition: (index: number) =>
		set((state) => ({
			sellConditions: state.sellConditions.filter((_, i) => i !== index),
		})), setSellConditions: (newConditions) => set({ sellConditions: newConditions }),

}));

export default useConditionsStore;
