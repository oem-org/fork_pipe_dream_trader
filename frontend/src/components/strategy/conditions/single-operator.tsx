import { forwardRef, useImperativeHandle, useState } from "react";
import { singleOperators } from "./operators";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import { useEffect } from "react";
import { putStrategyConditionsApi } from "@/lib/apiClientInstances";

interface SingleOperatorProps {
  position: number | undefined;
  initialValue: string;
  onValueChange: (value: string) => void;
  conditionId: number,
  blockIndex?: number
}

export interface StrategyCondition {
  id: number;
  side: string;
  fk_strategy_id: number
  settings: string
}

const SingleOperator = forwardRef(
  ({ blockIndex, position, initialValue, onValueChange, conditionId }: SingleOperatorProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState<Operator>(
      singleOperators.find((operator) => operator.name === initialValue) as Operator
    );

    const { strategyId } = useStrategyStore()
    async function handleOperatorChange(operator: Operator) {
      try {

        setSelectedOperator(operator);
        if (onValueChange) {
          onValueChange(operator.name);
          const data = { "position": position, "settings": { "singleOperator": operator.name } }
          putStrategyConditionsApi.put(strategyId, conditionId, data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      const data = { "position": position }
      putStrategyConditionsApi.put(strategyId, conditionId, data)
    }, [blockIndex]);

    useImperativeHandle(ref, () => ({
      getValue: () => ({ singleOperator: selectedOperator.name }),
    }));
    return (
      <div>
        <GenericSelect<Operator>
          data={singleOperators || []}
          keyExtractor={(operator) => operator.id}
          nameExtractor={(operator) => operator.name}
          onSelect={handleOperatorChange}
          renderItem={(operator) => <span>{operator.name}</span>}
          title="Operator"
          searchEnabled={false}
          initialValue={selectedOperator}
        />
      </div>
    );
  }
);

export default SingleOperator;
