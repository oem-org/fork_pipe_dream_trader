import { useMutation, useQueryClient } from "@tanstack/react-query"
import {IndicatorClient} from "../services/ApiClientInstances"
import Indicator from "../models/Indicator"

export const useDeleteIndicator = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id}: { id: number }) => {

      await IndicatorClient.delete(id);
          return id;
    },
    onSuccess: (deletedIndicatorId) => {

      queryClient.setQueryData<Indicator[]>(["strategyIndicators"], (oldIndicators = []) => 
        oldIndicators.filter(indicator => indicator.id !== deletedIndicatorId)
      );
    },
    onError: (error) => {
        console.error("Failed to delete indicator", error);
      }
  })

  return mutation.mutateAsync
}