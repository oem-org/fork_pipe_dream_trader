import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useEffect, useState } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
import { ConditionsArray, Side, ConditionGroup, LogicalOperator } from '@/interfaces/Condition';
import CreateConditions from './create-conditions';
import getStrategyConditionsQuery from '@/lib/queries/getStrategyConditions';
import { useAddStrategyCondition } from '@/lib/queries/useAddStrategyCondition'
import useStrategyStore from '@/lib/hooks/useStrategyStore';
export default function ConditionsSection() {

  const {
    sellConditions,
    buyConditions,
    setSellConditions,
    setBuyConditions,
    deleteSellCondition,
    deleteBuyCondition,
  } = useConditionsStore();

  const { strategyId } = useStrategyStore()
  const [test, setTest] = useState()
  const { data } = getStrategyConditionsQuery(strategyId)
  const { mutateAsync: addConditionMutation } = useAddStrategyCondition(strategyId);


  useEffect(() => {
    if (data) {
      // Filter conditions by side "buy" and "sell"
      const filteredBuyConditions = data.filter((condition) => condition.side === "buy");
      const filteredSellConditions = data.filter((condition) => condition.side === "sell");

      // Create new objects with only id and settings properties
      const buyConditionsFormatted = filteredBuyConditions.map((condition) => condition.settings);
      const sellConditionsFormatted = filteredSellConditions.map((condition) => condition.settings);


      console.log(sellConditionsFormatted, buyConditionsFormatted)
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

  //TODO: DOUBLE BUY CONDS
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button>Add condition</Button>
        <p>Operators:</p>
        <Button>And</Button>
        <Button>Or</Button>
        <Button>Not</Button>
      </div>
      <hr className="py-1" />
      <div>
        <h3>Buy conditions</h3>
        <div className="flex flex-row">
          <BuildConditionRenderer deleteBlock={deleteBuyCondition} conditions={buyConditions} setConditions={setBuyConditions} />
        </div>

        <div className='flex flex-col'>
          <CreateConditions side="buy" addCondition={addCondition} />

        </div>

        <div>
          <div className="flex flex-row">
            <BuildConditionRenderer deleteBlock={deleteSellCondition} conditions={buyConditions} setConditions={setSellConditions} />
          </div>

          <div className='flex flex-col'>
            <CreateConditions side="sell" addCondition={addCondition} />

          </div>
        </div>

      </div>
    </div>
  );
}
