import Bus from "./Bus";
import ArrivalResponseFormat from "./ArrivalDataFormat";
import ArrivalsParser from "./ArrivalsParser";
import nodeFetch from "node-fetch";

export default class BusStop {
    private arrivals: Bus[] = [];
    private id: string;
    private indicator: string
    private name: string;

    constructor(id: string, indicator: string, name: string) {
        this.id = id;
        this.indicator = indicator;
        this.name = name;
    }

    async updateArrivals(): Promise<void> {
        const response = await nodeFetch(`https://api.tfl.gov.uk/StopPoint/${this.id}/Arrivals`);
        const data: ArrivalResponseFormat[] = await response.json() as ArrivalResponseFormat[];
        const parser: ArrivalsParser = new ArrivalsParser();
        const arrivals = parser.GetBusesFromJSON(data).slice(0, 5);
        this.arrivals = arrivals;
    }

    toString(){
        return `${this.name} (${this.indicator}): \n` + this.arrivals.map((bus: Bus) => bus.toString()).join('\n') + '\n'
    }
}