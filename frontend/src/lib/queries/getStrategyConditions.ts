
import { useQuery } from "@tanstack/react-query"

import { getStrategyConditionsApi } from "../apiClientInstances"
import { StrategyCondition } from "@/interfaces/StrategyCondition"



const getStrategyConditionsQuery = (strategyId: number) => {
	const fetchStrategyConditions = async (): Promise<StrategyCondition[]> => {
		try {
			const strategyConditions: StrategyCondition[] = await getStrategyConditionsApi.getAll(strategyId)
			console.log("getStrategtyConditions", strategyConditions)
			return strategyConditions

		} catch (error) {
			console.log(error)
			throw new Error("Failed to fetch strategyConditions")
		}
	}

	const { data, error, isError, isLoading, refetch } = useQuery<StrategyCondition[], Error>({
		queryKey: ["strategyConditions"],
		queryFn: fetchStrategyConditions,
		enabled: !!strategyId && strategyId > 0
	})

	return { data, error, isError, isLoading, refetch }
}

export default getStrategyConditionsQuery
