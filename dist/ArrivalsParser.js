"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bus_1 = __importDefault(require("./Bus"));
const moment_1 = __importDefault(require("moment"));
class ArrivalsParser {
    GetBusesFromJSON(arrivals) {
        let buses = [];
        arrivals.forEach(arrival => {
            const busNumber = parseInt(arrival.lineName);
            if (isNaN(busNumber)) {
                throw new Error("Invalid bus number: lineName is not a bus number");
            }
            buses.push(new Bus_1.default(parseInt(arrival.lineName), moment_1.default.utc(arrival.expectedArrival)));
        });
        buses.sort((a, b) => a.arrivalTime.isAfter(b.arrivalTime) ? 1 : -1);
        return buses;
    }
}
exports.default = ArrivalsParser;
//# sourceMappingURL=ArrivalsParser.js.map