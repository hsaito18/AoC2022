const fs = require("fs");
let input = fs.readFileSync("./inputs/day18.txt").toString().split("\n");
input = input.map((l) => l.trim());

let lavaDrop = [];
let points = [];
let [maxX, maxY, maxZ] = [0, 0, 0];
for (let line of input) {
  if (line.length == 0) continue;
  let [x, y, z] = line.split(",");
  if (Number(x) > maxX) maxX = x;
  if (Number(y) > maxY) maxY = y;
  if (Number(z) > maxZ) maxZ = z;
  if (!lavaDrop[x]) lavaDrop[x] = [];
  if (!lavaDrop[x][y]) lavaDrop[x][y] = [];
  lavaDrop[x][y][z] = true;
  points.push({ x: x, y: y, z: z });
}

let result1 = 0;

for (let pt of points) {
  let x = Number(pt.x);
  let y = Number(pt.y);
  let z = Number(pt.z);
  let negativeCounter = 0;
  try {
    if (lavaDrop[x + 1][y][z]) {
      negativeCounter++;
    }
  } catch {}
  try {
    if (lavaDrop[x - 1][y][z]) {
      negativeCounter++;
    }
  } catch {}
  try {
    if (lavaDrop[x][y + 1][z]) {
      negativeCounter++;
    }
  } catch {}
  try {
    if (lavaDrop[x][y - 1][z]) {
      negativeCounter++;
    }
  } catch {}
  try {
    if (lavaDrop[x][y][z + 1]) {
      negativeCounter++;
    }
  } catch {}
  try {
    if (lavaDrop[x][y][z - 1]) {
      negativeCounter++;
    }
  } catch {}
  result1 += 6 - negativeCounter;
}

class Point {
  constructor(isAir, x, y, z) {
    this.isAir = isAir;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  getNeighbours() {
    let neighbours = [];
    if (space[this.x + 1]) {
      neighbours.push(space[this.x + 1][this.y][this.z]);
    }
    if (space[this.x - 1]) {
      neighbours.push(space[this.x - 1][this.y][this.z]);
    }
    if (space[this.x][this.y - 1]) {
      neighbours.push(space[this.x][this.y - 1][this.z]);
    }
    if (space[this.x][this.y + 1]) {
      neighbours.push(space[this.x][this.y + 1][this.z]);
    }
    if (space[this.x][this.y][this.z + 1]) {
      neighbours.push(space[this.x][this.y][this.z + 1]);
    }
    if (space[this.x][this.y][this.z - 1]) {
      neighbours.push(space[this.x][this.y][this.z - 1]);
    }
    return neighbours;
  }
}

space = {};
for (let x = -1; x <= maxX + 1; x++) {
  space[x] = {};
  for (let y = -1; y <= maxY + 1; y++) {
    space[x][y] = {};
    for (let z = -1; z <= maxZ + 1; z++) {
      let air = true;
      let p = new Point(air, x, y, z);
      space[x][y][z] = p;
    }
  }
}
for (let pt of points) {
  space[Number(pt.x)][Number(pt.y)][Number(pt.z)].isAir = false;
}
let outsideAirs = new Set();
outsideAirs.add(space[-1][-1][-1]);

for (let x = -1; x <= maxX + 1; x++) {
  for (let y = -1; y <= maxY + 1; y++) {
    for (let z = -1; z <= maxZ + 1; z++) {
      let isOutside = canSeeOutside(x, y, z);
      if (isOutside) {
        outsideAirs.add(space[x][y][z]);
      }
    }
  }
}

function canSeeOutside(x, y, z) {
  let pt = space[x][y][z];
  if (!pt.isAir) return false;
  if (outsideAirs.has(pt)) return true;
  let queue = [];
  if (!space[x]) return true;
  if (!space[x][y]) return true;
  if (!space[x][y][z]) return true;
  let neighbours = pt.getNeighbours();
  let checksDone = 0;
  for (let n of neighbours) {
    queue.push(n);
  }
  while (queue.length !== 0) {
    let curr = queue.shift();
    if (outsideAirs.has(curr)) {
      return true;
    }
    if (curr.isAir) {
      let currNeighbours = curr.getNeighbours();
      for (let n of currNeighbours) {
        queue.push(n);
      }
    }
    checksDone++;
    if (checksDone > 10) {
      return false;
    }
  }
  return false;
}
for (let i = 0; i < 3; i++) {
  for (let x = -1; x <= maxX + 1; x++) {
    for (let y = -1; y <= maxY + 1; y++) {
      for (let z = -1; z <= maxZ + 1; z++) {
        let isOutside = canSeeOutside(x, y, z);
        if (isOutside) {
          outsideAirs.add(space[x][y][z]);
        }
      }
    }
  }
}
let result2 = 0;
for (let x = 0; x <= maxX; x++) {
  for (let y = 0; y <= maxY; y++) {
    for (let z = 0; z <= maxZ; z++) {
      let curr = space[x][y][z];
      if (!curr.isAir) {
        let neighbours = curr.getNeighbours();
        for (let p of neighbours) {
          if (outsideAirs.has(p)) {
            result2++;
          }
        }
      }
    }
  }
}
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
