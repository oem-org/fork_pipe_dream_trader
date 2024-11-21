import { create } from "zustand"
import { GridItemSize } from "../../types/GridItemSize"
import GridItem from "../../models/GridItem"

interface GridStore {
gridItems: GridItem[]
counter: number
add: (size: GridItemSize) => void
remove: (gridItemId: number) => void
setGridItems: (list: GridItem[]) => void
}

const useGridStore = create<GridStore>((set) => ({
  gridItems: [],
  counter: 0,
  add: (size) => {
    try {
      set((state) => ({
        gridItems: [...state.gridItems, { id: state.counter, size }],
        counter: state.counter + 1, // Increment counter
      }))
    } catch (error) {
      console.error('Error while adding item:', error)
    }
  },
  remove: (gridItemId) =>
    set((state) => ({
      gridItems: state.gridItems.filter((gridItem) => gridItem.id !== gridItemId),
    })),
  setGridItems: (newGridItems: GridItem[]) =>
    set(() => ({
      gridItems: newGridItems,
    })),
}))


export default useGridStore