const fs = require("fs");
let input = fs.readFileSync("./inputs/day12.txt").toString().split("\n");
input = input.map((l) => l.trim());
// https://en.wikipedia.org/wiki/A*_search_algorithm
// https://www.npmjs.com/package/js-priority-queue
let grid = [];
let goalPos = [];
let startPos = [];
for (let i = 0; i < input.length; i++) {
  if (input[i].length == 0) continue;
  grid[i] = [];
  for (let j = 0; j < input[i].length; j++) {
    let currChar = input[i].charAt(j);
    grid[i][j] = currChar;
    if (currChar == "E") {
      goalPos = [i, j];
      // grid[i][j] = 122 - 97;
      grid[i][j] = 1;
    } else if (currChar == "S") {
      startPos = [i, j];
      grid[i][j] = 0;
    } else {
      grid[i][j] = currChar.charCodeAt() - 97;
    }
  }
}

let numRows = input.length;
let numCols = input[0].length;
let savedPaths = [];
for (let i = 0; i < numRows; i++) {
  savedPaths[i] = [];
}

function shortestPathTo(row, col) {
  paths = [];
  if (row == startPos[0] && col == startPos[1]) {
    console.log("reached start.");
    return 0;
  }
  if (row !== 0 && grid[row][col] - grid[row - 1][col] <= 1) {
    if (savedPaths[row - 1][col]) {
      paths.push(savedPaths[row - 1][col]);
    } else {
      let sp = shortestPathTo(row - 1, col);
      paths.push(sp);
      savedPaths[row - 1][col] = sp;
    }
  }
  if (col !== numCols - 1 && grid[row][col] - grid[row][col + 1] <= 1) {
    if (savedPaths[row][col + 1]) {
      paths.push(savedPaths[row][col + 1]);
    } else {
      let sp = shortestPathTo(row, col + 1);
      paths.push(sp);
      savedPaths[row][col + 1] = sp;
    }
  }
  if (row !== numRows - 1 && grid[row][col] - grid[row + 1][col] <= 1) {
    if (savedPaths[row + 1][col]) {
      paths.push(savedPaths[row + 1][col]);
    } else {
      let sp = shortestPathTo(row + 1, col);
      paths.push(sp);
      savedPaths[row + 1][col] = sp;
    }
  }
  if (col !== 0 && grid[row][col] - grid[row][col - 1] <= 1) {
    if (savedPaths[row][col + 1]) {
      paths.push(savedPaths[row][col + 1]);
    } else {
      let sp = shortestPathTo(row, col + 1);
      paths.push(sp);
      savedPaths[row][col + 1] = sp;
    }
  }
  return Math.min(paths) + 1;
}

function shortestPathFrom(row, col) {
  paths = [];
  if (row == goalPos[0] && col == goalPos[1]) {
    console.log("reached end.");
    return 0;
  }
  if (row !== 0 && grid[row][col] - grid[row - 1][col] <= 1) {
    if (savedPaths[row - 1][col]) {
      paths.push(savedPaths[row - 1][col]);
    } else {
      let sp = shortestPathFrom(row - 1, col);
      paths.push(sp);
      savedPaths[row - 1][col] = sp;
    }
  }
  if (col !== numCols - 1 && grid[row][col] - grid[row][col + 1] <= 1) {
    if (savedPaths[row][col + 1]) {
      paths.push(savedPaths[row][col + 1]);
    } else {
      let sp = shortestPathFrom(row, col + 1);
      paths.push(sp);
      savedPaths[row][col + 1] = sp;
    }
  }
  if (row !== numRows - 1 && grid[row][col] - grid[row + 1][col] <= 1) {
    if (savedPaths[row + 1][col]) {
      paths.push(savedPaths[row + 1][col]);
    } else {
      let sp = shortestPathFrom(row + 1, col);
      paths.push(sp);
      savedPaths[row + 1][col] = sp;
    }
  }
  if (col !== 0 && grid[row][col] - grid[row][col - 1] <= 1) {
    if (savedPaths[row][col + 1]) {
      paths.push(savedPaths[row][col + 1]);
    } else {
      let sp = shortestPathFrom(row, col + 1);
      paths.push(sp);
      savedPaths[row][col + 1] = sp;
    }
  }
  console.log("actually returning lol");
  return Math.min(paths) + 1;
}
console.log(goalPos);

try {
  console.log(shortestPathFrom(startPos[0], startPos[1]));
} catch (e) {
  console.log(savedPaths);
}
