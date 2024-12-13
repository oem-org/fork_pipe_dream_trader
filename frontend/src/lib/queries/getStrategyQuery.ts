
import { useQuery } from "@tanstack/react-query"
import { getStrategyApi } from "../apiClientInstances"
import { Strategy } from "@/interfaces/Strategy"

export default function getStrategyQuery(id: number) {
	const fetchStrategy = async (): Promise<Strategy> => {
		try {
			const strategy = await getStrategyApi.get(id)
			console.log(strategy, "GET STRATEGY QUERY")
			return strategy
		} catch (error) {
			throw new Error("Failed to fetch strategy")
		}
	}


	const { data, error, isError, isLoading, refetch } = useQuery<Strategy, Error>({
		queryKey: ["strategy"],
		queryFn: fetchStrategy,
	})

	return { data, error, isError, isLoading, refetch }
}

