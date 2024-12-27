import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putStrategyIndicatorsApi } from "../../apiClientInstances";


const updateIndicator = async (strategyId: number, indicatorId: number, settings: Record<string, any>): Promise<any> => {
	const response = await putStrategyIndicatorsApi.put(strategyId, indicatorId, settings);
	return response;
};

export const useUpdateIndicator = (strategyId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ indicatorId, settings }: { indicatorId: number; settings: any }) =>
			updateIndicator(strategyId, indicatorId, settings),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["strategyIndicators"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to update indicator:", error);
		},
	});
};
