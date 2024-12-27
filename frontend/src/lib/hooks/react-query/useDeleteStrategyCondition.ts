
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStrategyConditionApi } from "@/lib/apiClientInstances";

interface DeleteCondtionRequest {
	strategyId: number,
	conditionId: number,
}

const deleteStrategyCondition = async (strategyId: number, conditionId: number): Promise<any> => {

	const response = await deleteStrategyConditionApi.delete(strategyId, conditionId);
	console.log(response)
};

export const useDeleteStrategyCondition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ strategyId, conditionId }: DeleteCondtionRequest) => deleteStrategyCondition(strategyId, conditionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["strategyConditions"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to delete strategy:", error);
		},
	});
};
