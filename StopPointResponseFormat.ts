export default interface StopPointResponseFormat {
    stopPoints: StopPoint[]
}

export interface StopPoint {
    naptanId: string,
    indicator: string,
    commonName: string,
    distance: number
}