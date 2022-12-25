const fs = require("fs");
let input = fs.readFileSync("./inputs/day22.txt").toString().split("\n");
// input = input.map((l) => l.trim());

const SIDE_LENGTH = 50;

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

function switchFace(row, col, direction) {
  // 1
  if (row == limitsPerCol[1].min && col < 50 && direction == "U") {
    return [50 + col, 50, "R"];
  }
  // 2
  if (
    col == limitsPerRow[51].min &&
    row >= 50 &&
    row < 100 &&
    direction == "L"
  ) {
    return [100, row - 50, "D"];
  }
  // 3
  if (col == limitsPerRow[51].min && row < 50 && direction == "L") {
    return [149 - row, 0, "R"];
  }
  // 4
  if (
    col == limitsPerRow[101].min &&
    row >= 100 &&
    row < 150 &&
    direction == "L"
  ) {
    return [149 - row, 50, "R"];
  }
  // 5
  if (
    row == limitsPerCol[51].min &&
    col >= 50 &&
    col < 100 &&
    direction == "U"
  ) {
    return [col + 100, 0, "R"];
  }
  // 6
  if (col == limitsPerRow[151].min && row >= 150 && direction == "L") {
    return [0, row - 100, "D"];
  }
  // 7
  if (row == limitsPerCol[101].min && col >= 100 && direction == "U") {
    return [limitsPerCol[1].max, col - 100, "U"];
  }
  // 8
  if (row == limitsPerCol[1].max && col < 50 && direction == "D") {
    return [limitsPerCol[101].min, col + 100, "D"];
  }
  // 9
  if (col == limitsPerRow[1].max && row < 50 && direction == "R") {
    return [149 - row, limitsPerRow[101].max, "L"];
  }
  // 10
  if (
    col == limitsPerRow[101].max &&
    row >= 100 &&
    row < 150 &&
    direction == "R"
  ) {
    return [149 - row, limitsPerRow[1].max, "L"];
  }
  // 11
  if (row == limitsPerCol[101].max && col >= 100 && direction == "D") {
    return [col - 50, limitsPerRow[51].max, "L"];
  }
  // 12
  if (
    col == limitsPerRow[51].max &&
    row >= 50 &&
    row < 100 &&
    direction == "R"
  ) {
    return [limitsPerCol[101].max, row + 50, "U"];
  }
  // 13
  if (
    row == limitsPerCol[51].max &&
    col >= 50 &&
    col < 100 &&
    direction == "D"
  ) {
    return [col + 100, limitsPerRow[151].max, "L"];
  }
  // 14
  if (col == limitsPerRow[151].max && row >= 150 && direction == "R") {
    return [limitsPerCol[51].max, row - 100, "U"];
  } else {
    console.log("switchFace func didn't match.");
    console.log(`row: ${row}, col: ${col}, dir: ${direction}`);
  }
}

// cmdLoop: for (let cmd of commands) {
//   if (cmd.type) {
//     if (cmd.direction) {
//       direction = cwRotationMap[direction];
//     } else {
//       direction = ccwRotationMap[direction];
//     }
//   } else {
//     // console.log(
//     //   `Row: ${row} Col: ${col} -- direction: ${direction} -- amount: ${cmd.amount} -- ${grid[row][col]}`
//     // );
//     switch (direction) {
//       case "R":
//         for (let i = 0; i < cmd.amount; i++) {
//           if (col == limitsPerRow[row].max) {
//             if (grid[row][limitsPerRow[row].min] == "#") {
//               continue cmdLoop;
//             }
//             col = limitsPerRow[row].min;
//           } else if (grid[row][col + 1] == "#") {
//             continue cmdLoop;
//           } else {
//             col += 1;
//           }
//         }

