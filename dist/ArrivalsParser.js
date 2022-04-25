"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bus_1 = __importDefault(require("./Bus"));
const moment_1 = __importDefault(require("moment"));
class ArrivalsParser {
    GetBusesFromJSON(arrivals) {
        return arrivals
            .map((arrival) => new Bus_1.default(arrival.lineName, moment_1.default.utc(arrival.expectedArrival)))
            .sort((a, b) => a.arrivesAfter(b) ? 1 : -1);
    }
}
exports.default = ArrivalsParser;
//# sourceMappingURL=ArrivalsParser.js.map