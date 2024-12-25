import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useState } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
import { ConditionsArray, Side, ConditionGroup, LogicalOperator } from '@/interfaces/Condition';
import ConditionsButtonGroup from './conditions-button-group';

export default function ConditionsSection() {

  const {
    sellConditions,
    buyConditions,
    setSellConditions,
    setBuyConditions,
    deleteSellCondition,
    deleteBuyCondition,
  } = useConditionsStore();




  const addCondition = (side: Side, newCondition: ConditionGroup | LogicalOperator) => {
    if (side === "buy") {

      console.log(buyConditions, newCondition)
      console.log(buyConditions)
      setSellConditions([...buyConditions, newCondition]);
    } else {

      console.log(sellConditions, newCondition)
      console.log(sellConditions)
      setSellConditions([...sellConditions, newCondition]);

    }
  };
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
          <ConditionsButtonGroup side="buy" addCondition={addCondition} />

        </div>

        <div>
          <div className="flex flex-row">
            <BuildConditionRenderer deleteBlock={deleteSellCondition} conditions={sellConditions} setConditions={setSellConditions} />
          </div>

          <div className='flex flex-col'>
            <ConditionsButtonGroup side="sell" addCondition={addCondition} />

          </div>
        </div>

      </div>
    </div>
  );
}
