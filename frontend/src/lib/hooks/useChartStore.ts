import { create } from 'zustand';

import { IndicatorChart } from '@/interfaces/IndicatorChart';

interface ChartStore {
	histogramIndicators: Array<IndicatorChart>;
	lineSeriesIndicators: Array<IndicatorChart>;
	// indidators [{name: RSI_14, data:[] }] 
	indicators: Array<IndicatorChart>;
	setHistogramIndicators: (indicators: Array<IndicatorChart>) => void;
	setLineSeriesIndicators: (indicators: Array<IndicatorChart>) => void;
	setIndicators: (indicators: Array<IndicatorChart>) => void;
	addIndicator: (name: string, data: any[]) => void;
	removeIndicator: (name: string) => void;
}

const useChartStore = create<ChartStore>((set) => ({
	// Initial state
	histogramIndicators: [],
	lineSeriesIndicators: [],
	indicators: [],

	// Actions
	setHistogramIndicators: (indicators: Array<IndicatorChart>) =>
		set(() => ({
			histogramIndicators: indicators,
		})),

	setLineSeriesIndicators: (indicators: Array<IndicatorChart>) =>
		set(() => ({
			lineSeriesIndicators: indicators,
		})),

	setIndicators: (indicators: Array<IndicatorChart>) =>
		set(() => ({
			indicators,
		})),

	addIndicator: (name: string, data: any[]) =>
		set((state) => ({
			indicators: [...state.indicators, { name, data }],
		})),

	removeIndicator: (name: string) =>
		set((state) => ({
			indicators: state.indicators.filter((indicator) => indicator.name !== name),
		})),
}));

export default useChartStore;
