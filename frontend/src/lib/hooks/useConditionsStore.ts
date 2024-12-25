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
	buyConditions: [] as any,
	sellConditions: [] as any,

	deleteBuyCondition: (index: number) =>
		set((state) => {
			const updatedConditions = state.buyConditions.filter((_, i) => i !== index);
			return { buyConditions: updatedConditions };
		}),

	setBuyConditions: (newConditions) =>
		set({ buyConditions: newConditions }),

	deleteSellCondition: (index: number) =>
		set((state) => {
			const updatedConditions = state.sellConditions.filter((_, i) => i !== index);
			return { sellConditions: updatedConditions };
		}),

	setSellConditions: (newConditions) =>
		set({ sellConditions: newConditions }),
}));

export default useConditionsStore;
