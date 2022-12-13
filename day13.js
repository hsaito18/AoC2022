const fs = require("fs");
let input = fs.readFileSync("./inputs/day13.txt").toString().split("\n");
input = input.map((l) => l.trim());

let pairs = [];
let currPair = [];
for (let line of input) {
  if (line.length == 0) {
    pairs.push(currPair);
    currPair = [];
  } else {
    currPair.push(JSON.parse(line));
  }
}

const comparePair = (l, r) => {
  let shorterLen = Math.min(l.length, r.length);
  for (let i = 0; i < shorterLen; i++) {
    let lEl = l[i];
    let rEl = r[i];
    if (typeof lEl == "number" && typeof rEl == "number") {
      if (lEl > rEl) return 1;
      if (rEl > lEl) return -1;
    }
    if (typeof lEl == "number" && typeof rEl == "object") {
      let lArr = [lEl];
      let result = comparePair(lArr, rEl);
      if (result != 0) return result;
    }
    if (typeof lEl == "object" && typeof rEl == "number") {
      let rArr = [rEl];
      let result = comparePair(lEl, rArr);
      if (result != 0) return result;
    }
    if (typeof lEl == "object" && typeof rEl == "object") {
      let result = comparePair(lEl, rEl);
      if (result != 0) return result;
    }
  }
  if (l.length > r.length) return 1;
  if (r.length > l.length) return -1;
  return 0;
};

let result1 = 0;
for (let i = 0; i < pairs.length; i++) {
  let [l, r] = pairs[i];
  if (comparePair(l, r) == -1) {
    result1 += i + 1;
  }
}

let dividerPacket1 = [[2]];
let dividerPacket2 = [[6]];
let allPackets = [];
allPackets.push(dividerPacket1);
allPackets.push(dividerPacket2);
for (let line of input) {
  if (line.length > 0) allPackets.push(JSON.parse(line));
}

let sortedPairs = allPackets.sort(comparePair);
let result2 =
  (sortedPairs.indexOf(dividerPacket1) + 1) *
  (sortedPairs.indexOf(dividerPacket2) + 1);

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
