import { forwardRef, useImperativeHandle, useState } from "react";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import { operators } from "./operators";

interface OperatorConditionSelectProps {
  position: number;
  conditionId: number
  initialValue: string;
  onValueChange: (value: string) => void;
}

const OperatorConditionSelect = forwardRef(
  ({ position, initialValue, onValueChange, conditionId }: OperatorConditionSelectProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState(
      operators.find((operator) => operator.name === initialValue) || null
    );

    function handleOperatorChange(operator: Operator) {
      console.log("Selected operator:", operator);
      setSelectedOperator(operator);
      if (onValueChange) {
        onValueChange(operator.name);
      }
      console.log(conditionId, position)
    }

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
