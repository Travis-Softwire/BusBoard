export default interface LongLatResponseFormat {
    status: number,
    error: string,
    result: {
        longitude: string,
        latitude: string
    }
}