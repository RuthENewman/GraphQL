import myCurrentLocation, { message, name, getGreeting } from './myModule.js';
import total, { subtract } from './main.js';

console.log(message);
console.log(getGreeting(name));
console.log(myCurrentLocation);

console.log(total(2,4));
console.log(subtract(4,2));