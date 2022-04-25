"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bus {
    constructor(routeNumber, arrivalTime) {
        this.routeNumber = routeNumber;
        this.arrivalTime = arrivalTime;
    }
    toString() {
        return `${this.routeNumber} ${this.arrivalTime.fromNow()}`;
    }
    arrivesAfter(bus) {
        return this.arrivalTime.isAfter(bus.arrivalTime);
    }
}
exports.default = Bus;
//# sourceMappingURL=Bus.js.map