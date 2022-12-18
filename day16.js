const fs = require("fs");
let input = fs.readFileSync("./inputs/day16.txt").toString().split("\n");
input = input.map((l) => l.trim());
const PriorityQueue = require("js-priority-queue");
const TimSort = require("timsort");

const START_TIME = 30;
const MAX_DISTANCE_THRESHOLD = 4;

const valves = {};

class Valve {
  constructor(name, flowrate, tunnels, time, score, notAlreadyOpened) {
    this.name = name;
    this.flowrate = flowrate;
    this.tunnels = tunnels;
    this.time = time;
    this.score = score;
    this.notAlreadyOpened = JSON.parse(JSON.stringify(notAlreadyOpened));
  }

  getNeighbours() {
    let neighbours = [];
    for (let t of this.tunnels) {
      neighbours.push(valves[t]);
    }
    return neighbours;
  }
  getScore() {
    return this.time * this.flowrate;
  }
}

function findShortestPath(start, end) {
  function getGScore(key) {
    if (gScore.get(key) === undefined) return Infinity;
    return gScore.get(key);
  }

  let openQueue = new PriorityQueue({
    comparator: (a, b) => getGScore(a) - getGScore(b),
  });
  let openSet = new Set();
  openQueue.queue(start);
  openSet.add(start);

  let gScore = new Map();

  gScore.set(start, 0);

  while (openQueue.length != 0) {
    let currentNode = openQueue.dequeue();
    openSet.delete(currentNode);
    if (currentNode == end) {
      return getGScore(currentNode);
    }
    let neighbours = currentNode.getNeighbours();
    for (let neighbour of neighbours) {
      let tentativeGScore = getGScore(currentNode) + 1;
      if (tentativeGScore < getGScore(neighbour)) {
        gScore.set(neighbour, tentativeGScore);
        if (!openSet.has(neighbour)) {
          openSet.add(neighbour);
          openQueue.queue(neighbour);
        }
      }
    }
  }
  return null;
}

function generateDistancesBetweenFlowValves() {
  let flowDists = {};
  for (let v of Object.values(flowValves)) {
    flowDists[v.name] = {};
    for (let v2 of Object.values(flowValves)) {
      flowDists[v.name][v2.name] = findShortestPath(v, v2);
    }
  }
  return flowDists;
}

function generateDistancesToFlowValves(startValve) {
  let flowDists = {};
  for (let v of Object.values(flowValves)) {
    flowDists[v.name] = findShortestPath(startValve, v);
  }
  return flowDists;
}

function simpleGetMaxPossibleScore(path, time1, time2, score) {
  let maxScore = score;
  let nextTime = time1 - 2;
  let nextTime2 = time2 - 2;
  let counter = 1;
  for (let [name, flow] of Object.entries(openableValves)) {
    if (!path.includes(name)) {
      if (counter % 2 == 0) {
        maxScore += flow * nextTime2;
      } else {
        maxScore += flow * nextTime;
      }
    }
    counter++;
  }
  return maxScore;
}

let openableValves = {};
for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let name = words[1];
  let flow = Number(words[4].split("=")[1].slice(0, -1));
  if (flow > 0) openableValves[name] = flow;
}

let flowValves = {};

for (let line of input) {
  if (line.length == 0) continue;
  let words = line.split(" ");
  let name = words[1];
  let flow = Number(words[4].split("=")[1].slice(0, -1));
  let tunnels = [];
  for (let i = 9; i < words.length; i++) {
    if (words[i].length == 3) {
      tunnels.push(words[i].substring(0, 2));
    } else {
      tunnels.push(words[i]);
    }
  }

  let valve = new Valve(name, flow, tunnels, START_TIME, 0, openableValves);
  valves[name] = valve;
  if (flow > 0) {
    flowValves[name] = valve;
  }
}

let flowDists = generateDistancesBetweenFlowValves();
flowDists["AA"] = generateDistancesToFlowValves(valves["AA"]);

