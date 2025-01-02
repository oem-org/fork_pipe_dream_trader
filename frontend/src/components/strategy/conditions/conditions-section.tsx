import { Button } from '@/components/ui/buttons/button';
import { BacktestService } from '@/lib/services/BacktestService';
import BuildConditionRenderer from './build-condition-renderer';
import { useRef, useState, useEffect } from 'react';
import CreateConditions from './create-conditions';
import getStrategyConditionsQuery from '@/lib/hooks/react-query/getStrategyConditions';
import { useAddStrategyCondition } from '@/lib/hooks/react-query/useAddStrategyCondition'
import useStrategyStore from '@/lib/hooks/stores/useStrategyStore';

import { postBacktestApi } from '@/lib/apiClientInstances';
import { CreateBacktestRequest } from '@/interfaces/Backtest';

//TODO: Fix overflow of condition by creating vertical layout

//TODO: when indicator is deleted manually remove the FK from all the indicators that have it 

export default function ConditionsSection() {


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

      const buyConditionsFormatted = filteredBuyConditions.map((condition) => ({
        id: condition.id,
        settings: condition.settings,
      }));
      const sellConditionsFormatted = filteredSellConditions.map((condition) => ({
        id: condition.id,
        settings: condition.settings,
      }));

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

  };
  const buyStringRef = useRef<{ createConditionString: () => Array<any> }>(null);
  const sellStringRef = useRef<{ createConditionString: () => Array<any> }>(null);

  function runBacktest(): void {
    let buy = []
    let sell = []
    if (buyStringRef.current) {
      buy = buyStringRef.current.createConditionString();
    }

    if (sellStringRef.current) {
      sell = sellStringRef.current.createConditionString();
    }

    const sellConds = new BacktestService(sell);
    const buyConditions = sellConds.processConditions();

    const buyConds = new BacktestService(buy);
    const sellConditions = buyConds.processConditions();


    let data: CreateBacktestRequest = {
      buy_conditions: JSON.stringify(buyConditions),
      sell_conditions: JSON.stringify(sellConditions),
    };
    console.log("OUTPUT:", sellConditions);
    console.log("OUTPUT:", buyConditions);
    postBacktestApi.post(strategyId, data)
  };
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button onClick={() => runBacktest()}>Run Backtest</Button>
      </div>
      <hr className="py-1" />
      <div className='flex flex-row'>
        <div>
          <h3 className='h3 pb-4'>Buy conditions</h3>

          <div className="flex flex-row">
            <BuildConditionRenderer ref={buyStringRef} conditions={buyConditions} />
          </div>
          <div className='flex flex-col'>
            <CreateConditions side="buy" addCondition={addCondition} />

          </div>
        </div>
        <div>

          <h3 className='h3 pb-4'>Sell conditions</h3>
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
