

import { useState } from 'react';
import Modal from '../../ui/modal';
import { Button } from '../../ui/buttons/button';
import Dropdown from '../../ui/navigation/dropdown';
import { SettingsIcon } from 'lucide-react';

interface ConditionSettingsProps {
  conditionId: number
  deleteBlock: (conditionId: number) => void
}

export default function ConditionSettings({ deleteBlock, conditionId }: ConditionSettingsProps) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  function handleDelete(id: number) {
    deleteBlock(id)
    toggleDeleteModal()
  }

  return (<>
    <Dropdown textColor="text-black" icon={SettingsIcon} animation={false} direction="right">
      <button onClick={() => toggleDeleteModal()} className="btn-dropdown">Delete</button>
    </Dropdown>

    <Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Delete"}>
      <Button onClick={() => handleDelete(conditionId)}>Delete Strategy</Button>
    </Modal>
  </>)
}
