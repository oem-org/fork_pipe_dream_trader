import { useMutation } from "@tanstack/react-query";
import { IndicatorClient } from "src/lib/services/ApiClientInstances";
import Indicator from "src/interfaces/Indicator";
// import {GridItemClass} from "../models/GridItem"

export const useAddIndicator = () => {
  const mutation = useMutation({
    mutationFn: (newIndicator: Indicator) => IndicatorClient.post(newIndicator),
  });

  return mutation.mutateAsync;
};
