const fs = require("fs");
let input = fs.readFileSync("./inputs/day20.txt").toString().split("\n");
input = input.map((l) => l.trim());

const DKEY = 811589153;

class Node {
  constructor(prev, value) {
    this.prev = prev;
    this.value = value;
    this.value2 = value * DKEY;
  }

  setNext() {
    if (!this.prev) console.log(this.value);
    this.prev.next = this;
  }

  move(allNodes) {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    let numSteps = this.calcNumberSteps(allNodes.length);
    // console.log(`val: ${this.value} numsteps: ${numSteps}`);
    let newPrev = this.prev;
    let newNext = this.next;
    for (let i = 0; i < numSteps; i++) {
      newPrev = newPrev.next;
      newNext = newNext.next;
    }
    newPrev.next = this;
    this.prev = newPrev;
    newNext.prev = this;
    this.next = newNext;
  }

  move2(allNodes) {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    let numSteps = this.calcNumberSteps2(allNodes.length);
    let newPrev = this.prev;
    let newNext = this.next;
    for (let i = 0; i < numSteps; i++) {
      newPrev = newPrev.next;
      newNext = newNext.next;
    }
    newPrev.next = this;
    this.prev = newPrev;
    newNext.prev = this;
    this.next = newNext;
  }

  calcNumberSteps(len) {
    if (this.value > 0) {
      return this.value % (len - 1);
    } else if (this.value < 0) {
      return len - 1 + (this.value % (len - 1));
    }
    return 0;
  }
  calcNumberSteps2(len) {
    if (this.value2 > 0) {
      return this.value2 % (len - 1);
    } else if (this.value2 < 0) {
      return len - 1 + (this.value2 % (len - 1));
    }
    return 0;
  }

  getNForward(n) {
    let curr = this;
    for (let i = 0; i < n; i++) {
      curr = curr.next;
    }
    return curr;
  }
  displayList() {
    let list = [];
    list.push(this.value);
    let done = false;
    let curr = this.next;
    while (!done) {
      list.push(curr.value);
      curr = curr.next;
      if (curr === this) {
        done = true;
      }
    }
    return list;
  }
}
let inputBuffer = [];
let inputBuffer2 = [];
let allNodes = [];
let allNodes2 = [];
let firstNode = new Node(undefined, Number(input[0]));
let firstNode2 = new Node(undefined, Number(input[0]));
inputBuffer.push(firstNode);
inputBuffer2.push(firstNode2);
allNodes.push(firstNode);
allNodes2.push(firstNode2);
let zeroNode;
let zeroNode2;
for (let i = 1; i < input.length; i++) {
  let line = input[i];
  if (line.length == 0) continue;
  let prev = inputBuffer.pop();
  let prev2 = inputBuffer2.pop();
  let value = Number(line);
  let node = new Node(prev, value);
  let node2 = new Node(prev2, value);
  if (value === 0) {
    zeroNode = node;
    zeroNode2 = node2;
  }
  allNodes.push(node);
  allNodes2.push(node2);
  inputBuffer.push(node);
  inputBuffer2.push(node2);
}
firstNode.prev = inputBuffer.pop();
firstNode2.prev = inputBuffer2.pop();

for (let node of allNodes) {
  node.setNext();
}

for (let node of allNodes2) {
  node.setNext();
}

for (let node of allNodes) {
  node.move(allNodes);
}

for (let i = 0; i < 10; i++) {
  for (let node of allNodes2) {
    node.move2(allNodes2);
  }
}

let result1 =
  zeroNode.getNForward(1000).value +
  zeroNode.getNForward(2000).value +
  zeroNode.getNForward(3000).value;

let result2 =
  zeroNode2.getNForward(1000).value2 +
  zeroNode2.getNForward(2000).value2 +
  zeroNode2.getNForward(3000).value2;

console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
