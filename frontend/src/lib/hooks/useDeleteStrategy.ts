import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StrategiesClient } from "src/lib/services/ApiClientInstances";
import Strategy from "src/interfaces/Strategy";

export const useDeleteStrategy = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => StrategiesClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
    },
    onError: (error) => {
      console.error("Failed to delete strategy:", error);
    },
  });

  return mutation.mutateAsync;
};
