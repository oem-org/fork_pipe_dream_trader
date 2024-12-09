

import { useQuery } from "@tanstack/react-query"

import Timeseries from "../../interfaces/Timeseries"
import { getTimeseriesApi } from "../apiClientInstances"

const getTimeseriesQuery = (query: string) => {
	const fetchTimeseries = async (): Promise<Timeseries[]> => {
		try {
			const timeseries: Timeseries[] = await getTimeseriesApi.getQueryString(query)
			return timeseries
		} catch (error) {
			console.log(error)
			throw new Error("Failed to fetch timeseries")
		}
	}

	const { data, error, isError, isLoading, refetch } = useQuery<Timeseries[], Error>({
		queryKey: ["timeseries"],
		queryFn: fetchTimeseries,
	})

	return { data, error, isError, isLoading, refetch }
}

export default getTimeseriesQuery
