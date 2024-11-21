import { Price } from "@/interfaces/Price"

export interface TimeseriesResponse {
    count: number
    next: null | string
    previous: null | string
    results: Price[]
}
