import { useQuery } from "@tanstack/react-query";
import {
  CoinClient,
  StrategiesClient,
} from "@/lib/services/ApiClientInstances";
import Strategy from "@/interfaces/Strategy";
import Coin from "@/interfaces/Coin";
// import {GridItemClass} from "../models/GridItem"

const useCoinQuery = () => {
  const fetchCoins = async (): Promise<Coin[]> => {
    const coinData: Coin[] = await CoinClient.getAll();

    return coinData;
  };

  return useQuery<Coin[], Error>({
    queryKey: ["coins"],
    queryFn: fetchCoins,
  });
};

export default useCoinQuery;
