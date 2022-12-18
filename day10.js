const fs = require("fs");
let input = fs.readFileSync("./inputs/day10.txt").toString().split("\n");
input = input.map((l) => l.trim());

let r = 1;
let cycle = 1;
let states = [];
let screen = [];

for (let line of input) {
  if (line.length == 0) continue;
  let [cmd, val] = line.split(" ");
  if (cmd == "noop") {
    states[cycle] = r;
    let pos = (cycle - 1) % 40;
    if (pos == r || pos == r - 1 || pos == r + 1) {
      screen[cycle] = "#";
    } else {
      screen[cycle] = " ";
    }
    cycle++;
  } else if (cmd == "addx") {
    states[cycle] = r;
    let pos = (cycle - 1) % 40;
    if (pos == r || pos == r - 1 || pos == r + 1) {
      screen[cycle] = "#";
    } else {
      screen[cycle] = " ";
    }
    cycle++;
    states[cycle] = r;
    pos = (cycle - 1) % 40;
    if (pos == r || pos == r - 1 || pos == r + 1) {
      screen[cycle] = "#";
    } else {
      screen[cycle] = " ";
    }
    cycle++;
    r += Number(val);
  }
}

let result1 = 0;
for (let idx of [20, 60, 100, 140, 180, 220]) {
  result1 += states[idx] * idx;
}
let result2 = "";
let horiz = 0;
for (let i = 1; i < screen.length; i++) {
  horiz = (i - 1) % 40;
  result2 += screen[i];
  if (horiz == 39) result2 += "\n";
  horiz++;
}

console.log(`Part 1: ${result1}`);
console.log(`Part 2: \n${result2}`);
