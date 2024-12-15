import { create } from 'zustand';
import { IChartApi } from 'lightweight-charts';

interface ChartStore {
	chartRef: IChartApi | null;
	setChartRef: (chart: IChartApi | null) => void;
}

export const useChartStore = create<ChartStore>((set) => ({
	chartRef: null,
	setChartRef: (chart) => set({ chartRef: chart }),
}));
