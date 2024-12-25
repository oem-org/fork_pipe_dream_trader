import { operators } from "./operators";
import { Operator } from "@/interfaces/Operator";
import GenericSelect from "@/components/ui/lists/generic-select";
import { useState } from "react";
import { ConditionElement } from "@/interfaces/Condition";

interface CreateConditionOperatprProps {
  setOperator: React.Dispatch<React.SetStateAction<ConditionElement>>;
}
export default function CreateConditionOperator({ setOperator }: CreateConditionOperatprProps) {
  const [selectedOperator, setSelectedOperator] = useState<Operator>();

  function handleOperatorChange(operator: Operator) {
    setSelectedOperator(operator);
    setOperator({ "operator": operator.name })
  }

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

