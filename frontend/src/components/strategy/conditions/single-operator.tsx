import { Settings } from 'lucide-react';
import { operators } from './operators';
import { Operator } from '@/interfaces/Operator'
import GenericSelect from '@/components/ui/lists/generic-select'
interface SingleOperatorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

function SingleOperator({ initialValue, onValueChange }: SingleOperatorProps) {
  //let value = initialValue;

  //function handleClick() {
  //  console.log("click");
  //  onValueChange(value);
  //}


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
export default SingleOperator;
