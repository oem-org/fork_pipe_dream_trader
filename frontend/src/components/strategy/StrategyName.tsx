import { Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import strategyStore from "@/lib/stores/strategyStore";
import Strategy from "@/interfaces/Strategy";
import priceStore from "@/lib/stores/priceStore";
import Coin from "@/interfaces/Coin";
import { CoinClientNoParam } from "@/lib/services/ApiClientInstances";
import { splitPairName } from "@/lib/utils/splitPairName";

// import strategyStore from "@/lib/stores/strategyStore"
function StrategyName() {
  const { selectedCoinId, getByCoinId } = priceStore();
  const { selectedId, getById } = strategyStore();
  const [strategy, setStrategy] = useState<Strategy>();
  const [coin, setCoin] = useState<String>();

  useEffect(() => {
    const fetchCoin = async () => {
      if (selectedCoinId) {
        const response = await CoinClientNoParam.getNoneParam(selectedCoinId);
        setCoin(splitPairName(response.name));
      }
    };
    if (selectedId) {
      const strategy = getById();
      console.log(strategy);
      setStrategy(strategy); // If strategy is undefined, set it to null
      // setPrices(prices)
    }
    fetchCoin();
  }, [selectedId, selectedCoinId]);

  return (
    <div>
      {strategy && (
        <Text fontSize="2rem">
          {strategy.name} - {coin}
        </Text>
      )}
    </div>
  );
}

export default StrategyName;
