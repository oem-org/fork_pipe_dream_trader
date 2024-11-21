import { Text } from "@chakra-ui/react"

import { useEffect, useState } from "react"
import strategyStore from "../../stores/strategyStore"
import Strategy from "../../models/Strategy"
import priceStore from "../../stores/priceStore"
import Coin from "../../models/Coin"
import { CoinClientNoParam } from "../../services/ApiClientInstances"
import { splitPairName } from "../../utils/splitPairName"

// import strategyStore from "../stores/strategyStore"
function StrategyName() {
const {selectedCoinId, getByCoinId } = priceStore()
const { selectedId, getById } = strategyStore()
const [strategy, setStrategy] = useState<Strategy>()
const [coin, setCoin] = useState<String>()


useEffect(() => {
  const fetchCoin = async () => {
    if (selectedCoinId) {
      const response = await CoinClientNoParam.getNoneParam(selectedCoinId);
      setCoin(splitPairName(response.name));
    }
  };
    if (selectedId) {

        const strategy = getById()
        console.log(strategy)
        setStrategy(strategy) // If strategy is undefined, set it to null
        // setPrices(prices)
    }
    fetchCoin()



}, [selectedId, selectedCoinId])

return (
<div>

{strategy && <Text fontSize="2rem">{strategy.name} - {coin}</Text>}

</div>
  )
}

export default StrategyName