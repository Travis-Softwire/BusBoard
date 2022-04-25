import Bus from "./Bus";
import ArrivalDataFormat from "./ArrivalDataFormat";
import ArrivalsParser from "./ArrivalsParser";
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');

main();

async function main() {
    const input = readlineSync.question('Please enter the bus stop code: ');

    const response: any = await nodeFetch(`https://api.tfl.gov.uk/StopPoint/${input}/Arrivals`);
    const data: ArrivalDataFormat[] = await response.json() as ArrivalDataFormat[];
    const parser: ArrivalsParser = new ArrivalsParser();
    const buses: Bus[] = parser.GetBusesFromJSON(data).slice(0, 5);
    buses.forEach((bus: Bus) => {
        console.log(bus.toString());
    })
}

