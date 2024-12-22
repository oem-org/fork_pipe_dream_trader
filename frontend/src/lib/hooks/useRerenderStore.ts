import create from 'zustand';

interface RerenderStore {
	rerender: boolean;
	toggleRerender: () => void;
}

const useRerenderStore = create<RerenderStore>((set) => ({
	rerender: false,
	toggleRerender: () => set((state) => ({ rerender: !state.rerender })),
}));

export default useRerenderStore;
