const fs = require("fs");
let input = fs.readFileSync("./inputs/day14.txt").toString().split("\n");
input = input.map((l) => l.trim());

let grid = [];

for (let line of input) {
  if (line.length == 0) continue;
  let corners = line.split(" -> ");
  for (let i = 0; i < corners.length - 1; i++) {
    let [x0, y0] = corners[i].split(",");
    let [x1, y1] = corners[i + 1].split(",");
    if (x0 == x1) {
      let minY = Math.min(y0, y1);
      let maxY = Math.max(y0, y1);
      if (!grid[x0]) grid[x0] = [];
      for (let y = minY; y <= maxY; y++) {
        grid[x0][y] = true;
      }
    } else if (y0 == y1) {
      let minX = Math.min(x0, x1);
      let maxX = Math.max(x0, x1);
      for (let x = minX; x <= maxX; x++) {
        if (!grid[x]) grid[x] = [];
        grid[x][y0] = true;
      }
    }
  }
}
let maxYs = [];
let maxYOverall = 0;
for (let xi = 0; xi < grid.length; xi++) {
  if (!grid[xi]) {
    maxYs[xi] = 0;
  } else {
    maxYs[xi] = grid[xi].length - 1;
    if (maxYs[xi] > maxYOverall) maxYOverall = maxYs[xi];
  }
}
const source = { x: 500, y: 0 };

function simulateSand() {
  let x = source.x;
  let y = source.y;
  while (true) {
    if (y > maxYs[x]) {
      return false;
    }
    if (!grid[x][y + 1]) {
      y++;
    } else if (!grid[x - 1]) {
      return false;
    } else if (!grid[x - 1][y + 1]) {
      x--;
      y++;
    } else if (!grid[x + 1]) {
      return false;
    } else if (!grid[x + 1][y + 1]) {
      x++;
      y++;
    } else {
      grid[x][y] = true;
      return true;
    }
  }
}

function simulateSandWithFloor() {
  let x = source.x;
  let y = source.y;
  if (grid[x][y]) return false;
  while (true) {
    if (y == maxYOverall + 1) {
      grid[x][y] = true;
      return true;
    }
    if (!grid[x][y + 1]) {
      y++;
    } else if (!grid[x - 1]) {
      grid[x - 1] = [];
      x--;
      y++;
    } else if (!grid[x - 1][y + 1]) {
      x--;
      y++;
    } else if (!grid[x + 1]) {
      grid[x + 1] = [];
      x++;
      y++;
    } else if (!grid[x + 1][y + 1]) {
      x++;
      y++;
    } else {
      grid[x][y] = true;
      return true;
    }
  }
}

let numSands = 0;
let finished = false;
let grid2 = JSON.parse(JSON.stringify(grid));
while (!finished) {
  if (simulateSand()) {
    numSands++;
  } else {
    finished = true;
  }
}

let numSands2 = 0;
let finished2 = false;
grid = grid2;

while (!finished2) {
  if (simulateSandWithFloor()) {
    numSands2++;
  } else {
    finished2 = true;
  }
}

let result1 = numSands;
let result2 = numSands2;

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
