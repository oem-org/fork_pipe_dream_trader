import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStrategyApi } from "@/lib/apiClientInstances";



const deleteStrategy = async (strategyId: number): Promise<any> => {

	const response = await deleteStrategyApi.delete(strategyId);
	console.log(response)
};

export const useDeleteStrategy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (strategyId: number) => deleteStrategy(strategyId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["strategies"] });
			queryClient.invalidateQueries({ queryKey: ["strategy"] });
		},
		onError: (error: unknown) => {
			console.error("Failed to delete strategy:", error);
		},
	});
};
