
import { create } from 'zustand';

import { ConditionsArray } from '@/interfaces/Condition';

interface ConditionsState {
	buyConditions: ConditionsArray;
	sellConditions: ConditionsArray;
	setBuyConditions: (newConditions: ConditionsArray) => void;
	setSellConditions: (newConditions: ConditionsArray) => void;
	deleteBuyCondition: (index: number) => void;
	deleteSellCondition: (index: number) => void;
}

const useConditionsStore = create<ConditionsState>((set) => ({
	buyConditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 100 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	] as ConditionsArray,


	sellConditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 1 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	] as ConditionsArray,

	deleteBuyCondition: (index: number) =>
		set((state) => ({
			buyConditions: state.buyConditions.filter((_, i) => i !== index),
		})),

	setBuyConditions: (newConditions) => set({ buyConditions: newConditions }),


	deleteSellCondition: (index: number) =>
		set((state) => ({
			sellConditions: state.sellConditions.filter((_, i) => i !== index),
		})),

	setSellConditions: (newConditions) => set({ sellConditions: newConditions }),

}));

export default useConditionsStore;
