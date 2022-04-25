import Bus from "./Bus";
import ArrivalDataFormat from "./ArrivalDataFormat";
import moment, { Moment } from "moment";

export default class ArrivalsParser {

    GetBusesFromJSON(arrivals: ArrivalDataFormat[]): Bus[] {
        return arrivals
            .map<Bus>((arrival: ArrivalDataFormat) => new Bus(arrival.lineName, moment.utc(arrival.expectedArrival)))
            .sort((a: Bus, b: Bus) => a.arrivesAfter(b) ? 1 : -1);

    }
}