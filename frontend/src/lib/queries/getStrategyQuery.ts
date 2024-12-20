
import { useQuery } from "@tanstack/react-query"
import { getStrategyApi } from "../apiClientInstances"
import { Strategy } from "@/interfaces/Strategy"

export default function getStrategyQuery(id: number) {
	const fetchStrategy = async (): Promise<Strategy> => {
		try {
			const strategy = await getStrategyApi.get(id)
			return strategy
		} catch (error) {
			throw new Error("Failed to fetch strategy")
		}
	}


	const { data, error, isError, isLoading, refetch } = useQuery<Strategy, Error>({
		queryKey: ["strategy", id],
		queryFn: fetchStrategy,
		enabled: !!id && id > 0
	})

	return { data, error, isError, isLoading, refetch }
}

