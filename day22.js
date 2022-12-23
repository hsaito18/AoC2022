const fs = require("fs");
let input = fs.readFileSync("./inputs/day22.txt").toString().split("\n");
// input = input.map((l) => l.trim());

let grid = [];
let gridInput = [];
let path;
let gridLines = true;
for (let line of input) {
  if (line.length == 0) {
    gridLines = false;
    continue;
  }
  if (gridLines) {
    gridInput.push(line);
  } else {
    path = line;
  }
}

let limitsPerRow = [];
for (let line of gridInput) {
  let limits = {};
  let row = [];
  let mode = 0;
  for (let i = 0; i < line.length; i++) {
    let curr = line.charAt(i);
    row[i] = curr;
    if (!mode && (curr == "#" || curr == ".")) {
      mode = 1;
      limits["min"] = i;
    } else if (mode == 1 && curr == " ") {
      mode = 2;
      limits["max"] = i - 1;
    }
  }
  if (!mode) {
    console.log("what");
  }
  if (mode == 1) {
    limits["max"] = line.length - 1;
  }
  limitsPerRow.push(limits);
  grid.push(row);
}

let limitsPerCol = [];
for (let c = 0; c < gridInput[0].length; c++) {
  let limits = {};
  let mode = 0;
  for (let r = 0; r < gridInput.length; r++) {
    let curr = grid[r][c];
    if (!mode && (curr == "." || curr == "#")) {
      mode = 1;
      limits["min"] = r;
    } else if (mode == 1 && (curr == " " || curr == undefined)) {
      mode = 2;
      limits["max"] = r - 1;
    }
  }
  if (!mode) {
    console.log("col version of what");
  }
  if (mode == 1) {
    limits["max"] = gridInput.length - 1;
  }
  limitsPerCol.push(limits);
}

let commands = [];
// type 0 is move, type 1 is rotate.
// direction 1 is CW, direction 0 is CCW.
let numString = "";
for (let i = 0; i < path.length; i++) {
  if (path.charAt(i) == "R" || path.charAt(i) == "L") {
    commands.push({
      type: 0,
      amount: Number(numString),
    });
    commands.push({
      type: 1,
      direction: path.charAt(i) == "R" ? 1 : 0,
    });
    numString = "";
  } else if (!isNaN(path.charAt(i))) {
    numString += path.charAt(i);
  }
}
commands.push({
  type: 0,
  amount: Number(numString),
});

let row = 0;
let col;
for (let i = 0; i < grid[0].length; i++) {
  if (grid[0][i] == ".") {
    col = i;
    break;
  }
}

let direction = "R";
const cwRotationMap = {
  R: "D",
  D: "L",
  L: "U",
  U: "R",
};
const ccwRotationMap = {
  R: "U",
  U: "L",
  L: "D",
  D: "R",
};
cmdLoop: for (let cmd of commands) {
  if (cmd.type) {
    if (cmd.direction) {
      direction = cwRotationMap[direction];
    } else {
      direction = ccwRotationMap[direction];
    }
  } else {
    // console.log(
    //   `Row: ${row} Col: ${col} -- direction: ${direction} -- amount: ${cmd.amount} -- ${grid[row][col]}`
    // );
    switch (direction) {
      case "R":
        for (let i = 0; i < cmd.amount; i++) {
          if (col == limitsPerRow[row].max) {
            if (grid[row][limitsPerRow[row].min] == "#") {
              continue cmdLoop;
            }
            col = limitsPerRow[row].min;
          } else if (grid[row][col + 1] == "#") {
            continue cmdLoop;
          } else {
            col += 1;
          }
        }

        break;
      case "D":
        for (let i = 0; i < cmd.amount; i++) {
          if (row == limitsPerCol[col].max) {
            if (grid[limitsPerCol[col].min][col] == "#") {
              continue cmdLoop;
            }
            row = limitsPerCol[col].min;
          } else if (grid[row + 1][col] == "#") {
            continue cmdLoop;
          } else {
            row += 1;
          }
        }
        break;
      case "L":
        for (let i = 0; i < cmd.amount; i++) {
          if (col == limitsPerRow[row].min) {
            if (grid[row][limitsPerRow[row].max] == "#") {
              continue cmdLoop;
            }
            col = limitsPerRow[row].max;
          } else if (grid[row][col - 1] == "#") {
            continue cmdLoop;
          } else {
            col -= 1;
          }
        }
        break;
      case "U":
        for (let i = 0; i < cmd.amount; i++) {
          if (row == limitsPerCol[col].min) {
            if (grid[limitsPerCol[col].max][col] == "#") {
              continue cmdLoop;
            }
            row = limitsPerCol[col].max;
          } else if (grid[row - 1][col] == "#") {
            continue cmdLoop;
          } else {
            row -= 1;
          }
        }
    }
  }
}
let facing;
switch (direction) {
  case "R":
    facing = 0;
    break;
  case "D":
    facing = 1;
    break;
  case "L":
    facing = 2;
    break;
  case "U":
    facing = 3;
}
let result1 = (row + 1) * 1000 + (col + 1) * 4 + facing;
console.log(`Part 1: ${result1}`);
// < 193054
// < 74214
