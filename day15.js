const fs = require("fs");
let input = fs.readFileSync("./inputs/day15.txt").toString().split("\n");
input = input.map((l) => l.trim());

const Y_TO_CHECK = 2000000;
const MAX_COORDS_DISTRESS = 4000000;

let overallXMin = Infinity;
let overallXMax = -Infinity;
let sensors = [];
let beaconsOnY = [];

for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let xSensor = Number(words[2].substring(2, words[2].length - 1));
  let ySensor = Number(words[3].substring(2, words[3].length - 1));
  let xBeacon = Number(words[8].substring(2, words[8].length - 1));
  let yBeacon = Number(words[9].substring(2));
  if (yBeacon == Y_TO_CHECK) beaconsOnY.push(xBeacon);
  let dist = Math.abs(xBeacon - xSensor) + Math.abs(yBeacon - ySensor);
  sensors.push({ x: xSensor, y: ySensor, dist: dist });
  let xMin = xSensor - dist;
  let xMax = xSensor + dist;
  if (xMax > overallXMax) overallXMax = xMax;
  if (xMin < overallXMin) overallXMin = xMin;
}

let spots = 0;
for (let x = overallXMin; x <= overallXMax; x++) {
  if (beaconsOnY.includes(x)) continue;
  let spotted = false;
  for (let sensor of sensors) {
    let currDist = Math.abs(sensor.x - x) + Math.abs(sensor.y - Y_TO_CHECK);
    if (currDist <= sensor.dist) {
      spotted = true;
      break;
    }
  }
  if (spotted) spots++;
}

let result = spots;

let i = 0;
let edgePoints = [];
for (let sensor of sensors) {
  i++;
  // find all the edge points
  let y = sensor.y;
  for (let x = sensor.x + sensor.dist + 1; x >= sensor.x; x--) {
    edgePoints.push({ x: x, y: y });
    y++;
  }
  y = sensor.y + sensor.dist - 1;
  for (let x = sensor.x - 1; x >= sensor.x - sensor.dist; x--) {
    edgePoints.push({ x: x, y: y });
    y--;
  }
  y = sensor.y - 1;
  for (let x = sensor.x - sensor.dist + 1; x <= sensor.x; x++) {
    edgePoints.push({ x: x, y: y });
    y--;
  }
  y = sensor.y - sensor.dist + 1;
  for (let x = sensor.x + 1; x < sensor.x + sensor.dist; x++) {
    edgePoints.push({ x: x, y: y });
    y++;
  }
}

let trimmedEdgePoints = [];
for (let i = 0; i < edgePoints.length; i++) {
  let x = edgePoints[i].x;
  let y = edgePoints[i].y;
  if (x > MAX_COORDS_DISTRESS || x < 0 || y > MAX_COORDS_DISTRESS || y < 0) {
    //
  } else {
    trimmedEdgePoints.push({ x: x, y: y });
  }
}
let foundx;
let foundy;
for (let i = 0; i < trimmedEdgePoints.length; i++) {
  let found = true;
  for (let sensor of sensors) {
    let currDist =
      Math.abs(sensor.x - trimmedEdgePoints[i].x) +
      Math.abs(sensor.y - trimmedEdgePoints[i].y);
    if (currDist <= sensor.dist) {
      found = false;
      break;
    }
  }
  if (found) {
    foundx = trimmedEdgePoints[i].x;
    foundy = trimmedEdgePoints[i].y;
    break;
  }
}
let result2 = foundx * MAX_COORDS_DISTRESS + foundy;

console.log(`Part 1: ${result}`);
console.log(`Part 2: ${result2}`);
