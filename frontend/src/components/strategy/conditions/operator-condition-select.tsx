import { Operator } from '@/interfaces/Operator'
import GenericSelect from '@/components/ui/lists/generic-select'

interface OperatorConditionSelectProps {
  key: number,
  initialValue: string
}


export default function OperatorConditionSelect({ key, initialValue }: OperatorConditionSelectProps) {
  const operators = [{ "id": 1, "name": "=" }, { "id": 2, "name": "<" }, { "id": 3, "name": ">" }];
  console.log(initialValue)
  function handleOperatorChange() {

  }
  return (
    <div key={key}>
      <GenericSelect<Operator>
        data={operators || []}
        keyExtractor={(operator) => operator.id}
        nameExtractor={(operator) => operator.name}
        onSelect={handleOperatorChange}
        renderItem={(operator) => <span>{operator.name}</span>}
        title="Operator"
        searchEnabled={false}
      />
    </div>
  )
}

