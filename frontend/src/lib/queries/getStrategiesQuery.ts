
import { useQuery } from "@tanstack/react-query"
import { postStrategyApi } from '../apiClientInstances'

import Strategy from "../../interfaces/Strategy"

const getStrategiesQuery = () => {
  const fetchStrategies = async (): Promise<Strategy[]> => {
    try {
      const strategiesData: Strategy[] = await postStrategyApi.getAll()
      return strategiesData
    } catch (error) {
      console.log(error)
      throw new Error("Failed to fetch strategies")
    }
  }

  const { data, error, isError, isLoading } = useQuery<Strategy[], Error>({
    queryKey: ["strategyList"],
    queryFn: fetchStrategies,
  })

  return { data, error, isError, isLoading }
}

export default getStrategiesQuery
