import { useQuery } from "@tanstack/react-query"

import { getStrategyIndicatorsApi } from "../apiClientInstances"
import { StrategyIndicator } from "@/interfaces/StrategyIndicator"



const getStrategyIndicatorsQuery = (strategyId: number) => {
	const fetchStrategyIndicators = async (): Promise<StrategyIndicator[]> => {
		try {
			const strategyIndicators: StrategyIndicator[] = await getStrategyIndicatorsApi.getAll(strategyId)
			console.log("getStrategtyIndicators", strategyIndicators)
			return strategyIndicators

		} catch (error) {
			console.log(error)
			throw new Error("Failed to fetch strategyIndicators")
		}
	}

	const { data, error, isError, isLoading, refetch } = useQuery<StrategyIndicator[], Error>({
		queryKey: ["strategyIndicators"],
		queryFn: fetchStrategyIndicators,
	})

	return { data, error, isError, isLoading, refetch }
}

export default getStrategyIndicatorsQuery
