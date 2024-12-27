
import { Strategy } from "@/interfaces/Strategy";
import { Button } from "@/components/ui/buttons/button";
import { useDeleteStrategy } from "@/lib/hooks/react-query/useDeleteStrategy";
import { useNavigate } from "react-router-dom";

interface StrategyTableRowProps {
  strategy: Strategy;
  localStrategyId: number;
}

export default function StrategyTableRow({ strategy, localStrategyId }: StrategyTableRowProps) {
  const navigate = useNavigate();
  const { mutate: deleteStrategy } = useDeleteStrategy();

  const handleOpen = () => {
    navigate(`/strategy/${strategy.id}`);
  };

  const handleDelete = () => {
    deleteStrategy(strategy.id);
  };


  return (
    <div className="flex flex-row items-center justify-between">
      <span>{strategy.name}</span>
      <div className="flex gap-2">
        <Button onClick={handleOpen}>Open</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
};

