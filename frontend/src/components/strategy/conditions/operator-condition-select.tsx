import { forwardRef, useImperativeHandle, useState } from "react";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import { operators } from "./operators";

interface OperatorConditionSelectProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const OperatorConditionSelect = forwardRef(
  ({ initialValue, onValueChange }: OperatorConditionSelectProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState(
      operators.find((operator) => operator.name === initialValue) || null
    );

    function handleOperatorChange(operator: Operator) {
      console.log("Selected operator:", operator);
      setSelectedOperator(operator);
      if (onValueChange) {
        onValueChange(operator.name);
      }
    }

    useImperativeHandle(ref, () => ({
      getValue: () => ({ operator: selectedOperator?.name }),
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
