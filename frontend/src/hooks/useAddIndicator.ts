import { useMutation } from "@tanstack/react-query"
import {IndicatorClient} from "../services/ApiClientInstances"
import Indicator from "../models/Indicator"
// import {GridItemClass} from "../models/GridItem"

export const useAddIndicator = () => {
  const mutation = useMutation({
    mutationFn: (newIndicator: Indicator) => IndicatorClient.post(newIndicator)
  })

  return mutation.mutateAsync
}

