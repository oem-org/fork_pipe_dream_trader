
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStrategyIndicatorsApi } from "../apiClientInstances";

const deleteIndicator = async (strategyId: number, indicatorId: number): Promise<any> => {

	const response = await deleteStrategyIndicatorsApi.delete(strategyId, indicatorId);
	return response
};

export const useDeleteIndicator = (strategyId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (indicatorId: number) => deleteIndicator(strategyId, indicatorId),
		onSuccess: () => {
			// Invalidate cache to refetch indicators
			queryClient.invalidateQueries({ queryKey: ["strategyIndicators"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to delete indicator:", error);
		},
	});
};
