import { Operator } from '@/interfaces/Operator'
import GenericSelect from '@/components/ui/lists/generic-select'

interface OperatorConditionSelectProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

export default function OperatorConditionSelect({ initialValue, onValueChange }: OperatorConditionSelectProps) {
  const operators: Operator[] = [
    { "id": 1, "name": "=" },
    { "id": 2, "name": "<" },
    { "id": 3, "name": ">" },
    { "id": 4, "name": "|" }
  ];

  const initialObj = operators.find(operator => operator.name === initialValue);

  function handleOperatorChange(operator: Operator) {
    console.log("Selected operator:", operator);
    if (onValueChange) {
      onValueChange(operator.name);
    }
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
        initialValue={initialObj}
      />
    </div>
  );
}
