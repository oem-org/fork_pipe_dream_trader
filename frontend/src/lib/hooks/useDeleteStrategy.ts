//Source old project

import { useMutation, useQueryClient } from "@tanstack/react-query"
import strategyCli



export const useDeleteStrategy = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      strategyClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
    },
    onError: (error) => {
      console.error('Failed to delete strategy:', error);
    }
  })

  return mutation.mutateAsync
}
