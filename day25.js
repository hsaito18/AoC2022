const fs = require("fs");
let input = fs.readFileSync("./inputs/day25.txt").toString().split("\n");
input = input.map((l) => l.trim());

let snafuNums = [];
let maxLen = 0;

for (let line of input) {
  if (line.length == 0) continue;
  if (line.length > maxLen) maxLen = line.length;
}
let powersOfFive = [];
for (let i = 0; i < maxLen + 10; i++) {
  powersOfFive[i] = 5 ** i;
}
let sum = 0;
for (let line of input) {
  if (line.length == 0) continue;
  let decimal = 0;
  for (let i = 0; i < line.length; i++) {
    let curr;
    switch (line.charAt(line.length - 1 - i)) {
      case "2":
        curr = 2 * powersOfFive[i];
        break;
      case "1":
        curr = powersOfFive[i];
        break;
      case "0":
        curr = 0;
        break;
      case "-":
        curr = -powersOfFive[i];
        break;
      case "=":
        curr = -2 * powersOfFive[i];
        break;
    }
    decimal += curr;
  }
  sum += decimal;
}
let numDigits = 1;
let biggest = 2;
while (biggest < sum) {
  numDigits++;
  biggest += 2 * powersOfFive[numDigits - 1];
}

function closestNumberTo(options, goal) {
  let closestDelta = Infinity;
  let closestOpt = null;
  let closestKey = null;
  for (let [key, opt] of Object.entries(options)) {
    let delta = Math.abs(opt - goal);
    if (delta < closestDelta) {
      closestDelta = delta;
      closestOpt = opt;
      closestKey = key;
    }
  }
  return [Number(closestKey), closestOpt];
}
let snafu = "";
let next = sum;
while (numDigits > 0) {
  let opts = {};
  for (let i = -2; i < 3; i++) {
    opts[i] = powersOfFive[numDigits - 1] * i;
  }
  let [val, closest] = closestNumberTo(opts, next);
  next = next - closest;
  if (val == -1) val = "-";
  if (val == -2) val = "=";
  snafu += val;
  numDigits -= 1;
}

console.log(`Part 1: ${snafu}`);
