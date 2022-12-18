const fs = require("fs");
let input = fs.readFileSync("./inputs/day17.txt").toString().split("\n");
input = input.map((l) => l.trim());

const jet = input[0];

let grid = [];
// grid[0] is floor.
// grid[row][0] is left wall, grid[row][8] is right wall.
const NUMBER_OF_ROCKS = 2022;

for (let i = 0; i < NUMBER_OF_ROCKS; i++) {}

let result1;
let result2;
console.log(`Part 1: result1`);
console.log(`Part 2: result2`);
