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
        try {
            res.send(await printArrivalsAtNearestBusStops(req.params.postcode));
        } catch (e: any) {
            res.status(404).send(e.message)
        }
    });

    app.listen(3000)
}

async function printArrivalsAtNearestBusStops(input: string): Promise<string>{
    // get long lat
    const longLatResponse: any = await nodeFetch(`https://api.postcodes.io/postcodes/${input}`);
    const longLatData: LongLatResponseFormat = await longLatResponse.json() as LongLatResponseFormat;
    if (longLatData.status !== 200) {
        throw new Error(`Postcode not found`);
    }
    // get stop point near the postcode
    const stopPointResponse: any = await nodeFetch(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
    const stopPointData: StopPointResponseFormat = await stopPointResponse.json() as StopPointResponseFormat;
    const stopPoints: StopPoint[] = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);
    if (stopPoints.length === 0) {
        throw new Error(`No bus stops found`);
    }

    const busStops: BusStop[] = stopPoints.map((stopPoint: StopPoint) => ( new BusStop(stopPoint.naptanId, stopPoint.indicator, stopPoint.commonName)));
    const busStopPromises: Promise<void>[] = busStops.map(async (busStop: BusStop): Promise<void> => await busStop.updateArrivals());
    await Promise.all(busStopPromises);
    // return busStops.map(busStop => busStop.toString()).join();
    return JSON.stringify(busStops);

    /*
    await Promise.all(busStops.map(async (busStop: BusStop): Promise<void> => {
        await busStop.updateArrivals();
        console.log(busStop.toString());
    }));
    */
}


