import { create } from 'zustand';

interface RerenderStore {
	rerender: number;
	trigger: () => void;
}

const useRerenderStore = create<RerenderStore>((set) => ({
	rerender: 0,
	trigger: () => set((state) => ({ rerender: state.rerender + 1 })),
}));

export default useRerenderStore;
