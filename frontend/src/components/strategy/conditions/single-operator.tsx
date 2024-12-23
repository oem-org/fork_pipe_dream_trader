import { forwardRef, useImperativeHandle, useState } from "react";
import { operators } from "./operators";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";

interface SingleOperatorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  onDelete: () => void
}

const SingleOperator = forwardRef(
  ({ initialValue, onValueChange, onDelete }: SingleOperatorProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState<Operator>(
      operators.find((operator) => operator.name === initialValue) as Operator
    );

    function handleOperatorChange(operator: Operator) {
      console.log("Selected operator:", operator);
      setSelectedOperator(operator);
      if (onValueChange) {
        onValueChange(operator.name);
      }
    }


    useImperativeHandle(ref, () => ({
      getValue: () => ({ singleOperator: selectedOperator.name }),
      deleteComponent: () => {
        onDelete();
      }
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
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  }
);

export default SingleOperator;
