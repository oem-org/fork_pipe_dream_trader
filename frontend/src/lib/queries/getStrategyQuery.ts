
import { useQuery } from "@tanstack/react-query"
import { getStrategyApi } from "../apiClientInstances"
import Strategy from "@/interfaces/Strategy"

export default function getStrategyQuery(id: number) {
	const fetchFiles = async (): Promise<Strategy> => {
		try {
			const strategy = await getStrategyApi.getWithParams(id)
			console.log(strategy)
			return strategy
		} catch (error) {
			throw new Error("Failed to fetch strategy")
		}
	}


	const { data, error, isError, isLoading } = useQuery<Strategy, Error>({
		queryKey: ["strategy"],
		queryFn: fetchFiles,
	})

	return { data, error, isError, isLoading }
}

