const fs = require("fs");
let input = fs.readFileSync("./inputs/day3.txt").toString().split("\n");
input = input.map((l) => l.trim());

const calculatePrio = (char) => {
  let ascii = char.charCodeAt(0);
  if (ascii > 90) {
    return ascii - 96;
  } else {
    return ascii - 38;
  }
};

const findDuplicate = (line) => {
  let halfIdx = line.length / 2;
  let rucksackItems = new Set();
  for (let i = 0; i < halfIdx; i++) {
    rucksackItems.add(line.charAt(i));
  }
  for (let i = halfIdx; i < line.length; i++) {
    if (rucksackItems.has(line.charAt(i))) {
      return line.charAt(i);
    }
  }
  return "";
};

const findTriplicate = (lines) => {
  return lines[0]
    .split("")
    .filter((item) => lines[1].split("").includes(item))
    .filter((item) => lines[2].split("").includes(item));
};

let result1 = 0;
let result2 = 0;
let triplets = [];
for (let line of input) {
  if (line.length < 1) continue;
  triplets.push(line);
  if (triplets.length == 3) {
    result2 += calculatePrio(findTriplicate(triplets)[0]);
    triplets = [];
  }
  let dup = findDuplicate(line);
  result1 += calculatePrio(dup);
}
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
