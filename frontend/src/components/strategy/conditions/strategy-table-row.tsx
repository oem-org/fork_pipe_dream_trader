
import { Strategy } from "@/interfaces/Strategy";
import { Button } from "@/components/ui/buttons/button";
import { useDeleteStrategy } from "@/lib/hooks/react-query/useDeleteStrategy";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
interface StrategyTableRowProps {
  strategy: Strategy;
  setLocalStrategyId: React.Dispatch<React.SetStateAction<number>>;

}

export default function StrategyTableRow({ strategy, setLocalStrategyId }: StrategyTableRowProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { mutateAsync: deleteStrategy } = useDeleteStrategy();
  const handleOpen = () => {
    navigate(`/strategy/${strategy.id}`);
  };

  async function handleDelete() {
    await deleteStrategy(strategy.id);
    setLocalStrategyId(0)
    queryClient.invalidateQueries({ queryKey: ["strategy", strategy.id] });
  };


  return (
    <div className="flex flex-row items-center justify-between">
      <span>{strategy.name}</span>
      <div className="flex gap-2">
        <Button onClick={handleOpen}>Open</Button>
        <Button variant="outline" onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
};

