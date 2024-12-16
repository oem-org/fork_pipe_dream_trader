import { create } from 'zustand';
import { IndicatorChart } from '@/interfaces/IndicatorChart';

interface ChartStore {
	histogramIndicators: Array<IndicatorChart>;
	lineSeriesIndicators: Array<IndicatorChart>;
	// indicators structure: [{ name: "RSI_14", id: 123, data: [...] }]
	indicators: Array<IndicatorChart>;
	setHistogramIndicators: (indicators: Array<IndicatorChart>) => void;
	setLineSeriesIndicators: (indicators: Array<IndicatorChart>) => void;
	setIndicators: (indicators: Array<IndicatorChart>) => void;
	addIndicator: (indicator: IndicatorChart) => void;
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

	addIndicator: (indicator: IndicatorChart) =>
		set((state) => ({
			indicators: [
				...state.indicators,
				{
					name: indicator.name,
					id: indicator.id,
					chartStyle: indicator.chartStyle,
					data: indicator.data,
				},
			],
		})),

	removeIndicator: (name: string) =>
		set((state) => ({
			indicators: state.indicators.filter((indicator) => indicator.name !== name),
		})),
}));

export default useChartStore;
