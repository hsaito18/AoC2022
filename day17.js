const fs = require("fs");
let input = fs.readFileSync("./inputs/day17.txt").toString().split("\n");
input = input.map((l) => l.trim());

const NUMBER_OF_ROCKS = 2022;
const FULL_NUMBER_OF_ROCKS = 1000000000000;
const CHAMBER_WIDTH = 7;
const jet = input[0];

class Rock {
  /*
  / type 0: ####
  /
  /         .#.
  / type 1: ###
  /         .#.
  /
  /         ..#
  / type 2: ..#         
  /         ###
  /
  /         #
  / type 3: #
  /         #
  /         #
  /
  / type 4: ##
  /         ##
  */
  constructor(startingHeight, type) {
    switch (type) {
      case 0:
        this.points = [
          { x: 3, y: startingHeight },
          { x: 4, y: startingHeight },
          { x: 5, y: startingHeight },
          { x: 6, y: startingHeight },
        ];
        break;
      case 1:
        this.points = [
          { x: 4, y: startingHeight + 2 },
          { x: 3, y: startingHeight + 1 },
          { x: 5, y: startingHeight + 1 },
          { x: 4, y: startingHeight },
        ];
        break;
      case 2:
        this.points = [
          { x: 5, y: startingHeight + 2 },
          { x: 5, y: startingHeight + 1 },
          { x: 3, y: startingHeight },
          { x: 4, y: startingHeight },
          { x: 5, y: startingHeight },
        ];
        break;
      case 3:
        this.points = [
          { x: 3, y: startingHeight + 3 },
          { x: 3, y: startingHeight + 2 },
          { x: 3, y: startingHeight + 1 },
          { x: 3, y: startingHeight },
        ];
        break;
      case 4:
        this.points = [
          { x: 3, y: startingHeight + 1 },
          { x: 4, y: startingHeight + 1 },
          { x: 3, y: startingHeight },
          { x: 4, y: startingHeight },
        ];
        break;
    }
  }

  moveRight(grid) {
    for (let pt of this.points) {
      if (pt.x == CHAMBER_WIDTH) return false;
      if (!grid[pt.y]) {
        grid[pt.y] = [];
        continue;
      }
      if (grid[pt.y][pt.x + 1]) return false;
    }
    for (let pt of this.points) {
      pt.x = pt.x + 1;
    }
    return true;
  }

  moveDown(grid) {
    let frozen = false;
    for (let pt of this.points) {
      if (pt.y == 1) {
        frozen = true;
        break;
      }
      if (!grid[pt.y]) {
        grid[pt.y] = [];
        continue;
      }
      if (!grid[pt.y - 1]) {
        grid[pt.y - 1] = [];
        continue;
      }
      if (grid[pt.y - 1][pt.x]) {
        frozen = true;
        break;
      }
    }
    if (frozen) {
      let maxY = 0;
      for (let pt of this.points) {
        grid[pt.y][pt.x] = true;
        if (pt.y > maxY) {
          maxY = pt.y;
        }
      }
      return maxY;
    } else {
      for (let pt of this.points) {
        pt.y = pt.y - 1;
      }
      return false;
    }
  }

  moveLeft(grid) {
    for (let pt of this.points) {
      if (pt.x == 1) return false;
      if (!grid[pt.y]) {
        grid[pt.y] = [];
        continue;
      }
      if (grid[pt.y][pt.x - 1]) return false;
    }
    for (let pt of this.points) {
      pt.x = pt.x - 1;
    }
    return true;
  }
}

