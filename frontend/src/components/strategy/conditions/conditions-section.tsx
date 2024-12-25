import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useState } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
import { ConditionsArray, ConditionGroup } from '@/interfaces/Condition';

export default function ConditionsSection() {

  const { sellConditions, buyConditions, setSellConditions, setBuyConditions, deleteSellCondition, deleteBuyCondition } = useConditionsStore();


  const addConditionBuy = (newCondition: ConditionGroup) => {
    console.log("HELLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    console.log(buyConditions, newCondition)
    console.log(buyConditions)
    // To add a number 4 to the array

    setBuyConditions([...buyConditions, newCondition]);
  };

  const addConditionSell = (newCondition: ConditionGroup) => {
    console.log("HELLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    console.log(sellConditions, newCondition)
    console.log(sellConditions)
    // To add a number 4 to the array

    setSellConditions([...sellConditions, newCondition]);
  };
  //const addConditionBuy = (newCondition: any) => {
  //  setBuyConditions((prevConditions) => [...prevConditions, newCondition]);
  //  console.log(buyConditions)
  //};
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

        <div className="mt-4">
          <Button onClick={() => addConditionBuy([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Add Condition</Button>
        </div>
      </div>



      <div>
        <div className="flex flex-row">
          <BuildConditionRenderer deleteBlock={deleteSellCondition} conditions={sellConditions} setConditions={setSellConditions} />
        </div>

        <div className="mt-4">
          <Button onClick={() => addConditionSell([{ "indicator": "RSI_14" }, { "operator": ">" }, { "indicator": "RSI_14" }])}>Add Condition</Button>
        </div>
      </div>

    </div>
  );
}
