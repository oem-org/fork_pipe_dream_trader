import { forwardRef, useImperativeHandle, useState } from "react";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import { operators } from "./operators";
import { useEffect } from "react";
import { putStrategyConditionsApi } from "@/lib/apiClientInstances";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";


interface OperatorConditionSelectProps {
  position: number | undefined;
  conditionId: number
  initialValue: string;
  onValueChange: (value: string) => void;
  blockIndex: number,
}

const OperatorConditionSelect = forwardRef(
  ({ blockIndex, position, initialValue, onValueChange, conditionId }: OperatorConditionSelectProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState(
      operators.find((operator) => operator.name === initialValue) || null
    );

    const { strategyId } = useStrategyStore();
    function handleOperatorChange(operator: Operator) {
      console.log("Selected operator:", operator);
      setSelectedOperator(operator);
      if (onValueChange) {
        onValueChange(operator.name);
      }

      const data = { "position": position, "settings": [{ "none": null }, { "operator": operator.name }, { "none": null }] }
      putStrategyConditionsApi.put(strategyId, conditionId, data)
      console.log(conditionId, position)
    }

    useEffect(() => {
      console.log(" THE BLOCK Block Index:", blockIndex);
    }, [blockIndex]);
    useImperativeHandle(ref, () => ({
      getValue: () => ({ operator: selectedOperator?.name }),
      getPosition: () => ({ postion: position }),
    }));

    return (
      <div>
        <GenericSelect<Operator>
          data={operators || []}
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

export default OperatorConditionSelect;
