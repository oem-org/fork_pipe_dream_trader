// Must be named value for lightweight charts api
export interface Volume {
    time: string,
    value: number
}


export interface VolumeBackend {
    time: string,
    volume: number
} 