function runSim(numRocks, grid, jetCounter = 0, currHeight = 0) {
  // grid[0] is floor.
  // grid[row][0] is left wall, grid[row][8] is right wall.
  // let jetCounter = 0;
  // let currHeight = 0;
  for (let i = 0; i < numRocks; i++) {
    let type = i % 5;
    let currRock = new Rock(currHeight + 4, type);
    let done = false;
    while (!done) {
      let jetCommand = jet[jetCounter];
      jetCounter++;
      if (jetCounter == jet.length) {
        jetCounter = 0;
      }
      if (jetCommand == ">") {
        currRock.moveRight(grid);
      } else if (jetCommand == "<") {
        currRock.moveLeft(grid);
      } else {
        console.log(`invalid jet command: ${jetCommand}`);
      }
      let maxHeight = currRock.moveDown(grid);
      if (maxHeight) {
        done = true;
        if (maxHeight > currHeight) {
          currHeight = maxHeight;
        }
      }
    }
  }
  return currHeight;
}
let grid = [];
currHeight = runSim(NUMBER_OF_ROCKS, grid);

function getFinalDepths(grid, currHeight) {
  let finalDepths = [];
  for (let x = 1; x < 8; x++) {
    for (let row = currHeight; row >= 0; row--) {
      if (grid[row] && grid[row][x]) {
        finalDepths[x] = currHeight - row;
        break;
      }
    }
  }
  return finalDepths;
}

function equalState(finDeps1, finDeps2) {
  for (let i = 1; i < finDeps1.length; i++) {
    if (finDeps1[i] != finDeps2[i]) return false;
  }
  return true;
}

function getCycleNumber() {
  let hashes = [];
  let jetCounter = 0;
  let currHeight = 0;
  let grid = [];
  let numRocks = 5000;
  for (let i = 0; i < numRocks; i++) {
    let type = i % 5;
    let currRock = new Rock(currHeight + 4, type);
    let done = false;
    while (!done) {
      let jetCommand = jet[jetCounter];
      jetCounter++;
      if (jetCounter == jet.length) {
        jetCounter = 0;
      }
      if (jetCommand == ">") {
        currRock.moveRight(grid);
      } else if (jetCommand == "<") {
        currRock.moveLeft(grid);
      } else {
        console.log(`invalid jet command: ${jetCommand}`);
      }
      let maxHeight = currRock.moveDown(grid);
      if (maxHeight) {
        done = true;
        if (maxHeight > currHeight) {
          currHeight = maxHeight;
        }
      }
    }
    hashes[i] = hashState(getFinalDepths(grid, currHeight), jetCounter, type);
  }
  let hashSet = new Set();
  for (let i = 4; i < hashes.length; i++) {
    if (hashSet.has(hashes[i])) {
      return [hashes.indexOf(hashes[i]), i - hashes.indexOf(hashes[i])];
    }
    hashSet.add(hashes[i]);
  }
  return null;
}

function hashState(depths, jetIndex, lastShape) {
  let depthsHash = "";
  for (let i = 1; i < depths.length; i++) {
    depthsHash += depths[i];
  }
  return Number(depthsHash + (jetIndex * 10 + lastShape));
}
let [cycleOffset, cycleNum] = getCycleNumber();
let offsetGrid = [];
let firstCycleGrid = [];
let secondCycleGrid = [];
let secondCyclePlusLeftOverGrid = [];

let offsetHeight = runSim(cycleOffset, offsetGrid);
let firstCycleHeight = runSim(cycleNum + cycleOffset, firstCycleGrid);
let secondCycleHeight = runSim(cycleNum * 2 + cycleOffset, secondCycleGrid);

let heightPerCycle = secondCycleHeight - firstCycleHeight;
let finalRocksAfterOffset = FULL_NUMBER_OF_ROCKS - cycleOffset;
let numCycles = Math.floor(finalRocksAfterOffset / cycleNum);
let leftOver = finalRocksAfterOffset % cycleNum;

let secondCyclePlusLeftOverHeight = runSim(
  cycleNum * 2 + cycleOffset + leftOver,
  secondCyclePlusLeftOverGrid
);
let leftOverHeight = secondCyclePlusLeftOverHeight - secondCycleHeight;
let result2 = offsetHeight + numCycles * heightPerCycle + leftOverHeight;
let grid1 = [];
let result1 = runSim(NUMBER_OF_ROCKS, grid1);
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
