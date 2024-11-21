import GridItem from "../models/GridItem"
import ApiClient from "./ApiClient"

export const GridItemClient = new ApiClient<GridItem>('sections')

