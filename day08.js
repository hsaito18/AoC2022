const fs = require("fs");
let input = fs.readFileSync("./inputs/day8.txt").toString().split("\n");
input = input.map((l) => l.trim());

class Tree {
  constructor(height) {
    this.height = height;
    this.visible = false;
    this.treesSeenUp = 0;
    this.treesSeenDown = 0;
    this.treesSeenLeft = 0;
    this.treesSeenRight = 0;
  }
  tallestUp;
  tallestRight;
  tallestDown;
  tallestLeft;
  treesSeenUp;
  treesSeenRight;
  treesSeenDown;
  treesSeenLeft;
  height;
  visible;
  scenicScore;
}

let forest = [];
let numRows = 0;

for (let row = 0; row < input.length; row++) {
  let line = input[row];
  if (line.length == 0) continue;
  numRows++;
  forest[row] = [];
  for (let col = 0; col < line.length; col++) {
    let t = new Tree(Number(line.charAt(col)));
    forest[row][col] = t;
  }
}
//top sweep
for (let col = 0; col < input[0].length; col++) {
  forest[0][col].visible = true;
  forest[0][col].tallestUp = 0;
  forest[0][col].treesSeenUp = 0;
}
for (let row = 1; row < numRows; row++) {
  for (let col = 0; col < input[row].length; col++) {
    let t = forest[row][col];
    t.tallestUp = Math.max(
      forest[row - 1][col].height,
      forest[row - 1][col].tallestUp
    );
    if (t.height > t.tallestUp) {
      t.visible = true;
    }
    for (let arow = row - 1; arow >= 0; arow--) {
      t.treesSeenUp++;
      if (forest[arow][col].height >= t.height) {
        break;
      }
    }
  }
}

//right sweep
for (let row = 0; row < numRows; row++) {
  if (!forest[row][input[row].length - 1].visible) {
    forest[row][input[row].length - 1].visible = true;
  }
  forest[row][input[row].length - 1].tallestRight = 0;
}
for (let col = input[0].length - 2; col >= 0; col--) {
  for (let row = 0; row < numRows; row++) {
    let t = forest[row][col];
    t.tallestRight = Math.max(
      forest[row][col + 1].height,
      forest[row][col + 1].tallestRight
    );
    if (t.height > t.tallestRight && !t.visible) {
      t.visible = true;
    }
    for (let acol = col + 1; acol < input[row].length; acol++) {
      t.treesSeenRight++;
      if (forest[row][acol].height >= t.height) {
        break;
      }
    }
  }
}

//down sweep
for (let col = 0; col < input[0].length; col++) {
  forest[numRows - 1][col].visible = true;
  forest[numRows - 1][col].tallestDown = 0;
  if (!forest[numRows - 1][col].visible) {
  }
}
for (let row = numRows - 2; row >= 0; row--) {
  for (let col = 0; col < input[row].length; col++) {
    let t = forest[row][col];
    t.tallestDown = Math.max(
      forest[row + 1][col].height,
      forest[row + 1][col].tallestDown
    );
    if (t.height > t.tallestDown && !t.visible) {
      t.visible = true;
    }
    for (let arow = row + 1; arow < numRows; arow++) {
      t.treesSeenDown++;
      if (forest[arow][col].height >= t.height) {
        break;
      }
    }
  }
}

//left sweep
for (let row = 0; row < numRows; row++) {
  if (!forest[row][0].visible) {
    forest[row][0].visible = true;
  }
  forest[row][0].tallestLeft = 0;
}
for (let col = 1; col < input[0].length; col++) {
  for (let row = 0; row < numRows; row++) {
    let t = forest[row][col];
    t.tallestLeft = Math.max(
      forest[row][col - 1].height,
      forest[row][col - 1].tallestLeft
    );
    if (t.height > t.tallestLeft && !t.visible) {
      t.visible = true;
    }
    for (let acol = col - 1; acol >= 0; acol--) {
      t.treesSeenLeft++;
      if (forest[row][acol].height >= t.height) {
        break;
      }
    }
  }
}
let totalVisible = 0;
let highestScenicScore = 0;
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < input[row].length; col++) {
    let t = forest[row][col];
    if (t.visible) totalVisible++;
    t.scenicScore =
      t.treesSeenUp * t.treesSeenRight * t.treesSeenDown * t.treesSeenLeft;
    if (t.scenicScore > highestScenicScore) {
      highestScenicScore = t.scenicScore;
    }
  }
}

console.log(`Part 1: ${totalVisible}`);
console.log(`Part 2: ${highestScenicScore}`);
