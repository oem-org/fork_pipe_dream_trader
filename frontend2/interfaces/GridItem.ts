import { GridItemSize } from "../types/GridItemSize"

export default interface GridItem {
  id: number
  size: GridItemSize
}



export class GridItemClass {
  id: number
  size: string

  constructor(data: GridItem) {
    // Assign data properties to the GridItem instance
    this.id = data.id
    this.size = data.size
    // Assign more properties as needed
  }
}

