import Bus from "./Bus";
import ArrivalResponseFormat from "./ArrivalDataFormat";
import moment, { Moment } from "moment";

export default class ArrivalsParser {

    GetBusesFromJSON(arrivals: ArrivalResponseFormat[]): Bus[] {
        return arrivals
            .map<Bus>((arrival: ArrivalResponseFormat) => new Bus(arrival.lineName, moment.utc(arrival.expectedArrival)))
            .sort((a: Bus, b: Bus) => a.arrivesAfter(b) ? 1 : -1);

    }
}