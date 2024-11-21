import { useQuery } from "@tanstack/react-query"
import {GridItemClient} from "../services/ApiClientInstances"
import type GridItem from "../models/GridItem"
// import {GridItemClass} from "../models/GridItem"

const useGridQuery = () => {
  const fetchGridItems = async (): Promise<GridItem[]> => {
    //input the id of the grid you want to fetch
    const gridItemsData: GridItem[] = await GridItemClient.getAll()

    // const gridItemsData = JSON.parse(response.gridConfig)
    //REMOVE GRID ITEM CLASS COMPLETELY
    // const gridItems = gridItemsData.map((item: GridItem) => new GridItemClass(item))
    return gridItemsData
  }

  return useQuery<GridItem[], Error>({
    queryKey: ["gridItems"],
    queryFn: fetchGridItems,
  })
}

export default useGridQuery
