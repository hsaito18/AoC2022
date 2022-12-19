const fs = require("fs");
let input = fs.readFileSync("./inputs/day19.txt").toString().split("\n");
input = input.map((l) => l.trim());
const cloneDeep = require("lodash.clonedeep");
const START_TIME = 24;
const START_TIME_2 = 32;

let blueprints = [];
let blueprints2 = [];

for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let blueprint = {
    id: 0,
    oreRobot: [0, 0, 0],
    clayRobot: [0, 0, 0],
    obsidianRobot: [0, 0, 0],
    geodeRobot: [0, 0, 0],
  };
  blueprint.id = Number(words[1].slice(0, -1));
  blueprint.oreRobot[0] = Number(words[6]);
  blueprint.clayRobot[0] = Number(words[12]);
  blueprint.obsidianRobot[0] = Number(words[18]);
  blueprint.obsidianRobot[1] = Number(words[21]);
  blueprint.geodeRobot[0] = Number(words[27]);
  blueprint.geodeRobot[2] = Number(words[30]);
  blueprints.push(blueprint);
  if (blueprints2.length < 3) {
    blueprints2.push(blueprint);
  }
}

class State {
  constructor(
    time,
    score,
    ores,
    clays,
    obsidians,
    blueprint,
    geoRobots,
    obsRobots,
    clayRobots,
    oreRobots,
    forbidden = new Set()
  ) {
    this.time = time;
    this.score = score;
    this.ore = ores;
    this.clay = clays;
    this.obsidian = obsidians;
    this.blueprint = blueprint;
    this.geoRobots = geoRobots;
    this.obsRobots = obsRobots;
    this.clayRobots = clayRobots;
    this.oreRobots = oreRobots;
    this.forbidden = forbidden;
  }

