
import { useQuery } from "@tanstack/react-query"

import { getAllStrategyConditionsApi } from "@/lib/apiClientInstances"
import { StrategyCondition } from "@/interfaces/StrategyCondition"



const getStrategyConditionsQuery = (strategyId: number) => {
	const fetchStrategyConditions = async (): Promise<StrategyCondition[] | undefined> => {
		try {
			const strategyConditions: StrategyCondition[] | undefined = await getAllStrategyConditionsApi.getAll(strategyId)
			return strategyConditions

		} catch (error) {
			console.log(error)
			throw new Error("Failed to fetch strategyConditions")
		}
	}

	const { data, error, isError, isLoading, refetch } = useQuery<StrategyCondition[] | undefined, Error>({
		queryKey: ["strategyConditions"],
		queryFn: fetchStrategyConditions,
		enabled: !!strategyId && strategyId > 0
	})

	return { data, error, isError, isLoading, refetch }
}

export default getStrategyConditionsQuery
