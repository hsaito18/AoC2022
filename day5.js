const fs = require("fs");
let input = fs.readFileSync("./inputs/day5.txt").toString().split("\n");
// input = input.map((l) => l.trim());

let stacks = [];
let stacks2 = [];
for (let i = 0; i < 9; i++) {
  stacks[i] = [];
  stacks2[i] = [];
}

let init_setup = input.slice(0, 8);
for (let i = 7; i >= 0; i--) {
  let line = init_setup[i];
  let stacksIdx = 0;
  for (let j = 1; j < 34; j += 4) {
    if (line.charAt(j) !== "" && line.charAt(j) !== " ") {
      stacks[stacksIdx].push(line.charAt(j));
      stacks2[stacksIdx].push(line.charAt(j));
    }
    stacksIdx++;
  }
}

let commands = input.slice(10);

for (let cmd of commands) {
  if (cmd.length < 5) continue;
  let elements = cmd.split(" ");
  let amount = Number(elements[1]);
  let from = Number(elements[3]) - 1;
  let to = Number(elements[5]) - 1;
  let movingStack = stacks2[from].slice(amount * -1);
  for (let i = 0; i < amount; i++) {
    let letter = stacks[from].pop();
    stacks[to].push(letter);
    stacks2[from].pop();
  }
  for (let i = 0; i < movingStack.length; i++) {
    stacks2[to].push(movingStack[i]);
  }
}

let result = "";
let result2 = "";
for (let stk of stacks) {
  result += stk.at(-1);
}
for (let stk of stacks2) {
  result2 += stk.at(-1);
}

console.log(`Part 1: ${result}`);
console.log(`Part 2: ${result2}`);
