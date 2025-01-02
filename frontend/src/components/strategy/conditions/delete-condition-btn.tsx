import { SquareX } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/buttons/button";
import { deleteStrategyConditionApi } from "@/lib/apiClientInstances";
interface DeleteButtonProps {
  conditionId: number;
  strategyId: number;
  fetchStrategyConditions: () => Promise<void>;
}

export function DeleteConditionBtn({ fetchStrategyConditions, conditionId, strategyId }: DeleteButtonProps) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const handleDelete = async () => {
    await fetchStrategyConditions()
    deleteStrategyConditionApi.delete(strategyId, conditionId)
  }
  return (<>

    <Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title={"Are you sure?"}>
      <Button onClick={handleDelete}>
        Delete Condition
      </Button>
    </Modal>
    <SquareX className="ml-8" onClick={toggleDeleteModal} />
  </>);
}
