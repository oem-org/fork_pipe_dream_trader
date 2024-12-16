import { useMutation, useQueryClient } from "@tanstack/react-query";
import Indicator from "@/interfaces/Indicator";
import { postStrategyIndicatorsApi } from "../apiClientInstances";

const addIndicator = async (indicator: Indicator, paramId: number): Promise<any> => {
	const response = await postStrategyIndicatorsApi.post(paramId, {
		fk_indicator_id: indicator.id,
		settings: indicator.default_settings,
	});
	return response.data;
};

export const useAddIndicator = (paramId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (indicator: Indicator) => addIndicator(indicator, paramId),
		onSuccess: () => {
			// Invalidate cache to refetch indicators
			queryClient.invalidateQueries({ queryKey: ["strategyIndicators"] });
			return true;
		},
		onError: (error: unknown) => {
			console.error("Failed to add indicator:", error);
			return false
		},
	});
};
