import { useQuery } from "@tanstack/react-query";
import {
  CoinClient,
  StrategiesClient,
} from "src/lib/services/ApiClientInstances";
import Strategy from "src/interfaces/Strategy";
import Coin from "src/interfaces/Coin";
// import {GridItemClass} from "../models/GridItem"

interface CoinQuery {
  page: number;
  pageSize: number;
}

const useCoinsPaginated = (query: CoinQuery) => {
  const fetchCoins = async (): Promise<Coin[]> => {
    const coinData: Coin[] = await CoinClient.getAll();

    return coinData;
  };

  return useQuery<Coin[], Error>({
    queryKey: ["coins", query],
    queryFn: fetchCoins,
  });
};

export default useCoinsPaginated;
