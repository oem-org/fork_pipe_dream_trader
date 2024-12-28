import { LogicalOperator, Side } from '@/interfaces/Condition';
import { Button } from '@/components/ui/buttons/button';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import CreateConditionIndicator from './create-condition-indicator';
import CreateConditionOperator from './create-condition-operator';
import { CreateConditionRequest } from '@/interfaces/Condition';

interface CreateIndicatorIndicatorProps {
  addCondition: (cond: LogicalOperator | CreateConditionRequest) => void;
  side: Side;
}

export default function CreateIndicatorIndicatorModal({ side, addCondition }: CreateIndicatorIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [indicator1, setIndicator1] = useState<any>({});
  const [operator, setOperator] = useState<any>({});
  const [indicator2, setIndicator2] = useState<any>({});

  function handleAddCondition() {
    const cond: CreateConditionRequest = {
      side,
      fk_strategy_indicator_id_1: indicator1.id,
      fk_strategy_indicator_id_2: indicator2.id,
      settings: [
        { indicator: indicator1.indicator },
        operator,
        { indicator: indicator2.indicator },
      ],
    };
    addCondition(cond);
    toggleModal();
  }

  useEffect(() => {
    console.log(indicator1, operator, indicator2);
  }, [indicator1, operator, indicator2]);

  return (
    <>
      <div>
        <Button variant="outline" onClick={toggleModal}>
          Indicator/Indicator
        </Button>
        <Modal
          onClose={toggleModal}
          isOpen={isModalOpen}
          title="Add multiple indicator condition"
          onAction={handleAddCondition}
          actionText="Add condition"
        >
          <CreateConditionIndicator setIndicator={setIndicator1} />
          <CreateConditionOperator setOperator={setOperator} />
          <CreateConditionIndicator setIndicator={setIndicator2} />
        </Modal>
      </div>
    </>
  );
}
