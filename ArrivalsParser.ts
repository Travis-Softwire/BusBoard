import Bus from "./Bus";
import moment, { Moment } from "moment";

export default class ArrivalsParser {

    GetBusesFromJSON(arrivals: any[]): Bus[] {
        let buses: Bus[] = [];
        arrivals.forEach(arrival => {
            const busNumber: number = parseInt(arrival.lineName);
            if (isNaN(busNumber)) {
                throw new Error("Invalid bus number: lineName is not a bus number");
            }
            buses.push(new Bus(parseInt(arrival.lineName), moment.utc(arrival.expectedArrival)));
        });
        buses.sort((a: Bus, b: Bus) => a.arrivalTime.isAfter(b.arrivalTime) ? 1 : -1);
        return buses;
    }
}