import { create } from 'zustand';

import { ConditionsArray } from '@/interfaces/Condition';

interface ConditionsState {
	buyCondtionsString: string;
	sellCondtionsString: string;
	buyConditions: ConditionsArray;
	sellConditions: ConditionsArray;
	setBuyConditions: (newConditions: ConditionsArray) => void;
	setSellConditions: (newConditions: ConditionsArray) => void;
	deleteBuyCondition: (index: number) => void;
	deleteSellCondition: (index: number) => void;
}

const useConditionsStore = create<ConditionsState>((set) => ({
	buyCondtionsString: "",
	sellCondtionsString: "",

	buyConditions: [
	] as ConditionsArray,


	sellConditions: [
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

	setBuyConditionsString: (newString: string) => set({ buyCondtionsString: newString }),

	setSellConditionsString: (newString: string) => set({ sellCondtionsString: newString }),
}));

export default useConditionsStore;
