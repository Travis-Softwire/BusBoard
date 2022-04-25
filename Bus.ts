import moment, { Moment } from "moment";

export default class Bus {
    private routeNumber: string;
    private arrivalTime: Moment;

    constructor(routeNumber: string, arrivalTime: Moment) {
        this.routeNumber = routeNumber;
        this.arrivalTime = arrivalTime;
    }

    toString(): string{
        return `${this.routeNumber} ${this.arrivalTime.fromNow()}`
    }

    arrivesAfter(bus: Bus){
       return this.arrivalTime.isAfter(bus.arrivalTime)
    }
}

