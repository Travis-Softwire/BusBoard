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
const node_fetch_1 = __importDefault(require("node-fetch"));
const readlineSync = require('readline-sync');
const express = require('express');
const app = express();
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express.static('frontend'));
        app.use('/catsOnBuses', express.static('frontend/catsOnBuses.html'));
        app.get('/departureBoards', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                //localhost:3000/departureboards?postcode=TW118RS
                try {
                    res.send(yield printArrivalsAtNearestBusStops(req.query.postcode));
                }
                catch (e) {
                    res.status(404).send(e.message);
                }
            });
        });
        app.listen(3000);
    });
}
function printArrivalsAtNearestBusStops(input) {
    return __awaiter(this, void 0, void 0, function* () {
        // get long lat
        const longLatResponse = yield (0, node_fetch_1.default)(`https://api.postcodes.io/postcodes/${input}`);
        const longLatData = yield longLatResponse.json();
        if (longLatData.status !== 200) {
            throw new Error(`Postcode not found`);
        }
        // get stop point near the postcode
        const stopPointResponse = yield (0, node_fetch_1.default)(` https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${longLatData.result.latitude}&lon=${longLatData.result.longitude}`);
        const stopPointData = yield stopPointResponse.json();
        const stopPoints = stopPointData.stopPoints.sort((a, b) => a.distance < b.distance ? 1 : -1).slice(0, 2);
        if (stopPoints.length === 0) {
            throw new Error(`No bus stops found`);
        }
        const busStops = stopPoints.map((stopPoint) => (new BusStop_1.default(stopPoint.naptanId, stopPoint.indicator, stopPoint.commonName)));
        const busStopPromises = busStops.map((busStop) => __awaiter(this, void 0, void 0, function* () { return yield busStop.updateArrivals(); }));
        yield Promise.all(busStopPromises);
        return JSON.stringify(busStops);
    });
}
//# sourceMappingURL=index.js.map