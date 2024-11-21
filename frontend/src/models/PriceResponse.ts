import { Price } from "./Price"

export interface PriceResponse {
    count: number
    next: null | string
    previous: null | string
    results: Price[]
  }