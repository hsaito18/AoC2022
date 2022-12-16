const fs = require("fs");
let input = fs.readFileSync("./inputs/day15.txt").toString().split("\n");
input = input.map((l) => l.trim());

const START_TIME = 30;

class Valve {
  constructor(name, flowrate, tunnels) {
    this.name = name;
    this.flowrate = flowrate;
    this.tunnels = tunnels;
  }
}

for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let name = words[1];
  let flow = Number(words[4].split("=")[1].slice(0, -1));
  let tunnels = [];
  for (let i = 9; i < words.length; i++) {
    if (words[i].length == 3) {
    }
  }
}
