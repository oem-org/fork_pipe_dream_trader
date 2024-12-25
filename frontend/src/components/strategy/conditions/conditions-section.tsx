import { Button } from '@/components/ui/buttons/button';
import BuildConditionRenderer from './build-condition-renderer';
import { useState } from 'react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';
export default function ConditionsSection() {

  const { conditions, setConditions } = useConditionsStore();

  const checkLastConditionType = () => {
    const lastCondition = conditions[conditions.length - 1];
    return Array.isArray(lastCondition) ? 'array' : 'string';
  };

  const addCondition = (newCondition: any) => {
    setConditions((prevConditions) => [...prevConditions, newCondition]);
    console.log(conditions)
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
      <div className="flex flex-row">
        <BuildConditionRenderer />
      </div>

      <div className="mt-4">
        {checkLastConditionType() === 'array' ? (
          <Button onClick={() => addCondition('&')}>Add Operator (And, Or, etc.)</Button>
        ) : (
          <Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Add Condition</Button>
        )}
      </div>
    </div>
  );
}
