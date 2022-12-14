const fs = require("fs");
let input = fs.readFileSync("./inputs/day6.txt").toString().split("\n");
input = input[0];

for (let i = 0; i < input.length - 3; i++) {
  let substr = input.substring(i, i + 4);
  let letters = new Set();
  word: for (let j = 0; j < 4; j++) {
    if (letters.has(substr.charAt(j))) {
      break word;
    }
    letters.add(substr.charAt(j));
  }
  if (letters.size == 4) {
    var result = i + 4;
    break;
  }
}

for (let i = 0; i < input.length - 13; i++) {
  let substr = input.substring(i, i + 14);
  let letters = new Set();
  word: for (let j = 0; j < 14; j++) {
    if (letters.has(substr.charAt(j))) {
      break word;
    }
    letters.add(substr.charAt(j));
  }
  if (letters.size == 14) {
    var result2 = i + 14;
    break;
  }
}

console.log(`Part 1: ${result}`);
console.log(`Part 2: ${result2}`);
