
import { create } from 'zustand';

interface ConditionsState {
	conditions: Array<any>;
	setConditions: (newConditions: Array<any>) => void;
	deleteCondition: (index: number) => void;
}

const useConditionsStore = create<ConditionsState>((set) => ({
	conditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 100 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	],
	deleteCondition: (index: number) =>
		set((state) => ({
			conditions: state.conditions.filter((_, i) => i !== index),
		})), setConditions: (newConditions) => set({ conditions: newConditions }),
}));

export default useConditionsStore;
