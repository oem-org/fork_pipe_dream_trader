import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postStrategyConditionsApi } from "@/lib/apiClientInstances";
import { StrategyConditionRequest } from "@/interfaces/StrategyCondition";

const addStrategyCondition = async (
	strategyCondition: StrategyConditionRequest,
	strategyId: number
): Promise<any> => {
	console.log("Adding!!!!!!!!!!!!!!!!! this strategy condition", strategyCondition);

	const response = await postStrategyConditionsApi.post(strategyId, {
		fk_strategy_indicator_id_1: strategyCondition.fk_strategy_indicator_id_1,
		fk_strategy_indicator_id_2: strategyCondition.fk_strategy_indicator_id_2,
		settings: strategyCondition.settings,
		side: strategyCondition.side,
	});

	return response
};

export const useAddStrategyCondition = (strategyId: number) => {

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (strategyCondition: StrategyConditionRequest) =>
			addStrategyCondition(strategyCondition, strategyId),
		onSuccess: () => {
			// Invalidate cache to refetch strategy conditions
			queryClient.invalidateQueries({ queryKey: ["strategyConditions"] });
			return true;
		},
		onError: (error: unknown) => {
			console.error("Failed to add strategy condition:", error);
			return false;
		},
	});
};
