
import { useQuery } from "@tanstack/react-query"
import { getAllIndicatorsApi } from "@/lib/apiClientInstances"
import Indicator from "@/interfaces/Indicator"

export default function getIndicatorsQuery() {
	const fetchIndicators = async (): Promise<Indicator[] | undefined> => {
		try {
			const indicators: Indicator[] | undefined = await getAllIndicatorsApi.getAll()
			return indicators
		} catch (error) {
			//console.error(error)
			throw new Error("Failed to fetch indicators")
		}
	}


	const { data, error, isError, isLoading } = useQuery<Indicator[] | undefined, Error>({
		queryKey: ["indicatorList"],
		queryFn: fetchIndicators,
	})

	return { data, error, isError, isLoading }
}

