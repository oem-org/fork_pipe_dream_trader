import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStrategyApi } from "../apiClientInstances";



const deleteStrategy = async (strategyId: number): Promise<any> => {

	const response = await deleteStrategyApi.delete(strategyId);
	console.log(response)
};

export const useDeleteStrategy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (strategyId: number) => deleteStrategy(strategyId),
		onSuccess: () => {
			// Invalidate cache to refetch indicators
			queryClient.invalidateQueries({ queryKey: ["strategies"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to delete strategy:", error);
		},
	});
};
