import { useMutation } from "@tanstack/react-query"
import { postIndicatorApi } from "../apiClientInstances"
import IndicatorRequest from "../../interfaces/requests/IndicatorRequest"
import UpdateIndicatorRequest

export const postIndicatorQuery = () => {
  const mutation = useMutation({
    mutationFn: (newIndicator: IndicatorRequest) => postIndicatorApi.post(newIndicator)
  })

  return mutation.mutateAsync
}
