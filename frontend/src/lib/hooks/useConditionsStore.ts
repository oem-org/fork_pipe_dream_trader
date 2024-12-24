
import { create } from 'zustand';

interface ConditionsState {
	conditions: Array<any>;
	setConditions: (newConditions: Array<any>) => void;
}

const useConditionsStore = create<ConditionsState>((set) => ({
	conditions: [
		[{ "indicator": "RSI_14" }, { "operator": ">" }, { "value": 100 }],
		"&",
		[{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_14" }],
		"|"
	],
	setConditions: (newConditions) => set({ conditions: newConditions }),
}));

export default useConditionsStore;
