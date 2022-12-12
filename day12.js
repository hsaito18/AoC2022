const fs = require("fs");
let input = fs.readFileSync("./inputs/day12.txt").toString().split("\n");
input = input.map((l) => l.trim());
const PriorityQueue = require("js-priority-queue");

// https://en.wikipedia.org/wiki/A*_search_algorithm
// https://www.npmjs.com/package/js-priority-queue

let result1;
let result2;
class Node {
  constructor(row, col, height) {
    this.row = row;
    this.col = col;
    this.height = height;
  }
  getNeighbours() {
    let neighbours = [];
    if (this.row !== 0) {
      neighbours.push(grid[this.row - 1][this.col]);
    }
    if (this.col !== 0) {
      neighbours.push(grid[this.row][this.col - 1]);
    }
    if (this.row !== grid.length - 1) {
      neighbours.push(grid[this.row + 1][this.col]);
    }
    if (this.col !== grid[0].length - 1) {
      neighbours.push(grid[this.row][this.col + 1]);
    }
    return neighbours;
  }
}

let grid = [];
let goalNode;
let startNode;
for (let i = 0; i < input.length; i++) {
  if (input[i].length == 0) continue;
  grid[i] = [];
  for (let j = 0; j < input[i].length; j++) {
    let currChar = input[i].charAt(j);
    grid[i][j] = currChar;
    if (currChar == "E") {
      goalPos = [i, j];
      goalNode = new Node(i, j, 25);
      grid[i][j] = goalNode;
    } else if (currChar == "S") {
      startNode = new Node(i, j, 0);
      grid[i][j] = startNode;
    } else {
      grid[i][j] = new Node(i, j, currChar.charCodeAt() - 97);
    }
  }
}

function heuristic(node) {
  let dx = Math.abs(node.col - goalNode.col);
  let dy = Math.abs(node.row - goalNode.row);
  return dx + dy;
}

function AStar(start, goal, h) {
  function getGScore(key) {
    if (gScore.get(key) === undefined) return Infinity;
    return gScore.get(key);
  }
  function getFScore(key) {
    if (fScore.get(key) === undefined) return Infinity;
    return fScore.get(key);
  }
  let openQueue = new PriorityQueue({
    comparator: (a, b) => getFScore(a) - getFScore(b),
  });
  let openSet = new Set();
  openQueue.queue(start);
  openSet.add(start);
  let cameFrom = new Map();
  let gScore = new Map();
  let fScore = new Map();

  gScore.set(start, 0);
  fScore.set(start, h(start));

  while (openQueue.length != 0) {
    let currentNode = openQueue.dequeue();
    openSet.delete(currentNode);
    if (currentNode == goal) {
      return [getGScore(currentNode), gScore];
    }
    let neighbours = currentNode.getNeighbours();
    for (let neighbour of neighbours) {
      if (neighbour.height > currentNode.height + 1) continue;
      let tentativeGScore = getGScore(currentNode) + 1;
      if (tentativeGScore < getGScore(neighbour)) {
        gScore.set(neighbour, tentativeGScore);
        fScore.set(neighbour, tentativeGScore + h(neighbour));
        if (!openSet.has(neighbour)) {
          openSet.add(neighbour);
          openQueue.queue(neighbour);
        }
      }
    }
  }
  return [null, null];
}
[result1, gScore] = AStar(startNode, goalNode, heuristic);
let nodes = Array.from(gScore.keys());
let possibleStarts = nodes.filter((a) => a.height == 0);
let possibleSteps = [];
for (let node of possibleStarts) {
  let steps = AStar(node, goalNode, heuristic);
  if (steps[0]) {
    possibleSteps.push(steps[0]);
  }
}
result2 = Math.min(...possibleSteps);
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
