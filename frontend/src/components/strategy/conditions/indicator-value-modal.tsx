import { LogicalOperator, Side, CreateConditionRequest } from '@/interfaces/Condition'
import { Button } from '@/components/ui/buttons/button'
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import CreateConditionIndicator from './create-condition-indicator'
import CreateConditionOperator from './create-condition-operator'
import CreateConditionValue from './create-condition-value'

interface CreateIndicatorIndicatorProps {
  addCondition: (cond: LogicalOperator | CreateConditionRequest) => void
  side: Side
}

export default function CreateIndicatorValueModal({ side, addCondition }: CreateIndicatorIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [indicator1, setIndicator1] = useState<any>({} as any)
  const [operator, setOperator] = useState<any>({} as any)
  const [value, setValue] = useState<any>({} as any)

  function handleAddCondition() {
    console.log(indicator1.indicator)
    const cond: CreateConditionRequest = {
      side,
      settings: [{ indicator: indicator1.indicator }, operator, { value: value }]
    }
    addCondition(cond)
    toggleModal();
  }


  return (
    <>
      <div>
        <Button variant='outline' onClick={toggleModal}>Indicator/Value</Button>
        <Modal
          onClose={toggleModal}
          isOpen={isModalOpen}
          title="Add multiple indicator condition"
          onAction={handleAddCondition}
          actionText="Add condition"
        >
          <CreateConditionIndicator setIndicator={setIndicator1} />
          <CreateConditionOperator setOperator={setOperator} />
          <CreateConditionValue setValue={setValue} />
        </Modal>
      </div>
    </>
  );
}
