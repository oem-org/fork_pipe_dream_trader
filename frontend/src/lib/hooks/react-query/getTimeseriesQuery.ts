

import { useQuery } from "@tanstack/react-query";
import { getTimeseriesApi } from "@/lib/apiClientInstances";

const useTimeseriesQuery = (timeperiod: string, strategyId: number, fileId: number | undefined) => {
	const fetchTimeseries = async () => {
		const data = await getTimeseriesApi.getQueryString(
			`timeperiod=${timeperiod}&strategy=${strategyId}`
		);
		return data;
	};

	const {
		data,
		error,
		isError,
		isLoading,
		refetch,
	} = useQuery<any, Error>({
		queryKey: ["timeseries", timeperiod, strategyId, fileId],
		queryFn: fetchTimeseries,
		enabled: !!strategyId && strategyId > 0
	});

	return { data, error, isError, isLoading, refetch };
};

export default useTimeseriesQuery;
