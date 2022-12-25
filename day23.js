const fs = require("fs");
let input = fs.readFileSync("./inputs/day23.txt").toString().split("\n");
input = input.map((l) => l.trim());

const priorities = [
  ["N", "S", "W", "E"],
  ["S", "W", "E", "N"],
  ["W", "E", "N", "S"],
  ["E", "N", "S", "W"],
];

function hashCoords(x, y) {
  return `${x},${y}`;
}

function unHashCoords(hash) {
  let [x, y] = hash.split(",");
  return [x, y];
}

function calcScore(elves, positions) {
  let score = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let e of Object.values(elves)) {
    if (e.x < minX) {
      minX = e.x;
    }
    if (e.x > maxX) {
      maxX = e.x;
    }
    if (e.y < minY) {
      minY = e.y;
    }
    if (e.y > maxY) {
      maxY = e.y;
    }
  }
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      let currHash = hashCoords(x, y);
      if (!positions.has(currHash)) {
        score++;
      }
    }
  }
  return score;
}

class Elf {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.considering = 0;
  }

  consider(roundNum, positions) {
    this.considering = 0;
    let [NW, N, NE, W, E, SW, S, SE] = [
      hashCoords(this.x - 1, this.y - 1),
      hashCoords(this.x, this.y - 1),
      hashCoords(this.x + 1, this.y - 1),
      hashCoords(this.x - 1, this.y),
      hashCoords(this.x + 1, this.y),
      hashCoords(this.x - 1, this.y + 1),
      hashCoords(this.x, this.y + 1),
      hashCoords(this.x + 1, this.y + 1),
    ];

    let done = true;
    for (let dir of [NW, N, NE, W, E, SW, S, SE]) {
      if (positions.has(dir)) done = false;
    }
    if (done) {
      return null;
    }
    let priority = priorities[roundNum % 4];
    for (let dir of priority) {
      switch (dir) {
        case "N":
          if (!positions.has(NW) && !positions.has(N) && !positions.has(NE)) {
            this.considering = N;
            return N;
          }
          break;
        case "S":
          if (!positions.has(SW) && !positions.has(S) && !positions.has(SE)) {
            this.considering = S;
            return S;
          }
          break;
        case "W":
          if (!positions.has(NW) && !positions.has(W) && !positions.has(SW)) {
            this.considering = W;
            return W;
          }
          break;
        case "E":
          if (!positions.has(NE) && !positions.has(E) && !positions.has(SE)) {
            this.considering = E;
            return E;
          }
          break;
      }
    }
  }
}

let elves = {};
let positions = new Set();
let idCounter = 0;
for (let i = 0; i < input.length; i++) {
  let line = input[i];
  if (line.length == 0) continue;
  for (let j = 0; j < line.length; j++) {
    if (line.charAt(j) == "#") {
      let elf = new Elf(j, i, idCounter);
      elves[idCounter] = elf;
      let posHash = hashCoords(j, i);
      positions.add(posHash);
      idCounter++;
    }
  }
}

let roundNum = 0;
let allElvesDone = false;
let result1;

while (!allElvesDone) {
  // first half
  if (roundNum == 10) {
    result1 = calcScore(elves, positions);
  }
  allElvesDone = true;
  let consideredPositions = {};
  for (let e of Object.values(elves)) {
    let considerPos = e.consider(roundNum, positions);
    if (considerPos !== null) {
      allElvesDone = false;
      if (consideredPositions[considerPos]) {
        consideredPositions[considerPos].overlap = true;
      } else {
        consideredPositions[considerPos] = { overlap: false };
      }
    }
  }

  // second half
  positions = new Set();
  for (let e of Object.values(elves)) {
    if (e.considering && !consideredPositions[e.considering].overlap) {
      let [nX, nY] = unHashCoords(e.considering);
      e.x = Number(nX);
      e.y = Number(nY);
      positions.add(e.considering);
    } else {
      positions.add(hashCoords(e.x, e.y));
    }
  }
  roundNum++;
}

let result2 = roundNum;

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
