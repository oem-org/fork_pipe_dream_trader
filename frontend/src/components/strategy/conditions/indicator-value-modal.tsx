import { ConditionElement, ConditionGroup, LogicalOperator, Side, Condition } from '@/interfaces/Condition'
import { Button } from '@/components/ui/buttons/button'
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import CreateConditionIndicator from './create-condition-indicator'
import CreateConditionOperator from './create-condition-operator'
import CreateConditionValue from './create-condition-value'

interface CreateIndicatorIndicatorProps {
  addCondition: (side: Side, cond: LogicalOperator | ConditionGroup) => void
  side: Side
}


export default function CreateIndicatorValueModal({ side, addCondition }: CreateIndicatorIndicatorProps) {
  // Indicator Operator Indicator modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleIndicatorIndicator = () => setIsModalOpen(!isModalOpen);
  const [indicator1, setIndicator1] = useState<any>({} as any)
  const [operator, setOperator] = useState<any>({} as any)
  const [value, setValue] = useState<any>({} as any)


  // Indicator Operator Value modal


  function handleAddCondition(side: Side) {
    console.log(indicator1.indicator)
    const cond = {
      side: side,
      fk_strategy_indicator_id_1: indicator1.id,
      fk_strategy_indicator_id_2: null,
      settings: [{ indicator: indicator1.indicator }, operator, { value: value }]
    }
    addCondition(side, cond)
    console.log(side, cond)
  }

  // Function to convert the state into a Condition object

  useEffect(() => {
    console.log(indicator1, operator, value)
  }, [indicator1, operator, value])

  return (
    <>
      <div>
        <button onClick={toggleIndicatorIndicator}>Add Indicator/Value</button>
        <Modal onClose={toggleIndicatorIndicator} isOpen={isModalOpen} title="Delete strategy">
          <CreateConditionIndicator setIndicator={setIndicator1} />
          <CreateConditionOperator setOperator={setOperator} />
          <CreateConditionValue setValue={setValue} />
          <Button
            onClick={() => {
              handleAddCondition(side);
            }}
          >
            Add
          </Button>
        </Modal>
      </div>
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
