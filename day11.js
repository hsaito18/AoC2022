const fs = require("fs");
let input = fs.readFileSync("./inputs/day11.txt").toString().split("\n");
input = input.map((l) => l.trim());

const NUM_TURNS = 20;
const NUM_TURNS2 = 10000;

class Monkey {
  constructor(startingItems, operation, divisibleNum, trueMonkey, falseMonkey) {
    this.items = startingItems;
    this.operation = operation;
    this.divisibleNum = divisibleNum;
    this.trueMonkey = trueMonkey;
    this.falseMonkey = falseMonkey;
    this.inspections = 0;
  }

  turn() {
    for (let item of this.items) {
      item = this.operation(item);
      item = Math.trunc(item / 3);
      if (item % this.divisibleNum == 0) {
        monkeys[this.trueMonkey].catchItem(item);
      } else {
        monkeys[this.falseMonkey].catchItem(item);
      }
      this.inspections += 1;
    }
    this.items = [];
  }

  turn2() {
    for (let item of this.items) {
      item = this.operation(item);
      item = item % lcm;
      if (item % this.divisibleNum == 0) {
        monkeys2[this.trueMonkey].catchItem(item);
      } else {
        monkeys2[this.falseMonkey].catchItem(item);
      }
      this.inspections += 1;
    }
    this.items = [];
  }

  catchItem(item) {
    this.items.push(item);
  }
}

let monkeys = [];
let monkeys2 = [];

let lcm = 1;
for (let i = 0; i < input.length; i++) {
  let line = input[i];
  if (line.substring(0, 6) == "Monkey") {
    let monkeyNum = Number(line.charAt(7));
    let [_, startItemsString] = input[i + 1].split(":");
    let startingItemsStr = startItemsString.split(",");
    let startingItems = [];
    for (let itemStr of startingItemsStr) {
      let item = Number(itemStr);
      startingItems.push(item);
    }
    let operationStrings = input[i + 2].split(" ");
    let operationStr = operationStrings.at(-2);
    let operandStr = operationStrings.at(-1);
    let operationFunc;
    if (operationStr == "*") {
      if (operandStr == "old") {
        operationFunc = (o) => o * o;
      } else if (!isNaN(operandStr)) {
        operationFunc = (o) => o * Number(operandStr);
      } else {
        console.log("ummmmmm.... operand is not a number nor old???");
      }
    } else if (operationStr == "+") {
      if (!isNaN(operandStr)) {
        operationFunc = (o) => o + Number(operandStr);
      } else {
        console.log("ummmmmm.... operand is not a number???");
      }
    }
    let divisibleNum = Number(input[i + 3].split(" ").at(-1));
    lcm = lcm * divisibleNum; // divisibleNums are all different and all prime so no redundancy checks needed.
    let trueMonkey = Number(input[i + 4].split(" ").at(-1));
    let falseMonkey = Number(input[i + 5].split(" ").at(-1));
    let monkey = new Monkey(
      JSON.parse(JSON.stringify(startingItems)),
      operationFunc,
      divisibleNum,
      trueMonkey,
      falseMonkey
    );
    let monkey2 = new Monkey(
      JSON.parse(JSON.stringify(startingItems)),
      operationFunc,
      divisibleNum,
      trueMonkey,
      falseMonkey
    );
    monkeys[monkeyNum] = monkey;
    monkeys2[monkeyNum] = monkey2;
  }
}

for (let i = 0; i < NUM_TURNS; i++) {
  for (let monkey of monkeys) {
    monkey.turn();
  }
}

for (let i = 0; i < NUM_TURNS2; i++) {
  for (let monkey of monkeys2) {
    monkey.turn2();
  }
}

let monkeyInspections = [];
let monkeyInspections2 = [];
for (let monkey of monkeys) {
  monkeyInspections.push(monkey.inspections);
}
let j = 0;
for (let monkey of monkeys2) {
  monkeyInspections2.push(monkey.inspections);
}

monkeyInspections.sort((a, b) => a - b);
monkeyInspections2.sort((a, b) => a - b);

let result1 = monkeyInspections.at(-1) * monkeyInspections.at(-2);
let result2 = monkeyInspections2.at(-1) * monkeyInspections2.at(-2);
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
