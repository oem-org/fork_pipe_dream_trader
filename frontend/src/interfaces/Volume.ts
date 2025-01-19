import { UTCTimestamp } from "lightweight-charts"

// Must be named value for lightweight charts api
export interface Volume {
    time: UTCTimestamp,
    value: number
}


export interface VolumeBackend {
    time: string,
    volume: number
} 
