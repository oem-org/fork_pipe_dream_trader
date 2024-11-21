import { create } from "zustand"

interface CoinSearchQuery {
  genreId?: number
  platformId?: number
  sortOrder?: string
  searchText?: string
}

interface coinSearchQueryStore {
  searchCoinQuery: CoinSearchQuery
  setSearchText: (searchText: string) => void
  setSortOrder: (sortOrder: string) => void
}



const coinSearchQueryStore = create<coinSearchQueryStore>((set) => ({
  searchCoinQuery: {},
  setSearchText: (searchText) => set(() => ({ searchCoinQuery: { searchText } })), //when searching, we clear the other filters
  setSortOrder: (sortOrder) =>
    set((store) => ({ searchCoinQuery: { ...store.searchCoinQuery, sortOrder } })),
}))

export default coinSearchQueryStore
