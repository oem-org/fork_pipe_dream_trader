import { ConditionElement, ConditionGroup, LogicalOperator, Side, Condition } from '@/interfaces/Condition'
import { Button } from '@/components/ui/buttons/button'
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import CreateConditionIndicator from './create-condition-indicator'
import CreateConditionOperator from './create-condition-operator'
interface CreateIndicatorIndicatorProps {
  addCondition: (side: Side, cond: LogicalOperator | ConditionGroup) => void
  side: Side
}

export default function CreateIndicatorIndicator({ side, addCondition }: CreateIndicatorIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleIndicatorIndicator = () => setIsModalOpen(!isModalOpen);

  const [indicator1, setIndicator1] = useState<any>({} as any)
  const [operator, setOperator] = useState<any>({} as any)
  const [indicator2, setIndicator2] = useState<any>({} as any)

  function handleAddCondition(side: Side) {
    console.log(indicator1.indicator)
    console.log(indicator2.indicator)
    const cond = {
      side: side,
      fk_strategy_indicator_id_1: indicator1.id,
      fk_strategy_indicator_id_2: indicator2.id,
      settings: [{ indicator: indicator1.indicator }, operator, { indicator: indicator2.indicator }]
    }
    addCondition(side, cond)
    console.log(side, cond)
  }

  // Function to convert the state into a Condition object

  useEffect(() => {
    console.log(indicator1, operator, indicator2)
  }, [indicator1, operator, indicator2])

  return (
    <>
      <button onClick={toggleIndicatorIndicator}>Delete</button>
      <Modal onClose={toggleIndicatorIndicator} isOpen={isModalOpen} title="Delete strategy">
        <CreateConditionIndicator setIndicator={setIndicator1} />
        <CreateConditionOperator setOperator={setOperator} />
        <CreateConditionIndicator setIndicator={setIndicator2} />
        <Button
          onClick={() => {
            handleAddCondition(side);
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
