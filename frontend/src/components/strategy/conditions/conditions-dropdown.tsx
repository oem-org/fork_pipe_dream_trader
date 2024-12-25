

import { useState } from 'react';
import Modal from '../../ui/modal';
import { Button } from '../../ui/buttons/button';
import Dropdown from '../../ui/navigation/dropdown';
import { SettingsIcon } from 'lucide-react';
import useConditionsStore from '@/lib/hooks/useConditionsStore';

interface ConditionSettingsProps {
  conditionId: number
}

export default function ConditionSettings({ conditionId }: ConditionSettingsProps) {
  const { deleteCondition } = useConditionsStore();

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleRenameModal = () => setIsRenameModalOpen(!isRenameModalOpen);

  return (<>
    <Dropdown textColor="text-black" icon={SettingsIcon} animation={false} direction="right">
      <button onClick={() => toggleDeleteModal()} className="btn-dropdown">Delete</button>
      <button onClick={() => toggleRenameModal()} className="btn-dropdown">Rename</button>
    </Dropdown>

    <Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Delete"}>
      <Button onClick={() => { deleteCondition(conditionId) }}>Delete Strategy</Button>
    </Modal>

    <Modal onClose={toggleRenameModal} isOpen={isRenameModalOpen} title={"Edit"}>
      <p>Rename</p>
    </Modal>
  </>)
}
