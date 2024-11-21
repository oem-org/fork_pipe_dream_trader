import { useQuery } from "@tanstack/react-query"
import {IndicatorStrategyClient} from "../services/ApiClientInstances"
import Indicator from "../models/Indicator"

const useStrategyIndicatorQuery = (strategy_fk:number | null) => {
  const fetchStrategyIndicators = async (): Promise<Indicator[]> => {

      const indicatorData: Indicator[] = await IndicatorStrategyClient.getSingleParam(strategy_fk, "strategy_fk" )      
      return indicatorData
    }
  
    return useQuery<Indicator[], Error>({
      queryKey: ["strategyIndicators"],
      queryFn: fetchStrategyIndicators,
    })
  }


export default useStrategyIndicatorQuery

