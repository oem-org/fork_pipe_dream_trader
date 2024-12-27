import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useRef, useState, useEffect } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
import CreateConditions from './create-conditions';
import getStrategyConditionsQuery from '@/lib/queries/getStrategyConditions';
import { useAddStrategyCondition } from '@/lib/queries/useAddStrategyCondition'
import useStrategyStore from '@/lib/hooks/useStrategyStore';

import { postBacktestApi } from '@/lib/apiClientInstances';
import { CreateBacktestRequest } from '@/interfaces/Backtest';

export default function ConditionsSection() {

  //const {
  //  sellConditions,
  //  buyConditions,
  //  setSellConditions,
  //  setBuyConditions,
  //} = useConditionsStore();

  const { strategyId } = useStrategyStore()
  const { data } = getStrategyConditionsQuery(strategyId)
  const { mutateAsync: addConditionMutation } = useAddStrategyCondition(strategyId);
  const [sellConditions, setSellConditions] = useState<any[]>([]);
  const [buyConditions, setBuyConditions] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      // Filter conditions by side "buy" and "sell"
      const filteredBuyConditions = data.filter((condition) => condition.side === "buy");
      const filteredSellConditions = data.filter((condition) => condition.side === "sell");

      console.log(filteredSellConditions, filteredBuyConditions, "FILTERED BUTY AND SELL")

      console.log("DATA", data, "SENDING THE DATA")
      // Create new objects with only id and settings properties
      const buyConditionsFormatted = filteredBuyConditions.map((condition) => ({
        id: condition.id,
        settings: condition.settings,
      }));
      const sellConditionsFormatted = filteredSellConditions.map((condition) => ({
        id: condition.id,
        settings: condition.settings,
      }));

      //console.log(sellConditionsFormatted, buyConditionsFormatted)
      // Set the formatted conditions
      setBuyConditions(buyConditionsFormatted);
      setSellConditions(sellConditionsFormatted);

      console.log("Filtered Buy Conditions:", buyConditionsFormatted);
      console.log("Filtered Sell Conditions:", sellConditionsFormatted);
    }
  }, [data]);
  const addCondition = (newCondition: any) => {

    console.log(newCondition)
    let result = addConditionMutation(newCondition)

    console.log(result, "THE RESULT");

    //if (side === "buy") {
    //
    //  console.log(buyConditions, newCondition)
    //  console.log(buyConditions)
    //  setSellConditions([...buyConditions, newCondition]);
    //} else {
    //
    //  console.log(sellConditions, newCondition)
    //  console.log(sellConditions)
    //  setSellConditions([...sellConditions, newCondition]);
    //
    //}
  };
  const buyStringRef = useRef<{ createConditionString: () => Array<any> }>(null);
  const sellStringRef = useRef<{ createConditionString: () => Array<any> }>(null);
  const [buyString, setBuyString] = useState("")
  const [sellString, setSellString] = useState("")

  function runBacktest(): void {
    let buy = []
    let sell = []
    console.log(buyStringRef.current.createConditionString())
    if (buyStringRef.current) {
      buy = buyStringRef.current.createConditionString();
    }

    if (sellStringRef.current) {
      sell = sellStringRef.current.createConditionString();
    }
    let data: CreateBacktestRequest = {
      buy_conditions: JSON.stringify(buy),
      sell_conditions: JSON.stringify(sell),
    };

    postBacktestApi.post(strategyId, data)
    console.log(buy, sell, "REEEEEEEEEEEEEEEEEEEEF")
  };
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button onClick={() => runBacktest()}>RUN BT</Button>
        <p>Operators:</p>
        <Button>And</Button>
        <Button>Or</Button>
        <Button>Not</Button>
      </div>
      <hr className="py-1" />
      <div>
        <div>
          <h3>Buy conditions</h3>

          <div className="flex flex-row">
            <BuildConditionRenderer ref={buyStringRef} conditions={buyConditions} />
          </div>
          <div className='flex flex-col'>
            <CreateConditions side="buy" addCondition={addCondition} />

          </div>
        </div>
        <div>

          <h3>Sell conditions</h3>
          <div className="flex flex-row">
            <BuildConditionRenderer ref={sellStringRef} conditions={sellConditions} />
          </div>

          <div className='flex flex-col'>
            <CreateConditions side="sell" addCondition={addCondition} />

          </div>
        </div>

      </div>
    </div>
  );
}


//<div className="flex flex-row">
//  <BuildConditionRenderer deleteBlock={deleteBuyCondition} conditions={buyConditions} setConditions={setBuyConditions} />
//</div>
