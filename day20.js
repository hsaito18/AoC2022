const fs = require("fs");
let input = fs.readFileSync("./inputs/day20.txt").toString().split("\n");
input = input.map((l) => l.trim());

function getNewIndex(idx, val, len) {
  let next = idx + val;
  let out;
  if (next < 0) {
    out = len + next - 1;
  } else if (next >= len) {
    out = next - len + 1;
  } else {
    out = next;
  }
  return out;
}

class SpecialNumber {
  constructor(val) {
    this.val = val;
  }
}

let initial = [];
let final = [];
let zeroObj = [];
for (let line of input) {
  if (line.length == 0) continue;
  let num = new SpecialNumber(Number(line));
  initial.push(num);
  final.push(num);
  if (num.val == 0) zeroObj.push(num);
}

for (let num of initial) {
  let currIdx = final.indexOf(num);
  let newIdx = getNewIndex(currIdx, num.val, initial.length);
  let newNum = new SpecialNumber(num.val);
  if (num == zeroObj[0]) {
    zeroObj[0] = newNum;
  }
  if (newIdx > currIdx) {
    final.splice(newIdx + 1, 0, newNum);
  } else {
    final.splice(newIdx, 0, newNum);
  }
  let oldIdx = final.indexOf(num);
  final.splice(oldIdx, 1);
}

console.log(final.indexOf(zeroObj[0]));
