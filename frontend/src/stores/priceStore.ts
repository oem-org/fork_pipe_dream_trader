import { create } from "zustand"

import { Price } from "../models/Price"


interface priceStore {
prices: Price[]
selectedCoinId: number | null
setPrices: (prices: Price[]) => void
setNext: (next: string | null) => void
setPrevious: (previous: string | null) => void
setResults: (results: Price[]) => void
setCoinId: (id: number) => void
getByCoinId: () => Price | undefined
}

interface priceStore {
    prices: Price[]
    selectedCoinId: number | null
    next: string | null // Added next variable
    previous: string | null // Added previous variable
    results: Price[] | null // Added results variable
    page: number | null // Added page variable
    setPrices: (prices: Price[]) => void
    setNext: (next: string) => void
    setPrevious: (previous: string) => void
    setResults: (results: Price[]) => void
    setPage: (page: number) => void // Added setPage function
    setCoinId: (id: number) => void
    getByCoinId: () => Price | undefined
}

const priceStore = create<priceStore>((set, get) => ({
    prices: [],
    selectedCoinId: null,
    next: null,
    previous: null,
    results: null,
    page: 1,
    setPrices: (prices: Price[]) => set(() => ({ prices })),
    setNext: (next: string) => set(() => ({ next })),
    setPrevious: (previous: string) => set(() => ({ previous })),
    setResults: (results: Price[]) => set(() => ({ results })),
    setPage: (page: number) => set(() => ({ page })), // Initialized setPage function
    setCoinId: (id: number) => set(() => ({ selectedCoinId: id })),

    getByCoinId: () => {
        const { prices, selectedCoinId } = get()
        console.log(`Selected ID: ${selectedCoinId}`)
        console.log(`prices: ${JSON.stringify(prices)}`)
        const foundStrategy = prices.find((strategy) => strategy.id === selectedCoinId)
        console.log(`Found strategy: ${JSON.stringify(foundStrategy)}`)
        return foundStrategy
    },
}))

export default priceStore




