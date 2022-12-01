const fs = require("fs");
const input = fs.readFileSync("./inputs/day1.txt").toString().split("\n");

// Definitely not the most efficient algo, but the context does not require an efficient algo.
let elves = [];
let ei = 0;
for (let line of input) {
  if (line.trim().length == 0) {
    ei++;
    elves[ei] = 0;
  }
  elves[ei] += Number(line.trim());
}
elves.sort((a, b) => a - b).reverse();
console.log(`Part 1: ${elves[0]}`);
console.log(`Part 2: ${elves[0] + elves[1] + elves[2]}`);
