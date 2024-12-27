import { SquareX } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useState } from "react";

import { useDeleteStrategyCondition } from "@/lib/hooks/react-query/useDeleteStrategyCondition";
import { Button } from "@/components/ui/buttons/button";

interface DeleteButtonProps {
  conditionId: number;
  strategyId: number;
}

export function DeleteConditionBtn({ conditionId, strategyId }: DeleteButtonProps) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutateAsync: deleteCondition } = useDeleteStrategyCondition()

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  return (<>

    <Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Are you sure?"}>
      <Button onClick={() => { deleteCondition({ strategyId, conditionId }) }}>Delete Condition</Button>
    </Modal>
    <SquareX className="ml-8" onClick={toggleDeleteModal} />
  </>);
}
