"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrivalsParser_1 = __importDefault(require("./ArrivalsParser"));
const nodeFetch = require('node-fetch');
const readlineSync = require('readline-sync');
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = readlineSync.question('Please enter the bus stop code: ');
        const response = yield nodeFetch(`https://api.tfl.gov.uk/StopPoint/${input}/Arrivals`);
        const data = yield response.json();
        const parser = new ArrivalsParser_1.default();
        const buses = parser.GetBusesFromJSON(data).slice(0, 5);
        buses.forEach((bus) => {
            console.log(bus.toString());
        });
    });
}
//# sourceMappingURL=index.js.map