let paths = [];
let queue = [];
for (let [name, time] of Object.entries(flowDists["AA"])) {
  let p = ["AA"];
  p.push(name);
  let queueObj = {
    path: p,
    t: START_TIME - time - 1,
    score: (START_TIME - time - 1) * openableValves[name],
  };
  queue.push(queueObj);
}
while (queue.length !== 0) {
  let currObj = queue.shift();
  let currTime = currObj.t;
  let currPath = currObj.path;
  let currValve = currPath.at(-1);
  let currScore = currObj.score;
  let done = true;
  for (let [name, time] of Object.entries(flowDists[currValve])) {
    if (
      !currPath.includes(name) &&
      currTime - time - 1 > 0 &&
      time < MAX_DISTANCE_THRESHOLD
    ) {
      done = false;
      let newPath = JSON.parse(JSON.stringify(currPath));
      newPath.push(name);
      let newTime = currTime - time - 1;
      let newScore = currScore + newTime * openableValves[name];
      let queueObj = { path: newPath, t: newTime, score: newScore };
      queue.push(queueObj);
    }
  }
  if (done) {
    paths.push(currObj);
  }
}
TimSort.sort(paths, (a, b) => b.score - a.score);
let result1 = paths[0].score;

const MAX_DISTANCE_THRESHOLD2 = 6;
const START_TIME_2 = 26;
const MIN_SCORE = 2350;

let paths2 = [];
let queue2 = [];
for (let [name, time] of Object.entries(flowDists["AA"])) {
  for (let [name2, time2] of Object.entries(flowDists["AA"])) {
    if (name == name2) continue;
    let p1 = ["AA"];
    let p2 = ["AA"];
    p1.push(name);
    p2.push(name2);
    let t1 = START_TIME_2 - time - 1;
    let t2 = START_TIME_2 - time2 - 1;
    let queueObj = {
      path1: p1,
      path2: p2,
      t1: t1,
      t2: t2,
      score: t1 * openableValves[name] + t2 * openableValves[name2],
    };
    queue2.push(queueObj);
  }
}
while (queue2.length !== 0) {
  let currObj = queue2.shift();
  let currTime = currObj.t1;
  let currTime2 = currObj.t2;
  let currPath = currObj.path1;
  let currPath2 = currObj.path2;
  let currValve = currPath.at(-1);
  let currValve2 = currPath2.at(-1);
  let currScore = currObj.score;
  let reallyDone = true;
  for (let [name, time] of Object.entries(flowDists[currValve])) {
    let newPath = JSON.parse(JSON.stringify(currPath));
    newPath.push(name);
    let done = true;
    if (
      !currPath.includes(name) &&
      !currPath2.includes(name) &&
      currTime - time - 1 > 0 &&
      time < MAX_DISTANCE_THRESHOLD2
    ) {
      reallyDone = false;
      for (let [name2, time2] of Object.entries(flowDists[currValve2])) {
        if (
          !newPath.includes(name2) &&
          !currPath2.includes(name2) &&
          currTime2 - time2 - 1 > 0 &&
          time2 < MAX_DISTANCE_THRESHOLD2
        ) {
          done = false;

          let newPath2 = JSON.parse(JSON.stringify(currPath2));

          newPath2.push(name2);
          let newTime = currTime - time - 1;
          let newTime2 = currTime2 - time2 - 1;

          let newScore =
            currScore +
            newTime * openableValves[name] +
            newTime2 * openableValves[name2];
          let queueObj = {
            path1: newPath,
            path2: newPath2,
            t1: newTime,
            t2: newTime2,
            score: newScore,
          };
          if (
            simpleGetMaxPossibleScore(
              newPath.concat(newPath2),
              Math.max(newTime, newTime2),
              Math.min(newTime, newTime2),
              newScore
            ) > MIN_SCORE
          ) {
            queue2.push(queueObj);
          }
        }
      }
      if (done) {
        let newTime = currTime - time - 1;
        let queueObj = {
          path1: newPath,
          path2: currPath2,
          t1: newTime,
          t2: currTime2,
          score: currScore + newTime * openableValves[name],
        };
        if (
          simpleGetMaxPossibleScore(
            newPath.concat(currPath2),
            Math.max(newTime, currTime2),
            Math.min(newTime, currTime2),
            currScore + newTime * openableValves[name]
          ) > MIN_SCORE
        ) {
          queue2.push(queueObj);
        }
      }
    }
  }
  if (reallyDone) {
    paths2.push(currObj);
  }
}
TimSort.sort(paths2, (a, b) => b.score - a.score);
let result2 = paths2[0].score;

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
