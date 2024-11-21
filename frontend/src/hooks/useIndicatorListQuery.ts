import { useQuery } from "@tanstack/react-query"
import {IndicatorTypesClient} from "../services/ApiClientInstances"
import IndicatorList from "../models/IndicatorList"

const useIndicatorListQuery = () => {
  const fetchIndicators = async (): Promise<IndicatorList[]> => {
    try {
      const indicatorsData: IndicatorList[] = await IndicatorTypesClient.getAll()
      return indicatorsData
    } catch (error) {
      console.log(error)
      throw new Error("Failed to fetch indicators")
    }
  }

  const { data, error, isError, isLoading } = useQuery<IndicatorList[], Error>({
    queryKey: ["indicatorList"],
    queryFn: fetchIndicators,
  })

  return { data, error, isError, isLoading }
}

export default useIndicatorListQuery