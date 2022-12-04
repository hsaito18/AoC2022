const fs = require("fs");
let input = fs.readFileSync("./inputs/day4.txt").toString().split("\n");
input = input.map((l) => l.trim());

const containedInside = (min1, max1, min2, max2) => {
  if (min1 <= min2 && max1 >= max2) {
    return true;
  }
  if (min1 >= min2 && max1 <= max2) {
    return true;
  }
  return false;
};

const overlap = (min1, max1, min2, max2) => {
  let c = 0;
  if (max1 >= min2) c++;
  if (max2 >= min1) c++;
  return c > 1;
};

let sum = 0;
let sum2 = 0;

for (let line of input) {
  if (line.length == 0) continue;
  let [r1, r2] = line.split(",");
  let [min1, max1] = r1.split("-");
  let [min2, max2] = r2.split("-");
  if (containedInside(Number(min1), Number(max1), Number(min2), Number(max2))) {
    sum++;
  }
  if (overlap(Number(min1), Number(max1), Number(min2), Number(max2))) {
    sum2++;
  }
}

console.log(`Part 1: ${sum}`);
console.log(`Part 2: ${sum2}`);
