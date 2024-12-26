import { create } from 'zustand';
import Timeseries from '@/interfaces/Timeseries';
import { IndicatorChart } from "@/interfaces/IndicatorChart";
import { Volume } from "@/interfaces/Volume";

interface Store {
	timeseries: Timeseries[];
	volume: Volume[];
	histograms: IndicatorChart[];
	lineSeries: IndicatorChart[];
	lineSeriesPanes: IndicatorChart[];

	setTimeseries: (timeseries: Timeseries[]) => void;
	setVolume: (volume: Volume[]) => void;
	setHistograms: (histograms: IndicatorChart[]) => void;
	setLineSeries: (lineSeries: IndicatorChart[]) => void;
	setLineSeriesPanes: (lineSeriesPanes: IndicatorChart[]) => void;

	resetStore: () => void;
}

// Check if the new state is diffrent
const deepCompare = (prev: any[], next: any[]) => {
	if (prev.length !== next.length) return false;

	for (let i = 0; i < prev.length; i++) {
		if (JSON.stringify(prev[i]) !== JSON.stringify(next[i])) {
			return false;
		}
	}

	return true;
};

export const useChartStore = create<Store>((set) => ({
	timeseries: [],
	volume: [],
	histograms: [],
	lineSeries: [],
	lineSeriesPanes: [],

	setTimeseries: (timeseries) => set((state) => {
		if (!deepCompare(state.timeseries, timeseries)) {
			return { timeseries };
		}
		return {};
	}),

	setVolume: (volume) => set((state) => {
		if (!deepCompare(state.volume, volume)) {
			return { volume };
		}
		return {};
	}),

	setHistograms: (histograms) => set((state) => {
		if (!deepCompare(state.histograms, histograms)) {
			return { histograms };
		}
		return {};
	}),

	setLineSeries: (lineSeries) => set((state) => {
		if (!deepCompare(state.lineSeries, lineSeries)) {
			return { lineSeries };
		}
		return {};
	}),

	setLineSeriesPanes: (lineSeriesPanes) => set((state) => {
		if (!deepCompare(state.lineSeriesPanes, lineSeriesPanes)) {
			return { lineSeriesPanes };
		}
		return {};
	}),

	resetStore: () => set({
		timeseries: [],
		volume: [],
		histograms: [],
		lineSeries: [],
		lineSeriesPanes: [],
	}),
}));
