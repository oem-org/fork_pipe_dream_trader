
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putStrategyApi } from "../apiClientInstances";
import { Strategy } from "@/interfaces/Strategy";

const updateStrategy = async (strategyId: number, strategy: Strategy): Promise<any> => {
	const response = await putStrategyApi.put(strategyId, strategy);
	console.log(response)
	return response;
};

export const useUpdateStrategy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (strategy: Strategy) =>
			updateStrategy(strategy.id, strategy),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["strategies"] });
			queryClient.invalidateQueries({ queryKey: ["strategy"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to update strategy:", error);
		},
	});
};
