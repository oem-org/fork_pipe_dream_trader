import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putStrategyConditionsApi } from "../apiClientInstances";
import { StrategyConditionRequest } from "@/interfaces/StrategyCondition";
import { ConditionElement } from "@/interfaces/Condition";

const updateStrategyCondition = async (
	strategyId: number,
	conditionId: number,
	updateData: Record<string, any>
): Promise<any> => {

	const response = await putStrategyConditionsApi.put(strategyId, conditionId, updateData);

	return response;
};

export const useUpdateStrategyCondition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			strategyId,
			conditionId,
			updateData,
		}: {
			strategyId: number;
			conditionId: number;
			updateData: Record<string, any>;
		}) => updateStrategyCondition(strategyId, conditionId, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["strategyConditions"] });
			return true;
		},
		onError: (error: unknown) => {
			console.error("Failed to update strategy condition:", error);
			return false;
		},
	});
};
