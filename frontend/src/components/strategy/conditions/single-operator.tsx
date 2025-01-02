import { forwardRef, useImperativeHandle, useState } from "react";
import { operators } from "./operators";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import { useUpdateStrategyCondition } from "@/lib/hooks/react-query/useUpdateStrategyConditions";

interface SingleOperatorProps {
  position: number;
  initialValue: string;
  onValueChange: (value: string) => void;
  conditionId: number
}

const SingleOperator = forwardRef(
  ({ position, initialValue, onValueChange, conditionId }: SingleOperatorProps, ref) => {
    const [selectedOperator, setSelectedOperator] = useState<Operator>(
      operators.find((operator) => operator.name === initialValue) as Operator
    );

    const { strategyId } = useStrategyStore()
    const { mutateAsync: update } = useUpdateStrategyCondition()
    async function handleOperatorChange(operator: Operator) {
      console.log("Selected operator:", operator);
      setSelectedOperator(operator);
      if (onValueChange) {
        onValueChange(operator.name);
      }
      const updateData = {
        "operator": operator.name
      }

      let result = await update({ conditionId, strategyId, updateData })
      console.log(position, conditionId, result, "SingleOperator update")
    }


    useImperativeHandle(ref, () => ({
      getValue: () => ({ singleOperator: selectedOperator.name }),
      getPosition: () => ({ position: position }),
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

export default SingleOperator;
