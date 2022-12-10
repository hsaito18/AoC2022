const fs = require("fs");
let input = fs.readFileSync("./inputs/day9.txt").toString().split("\n");
input = input.map((l) => l.trim());

const NUM_TAILS = 9;

let seenSquares = {
  0: {
    0: true,
  },
};
let seenSquares2 = JSON.parse(JSON.stringify(seenSquares));
let squareCounter = 1;
let squareCounter2 = 1;
let head = { row: 0, col: 0 };
let tail = { row: 0, col: 0 };

let tails = [];
for (let i = 0; i < NUM_TAILS; i++) {
  tails.push({ row: 0, col: 0 });
}

function moveTail(tail, rowdiff, coldiff, tailNum = -1) {
  tail.row = tail.row + rowdiff;
  tail.col = tail.col + coldiff;

  if (tailNum == -1) {
    if (seenSquares[tail.row]) {
      if (seenSquares[tail.row][tail.col]) {
        return;
      } else {
        seenSquares[tail.row][tail.col] = true;
      }
    } else {
      seenSquares[tail.row] = {};
      seenSquares[tail.row][tail.col] = true;
    }
    squareCounter++;
  }
  if (tailNum == NUM_TAILS - 1) {
    if (seenSquares2[tail.row]) {
      if (seenSquares2[tail.row][tail.col]) {
        return;
      } else {
        seenSquares2[tail.row][tail.col] = true;
      }
    } else {
      seenSquares2[tail.row] = {};
      seenSquares2[tail.row][tail.col] = true;
    }
    squareCounter2++;
  }
}

for (let line of input) {
  if (line.length == 0) continue;
  let direction = line.charAt(0);
  let steps = Number(line.substring(2));
  for (let i = 0; i < steps; i++) {
    switch (direction) {
      case "U":
        head.row = head.row - 1;
        break;
      case "R":
        head.col = head.col + 1;
        break;
      case "D":
        head.row = head.row + 1;
        break;
      case "L":
        head.col = head.col - 1;
        break;
      default:
        break;
    }

    for (let tailIdx = 0; tailIdx < NUM_TAILS; tailIdx++) {
      let rowDiff;
      let colDiff;
      if (tailIdx == 0) {
        rowDiff = head.row - tails[0].row;
        colDiff = head.col - tails[0].col;
      } else {
        rowDiff = tails[tailIdx - 1].row - tails[tailIdx].row;
        colDiff = tails[tailIdx - 1].col - tails[tailIdx].col;
      }
      if (rowDiff == -2) {
        if (colDiff == -1 || colDiff == -2) {
          moveTail(tails[tailIdx], -1, -1, tailIdx);
        } else if (colDiff == 0) {
          moveTail(tails[tailIdx], -1, 0, tailIdx);
        } else if (colDiff == 1 || colDiff == 2) {
          moveTail(tails[tailIdx], -1, 1, tailIdx);
        }
      } else if (colDiff == 2) {
        if (rowDiff == -1 || rowDiff == -2) {
          moveTail(tails[tailIdx], -1, 1, tailIdx);
        } else if (rowDiff == 0) {
          moveTail(tails[tailIdx], 0, 1, tailIdx);
        } else if (rowDiff == 1 || rowDiff == 2) {
          moveTail(tails[tailIdx], 1, 1, tailIdx);
        }
      } else if (rowDiff == 2) {
        if (colDiff == -1 || colDiff == -2) {
          moveTail(tails[tailIdx], 1, -1, tailIdx);
        } else if (colDiff == 0) {
          moveTail(tails[tailIdx], 1, 0, tailIdx);
        } else if (colDiff == 1 || colDiff == 2) {
          moveTail(tails[tailIdx], 1, 1, tailIdx);
        }
      } else if (colDiff == -2) {
        if (rowDiff == -1 || rowDiff == -2) {
          moveTail(tails[tailIdx], -1, -1, tailIdx);
        } else if (rowDiff == 0) {
          moveTail(tails[tailIdx], 0, -1, tailIdx);
        } else if (rowDiff == 1 || rowDiff == 2) {
          moveTail(tails[tailIdx], 1, -1, tailIdx);
        }
      }
    }
    let rowDiff = head.row - tail.row;
    let colDiff = head.col - tail.col;
    if (rowDiff == -2) {
      if (colDiff == -1) {
        moveTail(tail, -1, -1);
      } else if (colDiff == 0) {
        moveTail(tail, -1, 0);
      } else if (colDiff == 1) {
        moveTail(tail, -1, 1);
      }
    } else if (colDiff == 2) {
      if (rowDiff == -1) {
        moveTail(tail, -1, 1);
      } else if (rowDiff == 0) {
        moveTail(tail, 0, 1);
      } else if (rowDiff == 1) {
        moveTail(tail, 1, 1);
      }
    } else if (rowDiff == 2) {
      if (colDiff == -1) {
        moveTail(tail, 1, -1);
      } else if (colDiff == 0) {
        moveTail(tail, 1, 0);
      } else if (colDiff == 1) {
        moveTail(tail, 1, 1);
      }
    } else if (colDiff == -2) {
      if (rowDiff == -1) {
        moveTail(tail, -1, -1);
      } else if (rowDiff == 0) {
        moveTail(tail, 0, -1);
      } else if (rowDiff == 1) {
        moveTail(tail, 1, -1);
      }
    }
  }
}

console.log(`Part 1: ${squareCounter}`);
console.log(`Part 2: ${squareCounter2}`);