//         break;
//       case "D":
//         for (let i = 0; i < cmd.amount; i++) {
//           if (row == limitsPerCol[col].max) {
//             if (grid[limitsPerCol[col].min][col] == "#") {
//               continue cmdLoop;
//             }
//             row = limitsPerCol[col].min;
//           } else if (grid[row + 1][col] == "#") {
//             continue cmdLoop;
//           } else {
//             row += 1;
//           }
//         }
//         break;
//       case "L":
//         for (let i = 0; i < cmd.amount; i++) {
//           if (col == limitsPerRow[row].min) {
//             if (grid[row][limitsPerRow[row].max] == "#") {
//               continue cmdLoop;
//             }
//             col = limitsPerRow[row].max;
//           } else if (grid[row][col - 1] == "#") {
//             continue cmdLoop;
//           } else {
//             col -= 1;
//           }
//         }
//         break;
//       case "U":
//         for (let i = 0; i < cmd.amount; i++) {
//           if (row == limitsPerCol[col].min) {
//             if (grid[limitsPerCol[col].max][col] == "#") {
//               continue cmdLoop;
//             }
//             row = limitsPerCol[col].max;
//           } else if (grid[row - 1][col] == "#") {
//             continue cmdLoop;
//           } else {
//             row -= 1;
//           }
//         }
//     }
//   }
// }
let newGrid = JSON.parse(JSON.stringify(grid));
cmdLoop: for (let cmd of commands) {
  if (cmd.type) {
    if (cmd.direction) {
      direction = cwRotationMap[direction];
    } else {
      direction = ccwRotationMap[direction];
    }
  } else {
    for (let i = 0; i < cmd.amount; i++) {
      switch (direction) {
        case "R":
          if (col == limitsPerRow[row].max) {
            let [nR, nC, nD] = switchFace(row, col, direction);
            if (grid[nR][nC] == "#") {
              continue cmdLoop;
            }
            row = nR;
            col = nC;
            direction = nD;
          } else if (grid[row][col + 1] == "#") {
            continue cmdLoop;
          } else {
            col += 1;
          }
          newGrid[row][col] = ">";
          break;
        case "D":
          if (row == limitsPerCol[col].max) {
            let [nR, nC, nD] = switchFace(row, col, direction);
            if (grid[nR][nC] == "#") {
              continue cmdLoop;
            }
            row = nR;
            col = nC;
            direction = nD;
          } else if (grid[row + 1][col] == "#") {
            continue cmdLoop;
          } else {
            row += 1;
          }
          newGrid[row][col] = "v";
          break;
        case "L":
          if (col == limitsPerRow[row].min) {
            let [nR, nC, nD] = switchFace(row, col, direction);
            if (grid[nR][nC] == "#") {
              continue cmdLoop;
            }
            row = nR;
            col = nC;
            direction = nD;
          } else if (grid[row][col - 1] == "#") {
            continue cmdLoop;
          } else {
            col -= 1;
          }
          newGrid[row][col] = "<";
          break;
        case "U":
          if (row == limitsPerCol[col].min) {
            let [nR, nC, nD] = switchFace(row, col, direction);
            if (grid[nR][nC] == "#") {
              continue cmdLoop;
            }
            row = nR;
            col = nC;
            direction = nD;
          } else if (grid[row - 1][col] == "#") {
            continue cmdLoop;
          } else {
            row -= 1;
          }
          newGrid[row][col] = "^";
          break;
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
console.log(`Part 2: ${result1}`);
for (let i = 0; i < newGrid.length; i++) {
  let line = newGrid[i];
  let content = "";
  for (let c of line) {
    content += c;
  }
  // console.log(content);
}
// < 193054
// < 74214

//p2
// < 120326

// for (let r = 0; r < gridInput.length; r++) {
//   for (let c = limitsPerRow[r].min; c <= limitsPerRow[r].max; c++) {
//     let allTestCommands = [
//       [
//         { amount: 1 },
//         { type: 1, direction: 1 },
//         { type: 1, direction: 1 },
//         { amount: 1 },
//       ],
//       [
//         { type: 1, direction: 1 },
//         { amount: 1 },
//         { type: 1, direction: 1 },
//         { type: 1, direction: 1 },
//         { amount: 1 },
//       ],
//       [
//         { type: 1, direction: 1 },
//         { type: 1, direction: 1 },
//         { amount: 1 },
//         { type: 1, direction: 1 },
//         { type: 1, direction: 1 },
//         { amount: 1 },
//       ],
//       [
//         { type: 1, direction: 0 },
//         { amount: 1 },
//         { type: 1, direction: 1 },
//         { type: 1, direction: 1 },
//         { amount: 1 },
//       ],
//     ];
//     for (let commandsTest of allTestCommands) {
//       let row = r;
//       let col = c;
//       let direction = "R";

//       cmdLoopTest: for (let cmd of commandsTest) {
//         if (cmd.type) {
//           if (cmd.direction) {
//             direction = cwRotationMap[direction];
//           } else {
//             direction = ccwRotationMap[direction];
//           }
//         } else {
//           for (let i = 0; i < cmd.amount; i++) {
//             switch (direction) {
//               case "R":
//                 if (col == limitsPerRow[row].max) {
//                   let [nR, nC, nD] = switchFace(row, col, direction);
//                   if (grid[nR][nC] == "#") {
//                     continue cmdLoopTest;
//                   }
//                   row = nR;
//                   col = nC;
//                   direction = nD;
//                 } else if (grid[row][col + 1] == "#") {
//                   continue cmdLoopTest;
//                 } else {
//                   col += 1;
//                 }
//                 newGrid[row][col] = ">";
//                 break;
//               case "D":
//                 if (row == limitsPerCol[col].max) {
//                   let [nR, nC, nD] = switchFace(row, col, direction);
//                   if (grid[nR][nC] == "#") {
//                     continue cmdLoopTest;
//                   }
//                   row = nR;
//                   col = nC;
//                   direction = nD;
//                 } else if (grid[row + 1][col] == "#") {
//                   continue cmdLoopTest;
//                 } else {
//                   row += 1;
//                 }
//                 newGrid[row][col] = "v";
//                 break;
//               case "L":
//                 if (col == limitsPerRow[row].min) {
//                   let [nR, nC, nD] = switchFace(row, col, direction);
//                   if (grid[nR][nC] == "#") {
//                     continue cmdLoopTest;
//                   }
//                   row = nR;
//                   col = nC;
//                   direction = nD;
//                 } else if (grid[row][col - 1] == "#") {
//                   continue cmdLoopTest;
//                 } else {
//                   col -= 1;
//                 }
//                 newGrid[row][col] = "<";
//                 break;
//               case "U":
//                 if (row == limitsPerCol[col].min) {
//                   let [nR, nC, nD] = switchFace(row, col, direction);
//                   if (grid[nR][nC] == "#") {
//                     continue cmdLoopTest;
//                   }
//                   row = nR;
//                   col = nC;
//                   direction = nD;
//                 } else if (grid[row - 1][col] == "#") {
//                   continue cmdLoopTest;
//                 } else {
//                   row -= 1;
//                 }
//                 newGrid[row][col] = "^";
//                 break;
//             }
//           }
//         }
//       }
//       if (row != r || col != c) {
//         console.log(r, c);
//       }
//     }
//   }
// }
