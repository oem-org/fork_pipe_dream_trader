import { useQuery } from "@tanstack/react-query"
import {CoinClient, StrategiesClient} from "../services/ApiClientInstances"
import Strategy from "../models/Strategy"
import Coin from "../models/Coin"
// import {GridItemClass} from "../models/GridItem"

interface CoinQuery {
  page: number;
  pageSize: number;
}

const useCoinsPaginated = (query: CoinQuery) => {
  const fetchCoins = async (): Promise<Coin[]> => {

    const coinData: Coin[] = await CoinClient.getAll()

    return coinData
  }

  return useQuery<Coin[], Error>({
    queryKey: ["coins",query],
    queryFn: fetchCoins,
  })
}

export default useCoinsPaginated
