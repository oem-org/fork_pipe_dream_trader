import { Strategy } from "@/interfaces/Strategy";
import { Button } from "@/components/ui/buttons/button";
import { useDeleteStrategy } from "@/lib/hooks/react-query/useDeleteStrategy";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/ui/modal";
import { useState } from "react";

interface StrategyTableRowProps {
  strategy: Strategy;
  setLocalStrategyId: React.Dispatch<React.SetStateAction<number>>;
}

// TODO: fix the click propogation  
export default function StrategyTableRow({ strategy, setLocalStrategyId }: StrategyTableRowProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteStrategy } = useDeleteStrategy();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpen = () => {
    navigate(`/strategy/${strategy.id}`);
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  async function handleDelete(id: number): Promise<void> {
    await deleteStrategy(id);
    setLocalStrategyId(0);
    queryClient.invalidateQueries({ queryKey: ["strategy", strategy.id] });
    toggleDeleteModal();
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span>{strategy.name}</span>
        <div className="flex gap-2">
          <Button onClick={handleOpen}>Open</Button>
          <Button variant="outline" onClick={toggleDeleteModal}>Delete</Button>
        </div>
      </div>

      <Modal onClose={toggleDeleteModal} isOpen={isDeleteModalOpen} title="Delete Strategy">
        <p>Are you sure you want to delete the strategy?</p>
        <div className="flex gap-2">
          <Button onClick={() => handleDelete(strategy.id)} variant="outline">Delete Strategy</Button>
          <Button onClick={toggleDeleteModal}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
}
