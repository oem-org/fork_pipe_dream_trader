import { useQuery } from "@tanstack/react-query"

import { getStrategyIndicatorsApi } from "@/lib/apiClientInstances"
import { StrategyIndicator } from "@/interfaces/StrategyIndicator"



const getStrategyIndicatorsQuery = (strategyId: number) => {
	const fetchStrategyIndicators = async (): Promise<StrategyIndicator[] | undefined> => {
		try {
			const strategyIndicators: StrategyIndicator[] | undefined = await getStrategyIndicatorsApi.getAll(strategyId)
			return strategyIndicators

		} catch (error) {
			console.log(error)
			throw new Error("Failed to fetch strategyIndicators")
		}
	}

	const { data, error, isError, isLoading, refetch } = useQuery<StrategyIndicator[] | undefined, Error>({
		queryKey: ["strategyIndicators"],
		queryFn: fetchStrategyIndicators,
		enabled: !!strategyId && strategyId > 0
	})

	return { data, error, isError, isLoading, refetch }
}

export default getStrategyIndicatorsQuery
