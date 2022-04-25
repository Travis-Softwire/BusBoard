import Bus from "./Bus";
import ArrivalsParser from "./ArrivalsParser";
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');

main();

async function main() {

    const response: any = await nodeFetch('https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals');
    const data: any = await response.json();
    const parser: ArrivalsParser = new ArrivalsParser();
    const buses: Bus[] = parser.GetBusesFromJSON(data).slice(0, 5);
    console.log(buses);
}

