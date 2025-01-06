
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { CreateBacktestRequest } from "@/interfaces/Backtest";
// import { postStrategyBacktestApi } from "@/lib/apiClientInstances";

// const addBacktest = async (indicator: CreateBacktestRequest, paramId: number): Promise<any> => {
// 	console.log("adding this indicator", indicator)
// 	const response = await postStrategyBacktestApi.post(paramId, {
// 		"buy_conditions"
// 	});
// 	return response.data;
// };

// export const useAddBacktest = (paramId: number) => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: (indicator: CreateBacktestRequest) => addBacktest(indicator, paramId),
// 		onSuccess: () => {
// 			// Invalidate cache to refetch indicators
// 			queryClient.invalidateQueries({ queryKey: ["strategyBacktests"] });
// 			return true;
// 		},
// 		onError: (error: unknown) => {
// 			console.error("Failed to add indicator:", error);
// 			return false
// 		},
// 	});
// };
