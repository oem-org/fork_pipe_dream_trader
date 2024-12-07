
import { useQuery } from "@tanstack/react-query"
import { getAllIndicatorsApi } from "../apiClientInstances"
import Indicator from "../../interfaces/Indicator"

export default function getIndicatorsQuery() {
	const fetchIndicators = async (): Promise<Indicator[]> => {
		try {
			const indicators: Indicator[] = await getAllIndicatorsApi.getAll()
			console.log(indicators)
			return indicators
		} catch (error) {
			//console.error(error)
			throw new Error("Failed to fetch indicators")
		}
	}


	const { data, error, isError, isLoading } = useQuery<Indicator[], Error>({
		queryKey: ["indicatorList"],
		queryFn: fetchIndicators,
	})

	return { data, error, isError, isLoading }
}

