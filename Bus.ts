import moment, { Moment } from "moment";

export default class Bus {
    public routeNumber: number;
    public arrivalTime: Moment;

    constructor(routeNumber: number, arrivalTime: Moment) {
        this.routeNumber = routeNumber;
        this.arrivalTime = arrivalTime;
    }
}