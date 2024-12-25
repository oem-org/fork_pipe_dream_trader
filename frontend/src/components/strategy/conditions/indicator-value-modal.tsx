
import { ConditionElement, ConditionGroup, LogicalOperator, Side, Condition } from '@/interfaces/Condition'
import { Button } from '@/components/ui/buttons/button'
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import CreateConditionIndicator from './create-condition-indicator'
import CreateConditionOperator from './create-condition-operator'
import CreateConditionValue from './create-condition-value'

interface IndicatorValueModalProps {
  addCondition: (side: Side, cond: LogicalOperator | ConditionGroup) => void
  side: Side
}

export default function IndicatorValueModal({ side, addCondition }: IndicatorValueModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleIndicatorIndicator = () => setIsModalOpen(!isModalOpen);

  const [indicator1, setIndicator1] = useState<any>({} as ConditionElement)
  const [operator, setOperator] = useState<any>({} as ConditionElement)
  const [value, setValue] = useState<any>({} as ConditionElement)

  function handleAddCondition(side: Side, cond: ConditionGroup) {
    addCondition(side, cond)
    console.log(side, cond)
  }

  // Function to convert the state into a Condition object

  useEffect(() => {
    console.log(indicator1, operator, value)
  }, [indicator1, operator, value])

  return (
    <>
      <button onClick={toggleIndicatorIndicator}>Delete</button>
      <Modal onClose={toggleIndicatorIndicator} isOpen={isModalOpen} title="Delete strategy">
        <CreateConditionIndicator setIndicator={setIndicator1} />
        <CreateConditionOperator setOperator={setOperator} />
        <CreateConditionValue setValue={setValue} />
        <Button
          onClick={() => {
            handleAddCondition(side, [indicator1, operator, value]);
          }}
        >
          Add
        </Button>
      </Modal>
    </>
  );
}
//<button onClick={() => toggleIndicatorValue()} className="btn-dropdown">Rename</button>

//return (<>
//
//
//  <div className="mt-4 flex flex-row">
//  </div>
//  <div className="mt-4 flex flex-row">
//    <Button onClick={() => addCondition("&")}> &amp; </Button>
//    <Button onClick={() => addCondition("|")}>|</Button>
//    <Button onClick={() => addCondition("~")}>~</Button>
//    <Button onClick={() => addCondition(">")}>{'>'}</Button>
//    <Button onClick={() => addCondition("<")}>{'<'}</Button>
//  </div>
//
//</>)
//

//<Button onClick={() => addCondition([{ "value": 1 }, { "operator": ">" }, { "indicator": null }])}>Value/Indicator</Button>
//<Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "value": 1 }])}>Indicator/Value</Button>
//<Button onClick={() => addCondition([{ "indicator": null }, { "operator": ">" }, { "indicator": null }])}>Indicator/Indicator</Button>
