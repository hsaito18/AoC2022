const fs = require("fs");
let input = fs.readFileSync("./inputs/day24.txt").toString().split("\n");
input = input.map((l) => l.trim());
const math = require("mathjs");

class Blizzard {
  constructor(row, col, dir) {
    this.row = row;
    this.col = col;
    this.dir = dir;
  }
  move() {
    switch (this.dir) {
      case ">":
        if (this.col == WIDTH - 2) {
          this.col = 1;
        } else {
          this.col += 1;
        }
        break;
      case "v":
        if (this.row == HEIGHT - 2) {
          this.row = 1;
        } else {
          this.row += 1;
        }
        break;
      case "<":
        if (this.col == 1) {
          this.col = WIDTH - 2;
        } else {
          this.col -= 1;
        }
        break;
      case "^":
        if (this.row == 1) {
          this.row = HEIGHT - 2;
        } else {
          this.row -= 1;
        }
        break;
    }
  }
  getPosString() {
    return `${this.row},${this.col}`;
  }
}

let grid = [];
let blizzards = [];
let positions = new Set();
for (let r = 0; r < input.length; r++) {
  let line = input[r];
  if (line.length == 0) continue;
  let row = [];
  for (let c = 0; c < line.length; c++) {
    let char = line.charAt(c);
    if (char == ">" || char == "v" || char == "<" || char == "^") {
      let b = new Blizzard(r, c, char);
      positions.add(b.getPosString());
      blizzards.push(b);
    }
    row.push(char);
  }
  grid.push(row);
}
const HEIGHT = grid.length;
const WIDTH = grid[0].length;
const IN_HEIGHT = HEIGHT - 2;
const IN_WIDTH = WIDTH - 2;
const LCM = math.lcm(IN_HEIGHT, IN_WIDTH);
const GOAL_ROW = IN_HEIGHT;
const GOAL_COL = IN_WIDTH;
let states = [];
states[0] = structuredClone(positions);
for (let i = 1; i < LCM; i++) {
  positions = new Set();
  for (let b of blizzards) {
    b.move();
    positions.add(b.getPosString());
  }
  let curr = structuredClone(positions);
  states[i] = curr;
}
let result1;
let known = new Map();
known.set(`0,1,0`, 0);
let queue = [];
queue.push("0,1,0");
while (queue.length !== 0) {
  let curr = queue.shift();
  let [row, col, round] = curr.split(",").map((a) => Number(a));
  let stateNum = (round + 1) % LCM;
  if (row == GOAL_ROW && col == GOAL_COL) {
    result1 = round + 1;
    break;
  }
  if (states[round % LCM].has(`${row},${col}`)) {
    console.log(`${row},${col},${round}`);
  }
  if (
    row > 1 &&
    !states[stateNum].has(`${row - 1},${col}`) &&
    !known.has(`${row - 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row - 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row - 1},${col},${round + 1}`);
  }
  if (
    row < HEIGHT - 2 &&
    !states[stateNum].has(`${row + 1},${col}`) &&
    !known.has(`${row + 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row + 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row + 1},${col},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col > 1 &&
    !states[stateNum].has(`${row},${col - 1}`) &&
    !known.has(`${row},${col - 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col - 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col - 1},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col < WIDTH - 2 &&
    !states[stateNum].has(`${row},${col + 1}`) &&
    !known.has(`${row},${col + 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col + 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col + 1},${round + 1}`);
  }
  if (
    !states[stateNum].has(`${row},${col}`) &&
    !known.has(`${row},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col},${round + 1}`);
  }
}
let currRound = result1;
let backToStartRound;
known = new Map();
known.set(`${GOAL_ROW + 1},${GOAL_COL},${currRound}`, currRound);
queue = [];
queue.push(`${GOAL_ROW + 1},${GOAL_COL},${currRound}`);
while (queue.length !== 0) {
  let curr = queue.shift();
  let [row, col, round] = curr.split(",").map((a) => Number(a));
  let stateNum = (round + 1) % LCM;
  if (row == 1 && col == 1) {
    backToStartRound = round + 1;
    break;
  }
  if (states[round % LCM].has(`${row},${col}`)) {
    console.log(`${row},${col},${round}`);
  }
  if (
    row > 1 &&
    !states[stateNum].has(`${row - 1},${col}`) &&
    !known.has(`${row - 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row - 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row - 1},${col},${round + 1}`);
  }
  if (
    row < HEIGHT - 2 &&
    !states[stateNum].has(`${row + 1},${col}`) &&
    !known.has(`${row + 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row + 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row + 1},${col},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col > 1 &&
    !states[stateNum].has(`${row},${col - 1}`) &&
    !known.has(`${row},${col - 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col - 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col - 1},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col < WIDTH - 2 &&
    !states[stateNum].has(`${row},${col + 1}`) &&
    !known.has(`${row},${col + 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col + 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col + 1},${round + 1}`);
  }
  if (
    !states[stateNum].has(`${row},${col}`) &&
    !known.has(`${row},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col},${round + 1}`);
  }
}

currRound = backToStartRound;
let result2;
known = new Map();
known.set(`0,1,${currRound}`, currRound);
queue = [];
queue.push(`0,1,${currRound}`);
while (queue.length !== 0) {
  let curr = queue.shift();
  let [row, col, round] = curr.split(",").map((a) => Number(a));
  let stateNum = (round + 1) % LCM;
  if (row == GOAL_ROW && col == GOAL_COL) {
    result2 = round + 1;
    break;
  }
  if (states[round % LCM].has(`${row},${col}`)) {
    console.log(`${row},${col},${round}`);
  }
  if (
    row > 1 &&
    !states[stateNum].has(`${row - 1},${col}`) &&
    !known.has(`${row - 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row - 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row - 1},${col},${round + 1}`);
  }
  if (
    row < HEIGHT - 2 &&
    !states[stateNum].has(`${row + 1},${col}`) &&
    !known.has(`${row + 1},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row + 1},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row + 1},${col},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col > 1 &&
    !states[stateNum].has(`${row},${col - 1}`) &&
    !known.has(`${row},${col - 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col - 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col - 1},${round + 1}`);
  }
  if (
    row > 0 &&
    row < HEIGHT - 1 &&
    col < WIDTH - 2 &&
    !states[stateNum].has(`${row},${col + 1}`) &&
    !known.has(`${row},${col + 1},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col + 1},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col + 1},${round + 1}`);
  }
  if (
    !states[stateNum].has(`${row},${col}`) &&
    !known.has(`${row},${col},${(round + 1) % LCM}`)
  ) {
    known.set(`${row},${col},${(round + 1) % LCM}`, round + 1);
    queue.push(`${row},${col},${round + 1}`);
  }
}

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
