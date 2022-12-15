const fs = require("fs");
let input = fs.readFileSync("./inputs/day15.txt").toString().split("\n");
input = input.map((l) => l.trim());

let grid = [];
let overallXMin = Infinity;
let overallXMax = -Infinity;
let sensors = [];
const yToCheck = 10;

for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let xSensor = Number(words[2].substring(2, words[2].length - 1));
  let ySensor = Number(words[3].substring(2, words[3].length - 1));
  let xBeacon = Number(words[8].substring(2, words[8].length - 1));
  let yBeacon = Number(words[9].substring(2));
  let dist = Math.abs(xBeacon - xSensor) + Math.abs(yBeacon - ySensor);
  sensors.push({ x: xSensor, y: ySensor, dist: dist });
  let xMin = xSensor - dist;
  let xMax = xSensor + dist;
  let yMin = ySensor - dist;
  let yMax = ySensor + dist;
  if (xMax > overallXMax) overallXMax = xMax;
  if (xMin < overallXMin) overallXMin = xMin;
  // for (let x = xMin; x <= xMax; x++) {
  //   if (!grid[x]) grid[x] = [];
  //   let yRangeDeduction = Math.abs(x - xSensor);
  //   for (let y = yMin + yRangeDeduction; y <= yMax - yRangeDeduction; y++) {
  //     grid[x][y] = true;
  //   }
  // }
}

let spots = 0;
for (let x = overallXMin; x <= overallXMax; x++) {
  let spotted = false;
  for (let sensor of sensors) {
    let currDist = Math.abs(sensor.x - x) + Math.abs(sensor.y - yToCheck);
    if (currDist <= sensor.dist) {
      console.log(x);
      spotted = true;
      break;
    }
  }
  if (spotted) spots++;
}
console.log(spots);
