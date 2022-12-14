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
      let maxY = Math.min(y0, y1);
      if (!grid[x0]) grid[x0] = [];
      for (let y = minY; y <= maxY; y++) {
        grid[x0][y] = true;
      }
    } else if (y0 == y1) {
      let minX = Math.min(x0, x1);
      let maxX = Math.min(x0, x1);
      for (let x = minX; x <= maxX; x++) {
        if (!grid[x]) grid[x] = [];
        grid[x][y0] = true;
      }
    }
  }
}
let maxYs = [];
for (let xi = 0; xi < grid.length; xi++) {
  if (!grid[xi]) maxYs[xi] = 0;
  maxYs[xi] = grid[xi].length - 1;
}
const source = { x: 500, y: 0 };

function simulateSand() {
  let x = source.x;
  let y = source.y;
  let done = false;
  let numSands = 0;
  while (!done) {
    if (y > maxYs[x]) {
      done = true;
      return numSands;
    }
    if (grid[x][y + 1]) {
      y++;
    } else if (!grid[x - 1]) {
      grid[x - 1] = [];
      x--;
      y++;
    } else if (grid[x - 1][y + 1]) {
      x--;
      y++;
    } else if (!grid[x + 1]) {
      grid[x + 1] = [];
      x++;
      y++;
    } else if (grid[x + 1][y + 1]) {
      x++;
      y++;
    } else {
      done = true;
    }
    numSands++;
  }
  grid[x][y] = true;
}
