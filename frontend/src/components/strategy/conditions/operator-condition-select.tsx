import { Operator } from '@/interfaces/Operator'
import GenericSelect from '@/components/ui/lists/generic-select'

interface OperatorConditionSelectProps {
  initialValue: string
}


export default function OperatorConditionSelect({ initialValue }: OperatorConditionSelectProps) {
  const operators: Operator[] = [{ "id": 1, "name": "=" }, { "id": 2, "name": "<" }, { "id": 3, "name": ">" }, { "id": 4, "name": "|" }]

  const initialObj = operators.find(item => item.name === initialValue);


  function handleOperatorChange() {

  }
  return (
    <div >
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
  )
}

