import Bus from "./Bus";
import ArrivalResponseFormat from "./ArrivalDataFormat";
import ArrivalsParser from "./ArrivalsParser";
import LongLatResponseFormat from "./LongLatResponseFormat";
import StopPointResponseFormat, { StopPoint } from "./StopPointResponseFormat";
import BusStop from "./BusStop";
import {Request, Response} from "express";
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');

const express = require('express')
const app = express();


main();

async function main() {
    app.get('/:postcode', async function (req: Request, res: Response) {
        res.send(await printArrivalsAtNearestBusStops(req.params.postcode));
    });

    app.listen(3000)
}

async function printArrivalsAtNearestBusStops(input: string): Promise<string>{
    // get long lat
    const longLatResponse: any = await nodeFetch(`https://api.postcodes.io/postcodes/${input}`);
    const longLatData: LongLatResponseFormat = await longLatResponse.json() as LongLatResponseFormat;

    // get stop point near the postcode
    const stopPointResponse: any = await nodeFetch(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
    const stopPointData: StopPointResponseFormat = await stopPointResponse.json() as StopPointResponseFormat;
    const stopPoints: StopPoint[] = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);


    const busStops: BusStop[] = stopPoints.map((stopPoint: StopPoint) => ( new BusStop(stopPoint.naptanId, stopPoint.indicator, stopPoint.commonName)));
    const busStopPromises: Promise<void>[] = busStops.map(async (busStop: BusStop): Promise<void> => await busStop.updateArrivals());
    await Promise.all(busStopPromises);
    return busStops.map(busStop => busStop.toString()).join();


    /*
    await Promise.all(busStops.map(async (busStop: BusStop): Promise<void> => {
        await busStop.updateArrivals();
        console.log(busStop.toString());
    }));
    */
}


