import { create } from 'zustand';
import { IndicatorChart } from '@/interfaces/IndicatorChart';

interface ChartStore {
	//histogramIndicators: Array<IndicatorChart>;
	//lineSeriesIndicators: Array<IndicatorChart>;
	indicators: { name: string; data: any[] }[]

	//setHistogramIndicators: (indicators: Array<IndicatorChart>) => void;
	//setLineSeriesIndicators: (indicators: Array<IndicatorChart>) => void;
	//setIndicators: (indicators: Array<IndicatorChart>) => void;
	addIndicator: (name: string, data: Array<any>) => void;
	//removeIndicator: (name: string) => void;
	//addLineSeriesIndicator: (indicator: IndicatorChart) => void;
	//removeLineSeriesIndicator: (name: string) => void;
	//addHistogramIndicator: (indicator: IndicatorChart) => void;
	//removeHistogramIndicator: (name: string) => void;
}

const useChartStore = create<ChartStore>((set) => ({
	// Initial state
	//histogramIndicators: [],
	//lineSeriesIndicators: [],
	indicators: [],

	// Actions
	//setHistogramIndicators: (indicators: Array<IndicatorChart>) =>
	//	set(() => ({
	//		histogramIndicators: indicators,
	//	})),
	//
	//setLineSeriesIndicators: (indicators: Array<IndicatorChart>) =>
	//	set(() => ({
	//		lineSeriesIndicators: indicators,
	//	})),
	//
	//setIndicators: (indicators: Array<IndicatorChart>) =>
	//	set(() => ({
	//		indicators,
	//	})),

	addIndicator: (name: string, data: Array<any>) =>
		set((state) => ({
			indicators: [
				...state.indicators,
				{
					name,
					data,
				},
			],
		})),

	//removeIndicator: (name: string) =>
	//	set((state) => ({
	//		indicators: state.indicators.filter((indicator) => indicator.name !== name),
	//	})),

	// Add and remove actions for lineSeriesIndicators
	//addLineSeriesIndicator: (indicator: IndicatorChart) =>
	//	set((state) => ({
	//		lineSeriesIndicators: [
	//			...state.lineSeriesIndicators,
	//			{
	//				name: indicator.name,
	//				id: indicator.id,
	//				chartStyle: indicator.chartStyle,
	//				data: indicator.data,
	//			},
	//		],
	//	})),
	//
	//removeLineSeriesIndicator: (name: string) =>
	//	set((state) => ({
	//		lineSeriesIndicators: state.lineSeriesIndicators.filter(
	//			(indicator) => indicator.name !== name
	//		),
	//	})),
	//
	//// Add and remove actions for histogramIndicators
	//addHistogramIndicator: (indicator: IndicatorChart) =>
	//	set((state) => ({
	//		histogramIndicators: [
	//			...state.histogramIndicators,
	//			{
	//				name: indicator.name,
	//				id: indicator.id,
	//				chartStyle: indicator.chartStyle,
	//				data: indicator.data,
	//			},
	//		],
	//	})),
	//
	//removeHistogramIndicator: (name: string) =>
	//	set((state) => ({
	//		histogramIndicators: state.histogramIndicators.filter(
	//			(indicator) => indicator.name !== name
	//		),
	//	})),
}));

export default useChartStore;