  generatePossibleNextStates() {
    if (
      fastestTimesForGeode[this.geoRobots + 1] &&
      fastestTimesForGeode[this.geoRobots + 1] > this.time + 1
    ) {
      return [];
    }
    let oreLimit = this.blueprint.maxOre * this.time;
    let clayLimit = this.blueprint.maxClay * this.time;
    if (this.ore > oreLimit) {
      this.ore = oreLimit;
    }
    if (this.clay > clayLimit) {
      this.clay = clayLimit;
    }
    if (
      this.obsidian >= this.blueprint.geodeRobot[2] &&
      this.ore >= this.blueprint.geodeRobot[0]
    ) {
      if (
        !fastestTimesForGeode[this.geoRobots + 1] ||
        this.time > fastestTimesForGeode[this.geoRobots + 1]
      ) {
        fastestTimesForGeode[this.geoRobots + 1] = this.time;
      }
      let newOres = this.ore + this.oreRobots - this.blueprint.geodeRobot[0];
      let newClays = this.clay + this.clayRobots - this.blueprint.geodeRobot[1];
      let newObs =
        this.obsidian + this.obsRobots - this.blueprint.geodeRobot[2];
      let state = new State(
        this.time - 1,
        this.time - 1 + this.score,
        newOres,
        newClays,
        newObs,
        this.blueprint,
        this.geoRobots + 1,
        this.obsRobots,
        this.clayRobots,
        this.oreRobots
      );
      return [state];
    }
    let otherStates = [];
    if (
      this.clay >= this.blueprint.obsidianRobot[1] &&
      this.ore >= this.blueprint.obsidianRobot[0] &&
      !this.forbidden.has(0)
    ) {
      if (this.time > fastestTimeForFirstObsidian) {
        fastestTimeForFirstObsidian = this.time;
      }
      let newOres = this.ore + this.oreRobots - this.blueprint.obsidianRobot[0];
      let newClays =
        this.clay + this.clayRobots - this.blueprint.obsidianRobot[1];
      let newObs = this.obsidian + this.obsRobots;
      let state = new State(
        this.time - 1,
        this.score,
        newOres,
        newClays,
        newObs,
        this.blueprint,
        this.geoRobots,
        this.obsRobots + 1,
        this.clayRobots,
        this.oreRobots
      );
      otherStates.push(state);
      this.forbidden.add(0);
    }
    if (
      this.ore >= this.blueprint.clayRobot[0] &&
      this.clay < clayLimit &&
      this.clayRobots < this.blueprint.maxClay &&
      !this.forbidden.has(1)
    ) {
      let newOres = this.ore + this.oreRobots - this.blueprint.clayRobot[0];
      let newClays = this.clay + this.clayRobots - this.blueprint.clayRobot[1];
      let newObs = this.obsidian + this.obsRobots;
      let state = new State(
        this.time - 1,
        this.score,
        newOres,
        newClays,
        newObs,
        this.blueprint,
        this.geoRobots,
        this.obsRobots,
        this.clayRobots + 1,
        this.oreRobots
      );
      otherStates.push(state);
      this.forbidden.add(1);
    }
    if (
      this.ore >= this.blueprint.oreRobot[0] &&
      this.ore < this.blueprint.maxOre * this.time &&
      this.oreRobots < this.blueprint.maxOre &&
      !this.forbidden.has(2)
    ) {
      let newOres = this.ore + this.oreRobots - this.blueprint.oreRobot[0];
      let newClays = this.clay + this.clayRobots - this.blueprint.oreRobot[1];
      let newObs = this.obsidian + this.obsRobots;

      let state = new State(
        this.time - 1,
        this.score,
        newOres,
        newClays,
        newObs,
        this.blueprint,
        this.geoRobots,
        this.obsRobots,
        this.clayRobots,
        this.oreRobots + 1
      );
      otherStates.push(state);
      this.forbidden.add(2);
    }
    if (this.forbidden.size < 3) {
      let state = new State(
        this.time - 1,
        this.score,
        this.ore + this.oreRobots,
        this.clay + this.clayRobots,
        this.obsidian + this.obsRobots,
        this.blueprint,
        this.geoRobots,
        this.obsRobots,
        this.clayRobots,
        this.oreRobots,
        this.forbidden
      );
      otherStates.push(state);
    }

    return otherStates;
  }
}
let fastestTimesForGeode = [];
let fastestTimeForFirstObsidian = 0;
let result1 = 0;
for (let bp of blueprints) {
  // every time you make a geode robot, score += time (after constructed);
  // goal is to make as many geode robots as soon as possible.
  let score = 0;
  fastestTimeForFirstObsidian = 0;
  fastestTimesForGeode = [];
  let maxOrePerMin = 0;
  let maxClayPerMin = 0;
  for (let robot of Object.values(bp)) {
    if (typeof robot == "number") continue;
    if (robot[0] > maxOrePerMin) maxOrePerMin = robot[0];
    if (robot[1] > maxClayPerMin) maxClayPerMin = robot[1];
  }
  bp.maxOre = maxOrePerMin;
  bp.maxClay = maxClayPerMin;
  let startState = new State(START_TIME, score, 0, 0, 0, bp, 0, 0, 0, 1);
  let possibleStates = startState.generatePossibleNextStates();
  let queue = [];
  for (let s of possibleStates) {
    queue.push(s);
  }
  let scores = [];
  while (queue.length !== 0) {
    let currState = queue.shift();
    if (currState.time == 0) {
      scores.push(currState.score);
    } else {
      let nextStates = currState.generatePossibleNextStates();
      for (let s of nextStates) {
        queue.push(s);
      }
    }
  }
  scores.sort((a, b) => b - a);
  result1 += scores[0] * Number(bp.id);
}

let result2 = 1;
for (let bp of blueprints2) {
  // every time you make a geode robot, score += time (after constructed);
  // goal is to make as many geode robots as soon as possible.
  let score = 0;
  fastestTimeForFirstObsidian = 0;
  fastestTimesForGeode = [];
  let maxOrePerMin = 0;
  let maxClayPerMin = 0;
  for (let robot of Object.values(bp)) {
    if (typeof robot == "number") continue;
    if (robot[0] > maxOrePerMin) maxOrePerMin = robot[0];
    if (robot[1] > maxClayPerMin) maxClayPerMin = robot[1];
  }
  bp.maxOre = maxOrePerMin;
  bp.maxClay = maxClayPerMin;
  let startState = new State(START_TIME_2, score, 0, 0, 0, bp, 0, 0, 0, 1);
  let possibleStates = startState.generatePossibleNextStates();
  let queue = [];
  for (let s of possibleStates) {
    queue.push(s);
  }
  let scores = [];
  while (queue.length !== 0) {
    let currState = queue.shift();
    if (currState.time == 0) {
      scores.push(currState.score);
    } else {
      let nextStates = currState.generatePossibleNextStates();
      for (let s of nextStates) {
        queue.push(s);
      }
    }
  }
  scores.sort((a, b) => b - a);
  result2 *= scores[0];
}

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
