
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Backtest from "@/interfaces/Backtest";
import { postStrategyBacktestsApi } from "@/lib/apiClientInstances";

const addBacktest = async (indicator: Backtest, paramId: number): Promise<any> => {
	console.log("adding this indicator", indicator)
	const response = await postStrategyBacktestsApi.post(paramId, {
		fk_indicator_id: indicator.id,

		settings: indicator.default_settings,
	});
	return response.data;
};

export const useAddBacktest = (paramId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (indicator: Backtest) => addBacktest(indicator, paramId),
		onSuccess: () => {
			// Invalidate cache to refetch indicators
			queryClient.invalidateQueries({ queryKey: ["strategyBacktests"] });
			return true;
		},
		onError: (error: unknown) => {
			console.error("Failed to add indicator:", error);
			return false
		},
	});
};
