import { useMutation } from "@tanstack/react-query";
import { StrategiesClient } from "src/lib/services/ApiClientInstances";
import Strategy from "src/interfaces/Strategy";
// import {GridItemClass} from "../models/GridItem"

export const useCreateStrategy = () => {
  const mutation = useMutation({
    mutationFn: (newStrategy: Strategy) => StrategiesClient.post(newStrategy),
  });

  return mutation.mutateAsync;
};
