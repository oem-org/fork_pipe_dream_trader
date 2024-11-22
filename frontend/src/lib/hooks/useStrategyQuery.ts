import { useQuery } from "@tanstack/react-query";
import { StrategiesClient } from "@/lib/services/ApiClientInstances";
import Strategy from "@/interfaces/Strategy";

const useStrategyQuery = () => {
  const fetchStrategies = async (): Promise<Strategy[]> => {
    const gridItemsData: Strategy[] = await StrategiesClient.getAll();

    return gridItemsData;
  };

  return useQuery<Strategy[], Error>({
    queryKey: ["strategies"],
    queryFn: fetchStrategies,
  });
};

export default useStrategyQuery;
