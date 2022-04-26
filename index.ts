import Bus from "./Bus";
import ArrivalResponseFormat from "./ArrivalDataFormat";
import ArrivalsParser from "./ArrivalsParser";
import LongLatResponseFormat from "./LongLatResponseFormat";
import StopPointResponseFormat, { StopPoint } from "./StopPointResponseFormat";
import BusStop from "./BusStop";
import {Request, Response} from "express";
import nodeFetch from "node-fetch";
const readlineSync = require('readline-sync');

const express = require('express')
const app = express();


main();

async function main() {
    app.use(express.static('frontend'));
    app.use('/catsOnBuses', express.static('frontend/catsOnBuses.html'));

    app.get('/departureBoards', async function (req: Request, res: Response) {
        //localhost:3000/departureboards?postcode=TW118RS
        try {
            res.send(await printArrivalsAtNearestBusStops(req.query.postcode as string));
        } catch (e: any) {
            res.status(404).send(e.message)
        }
    });

    app.listen(3000)
}

async function printArrivalsAtNearestBusStops(input: string): Promise<string>{
    // get long lat
    const longLatResponse = await nodeFetch(`https://api.postcodes.io/postcodes/${input}`);
    const longLatData = await longLatResponse.json() as LongLatResponseFormat;
    if (longLatData.status !== 200) {
        throw new Error(`Postcode not found`);
    }
    // get stop point near the postcode
    const stopPointResponse = await nodeFetch(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
    const stopPointData = await stopPointResponse.json() as StopPointResponseFormat;
    const stopPoints: StopPoint[] = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);
    if (stopPoints.length === 0) {
        throw new Error(`No bus stops found`);
    }

    const busStops: BusStop[] = stopPoints.map((stopPoint: StopPoint) => ( new BusStop(stopPoint.naptanId, stopPoint.indicator, stopPoint.commonName)));

    const busStopPromises: Promise<void>[] = busStops.map(async (busStop: BusStop): Promise<void> => await busStop.updateArrivals());
    await Promise.all(busStopPromises);

    return JSON.stringify(busStops);

}


