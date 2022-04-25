import Bus from "./Bus";
import ArrivalResponseFormat from "./ArrivalDataFormat";
import ArrivalsParser from "./ArrivalsParser";
import LongLatResponseFormat from "./LongLatResponseFormat";
import StopPointResponseFormat, { StopPoint } from "./StopPointResponseFormat";
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');

main();

async function main() {
    const input = readlineSync.question('Please enter your post code: ');

    // get long lat
    const longLatResponse: any = await nodeFetch(`https://api.postcodes.io/postcodes/${input}`);
    const longLatData: LongLatResponseFormat = await longLatResponse.json() as LongLatResponseFormat;

    // get stop point near the postcode
    const stopPointResponse: any = await nodeFetch(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
    const stopPointData: StopPointResponseFormat = await stopPointResponse.json() as StopPointResponseFormat;
    const stopPoints: StopPoint[] = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);
    //
    stopPoints.forEach(async (stopPoint: StopPoint) => {
        const buses = await GetNextBusesForStop(stopPoint.naptanId);
        console.log(`Bus stop name: ${stopPoint.commonName} (${stopPoint.indicator}): `);
        buses.forEach((bus: Bus) => {
            console.log(bus.toString());
        });
    });
    console.log("Main ends");
}

async function GetNextBusesForStop(stopId: string): Promise<Bus[]> {
    const response: any = await nodeFetch(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`);
    const data: ArrivalResponseFormat[] = await response.json() as ArrivalResponseFormat[];
    const parser: ArrivalsParser = new ArrivalsParser();
    return parser.GetBusesFromJSON(data).slice(0, 5);
}

