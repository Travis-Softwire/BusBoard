"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BusStop_1 = __importDefault(require("./BusStop"));
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = readlineSync.question('Please enter your post code: ');
        // get long lat
        const longLatResponse = yield nodeFetch(`https://api.postcodes.io/postcodes/${input}`);
        const longLatData = yield longLatResponse.json();
        // get stop point near the postcode
        const stopPointResponse = yield nodeFetch(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
        const stopPointData = yield stopPointResponse.json();
        const stopPoints = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);
        let busStops = stopPoints.map((stopPoint) => (new BusStop_1.default(stopPoint.naptanId, stopPoint.indicator, stopPoint.commonName)));
        /*
        const busStopPromises: Promise<void>[] = busStops.map(async (busStop: BusStop): Promise<void> => await busStop.updateArrivals());
    
        await Promise.all(busStopPromises);
        busStops.forEach((busStop => console.log(busStop.toString())));
        */
        yield Promise.all(busStops.map((busStop) => __awaiter(this, void 0, void 0, function* () {
            yield busStop.updateArrivals();
            console.log(busStop.toString());
        })));
        console.log("Main ends here");
    });
}
//# sourceMappingURL=index.js.map