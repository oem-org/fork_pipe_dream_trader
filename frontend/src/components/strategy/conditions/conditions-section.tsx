import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useState } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
export default function ConditionsSection() {

  const { sellConditions, buyConditions, setSellConditions, setBuyConditions } = useConditionsStore();


  const addConditionBuy = (newCondition: any) => {
    setBuyConditions((prevConditions) => [...prevConditions, newCondition]);
    console.log(buyConditions)
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
        <div className="flex flex-row">
          <BuildConditionRenderer conditions={buyConditions} setConditions={setBuyConditions} />
        </div>

        <div className="mt-4">
          <Button onClick={() => addConditionBuy([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Add Condition</Button>
        </div>
      </div>



      <div>
        <div className="flex flex-row">
          <BuildConditionRenderer conditions={sellConditions} setConditions={setSellConditions} />
        </div>

        <div className="mt-4">
        </div>
      </div>

    </div>
  );
}
