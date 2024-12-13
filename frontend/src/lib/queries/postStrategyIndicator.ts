


import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import { postStrategyIndicatorsApi, post } from "../apiClientInstances";

import { useMutation } from "@tanstack/react-query"



export const useAddIndicator = () => {
	const mutation = useMutation({
		mutationFn: (newIndicator: StrategyIndicator) => post.post(newIndicator.fk_strategy_id, newIndicator.fk_indicator_id, newIndicator.settings)
	})

	return mutation.mutateAsync
}
