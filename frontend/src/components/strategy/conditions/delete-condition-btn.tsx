import { SquareX } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/buttons/button";
import { deleteStrategyConditionApi } from "@/lib/apiClientInstances";
interface DeleteButtonProps {
  conditionId: number;
  strategyId: number;
  setRefetch: React.Dispatch<React.SetStateAction<number>>,
}

export function DeleteConditionBtn({ setRefetch, conditionId, strategyId }: DeleteButtonProps) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const handleDelete = async () => {
    await deleteStrategyConditionApi.delete(strategyId, conditionId)
    setRefetch((prev) => prev + 1)
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
