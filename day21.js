const fs = require("fs");
let input = fs.readFileSync("./inputs/day21.txt").toString().split("\n");
input = input.map((l) => l.trim());

class Monkey {
  constructor(name, input) {
    //input is either the number, or the operation.
    this.name = name;
    if (input.length <= 5) {
      this.childrenNames = [];
      this.value = Number(input);
      if (this.name != "humn") {
        this.value2 = this.value;
      } else {
        this.value2 = undefined;
      }
    } else {
      let inputArr = input.split(" ");
      let cname1 = inputArr[0];
      let cname2 = inputArr[2];
      this.childrenNames = [];
      this.childrenNames.push(cname1);
      this.childrenNames.push(cname2);
      this.operation = inputArr[1];
      this.children = [];
    }
  }

  setChildren() {
    if (this.children) {
      let c1 = monkeys[this.childrenNames[0]];
      let c2 = monkeys[this.childrenNames[1]];
      this.children.push(c1);
      this.children.push(c2);
      c1.setParent(this.name);
      c2.setParent(this.name);
    }
  }

  setParent(name) {
    this.parent = monkeys[name];
  }

  getValue() {
    if (this.value !== undefined) return this.value;
    if (this.operation == "+") {
      let val = this.children[0].getValue() + this.children[1].getValue();
      if (!val) console.log(this.name);
      this.value = val;
      return val;
    }
    if (this.operation == "-") {
      let val = this.children[0].getValue() - this.children[1].getValue();
      if (!val) console.log(this.name);
      this.value = val;
      return val;
    }
    if (this.operation == "*") {
      let val = this.children[0].getValue() * this.children[1].getValue();
      if (!val) console.log(this.name);
      this.value = val;
      return val;
    }
    if (this.operation == "/") {
      let val = this.children[0].getValue() / this.children[1].getValue();
      if (!val) console.log(this.name);
      this.value = val;
      return val;
    }
  }

  getValue2() {
    if (this.value2 !== undefined || this.name == "humn") return this.value2;
    if (this.operation == "+") {
      let val = this.children[0].getValue2() + this.children[1].getValue2();
      this.value2 = val;
      return val;
    }
    if (this.operation == "-") {
      let val = this.children[0].getValue2() - this.children[1].getValue2();
      this.value2 = val;
      return val;
    }
    if (this.operation == "*") {
      let val = this.children[0].getValue2() * this.children[1].getValue2();
      this.value2 = val;
      return val;
    }
    if (this.operation == "/") {
      let val = this.children[0].getValue2() / this.children[1].getValue2();
      this.value2 = val;
      return val;
    }
  }

  startRequiredValue() {
    let val1 = this.children[0].value2;
    let val2 = this.children[1].value2;
    let val = 0;
    if (!isNaN(val1) && isNaN(val2)) {
      let reqVal = val1;
      this.children[1].calculateRequiredValue(reqVal);
    } else if (isNaN(val1) && !isNaN(val2)) {
      let reqVal = val2;
      this.children[0].calculateRequiredValue(reqVal);
    }
  }
  calculateRequiredValue(val) {
    console.log(`${this.name} must return ${val}`);
    if (this.childrenNames.length == 0) {
      if (this.name == "humn") {
        result2 = val;
      } else {
        console.log("uh oh ");
      }
      return;
    }
    let val1 = this.children[0].value2;
    let val2 = this.children[1].value2;
    if (!isNaN(val1) && isNaN(val2)) {
      let reqVal;
      if (this.operation == "+") {
        reqVal = val - val1;
      } else if (this.operation == "-") {
        reqVal = val1 - val;
      } else if (this.operation == "*") {
        reqVal = val / val1;
      } else if (this.operation == "/") {
        reqVal = val1 / val;
      }
      this.children[1].calculateRequiredValue(reqVal);
    } else if (isNaN(val1) && !isNaN(val2)) {
      let reqVal;
      if (this.operation == "+") {
        reqVal = val - val2;
      } else if (this.operation == "-") {
        reqVal = val + val2;
      } else if (this.operation == "*") {
        reqVal = val / val2;
      } else if (this.operation == "/") {
        reqVal = val * val2;
      }
      this.children[0].calculateRequiredValue(reqVal);
    }
  }
}

let monkeys = {};
for (let line of input) {
  if (line.length == 0) continue;
  let [name, input] = line.split(": ");
  let currMonkey = new Monkey(name, input);
  monkeys[name] = currMonkey;
}

for (let m of Object.values(monkeys)) {
  m.setChildren();
}

let result1 = monkeys["root"].getValue();
let result2;
monkeys["root"].getValue2();
monkeys["root"].startRequiredValue();
console.log(`Part 1: ${result1}`);
console.log(`Part 2: ${result2}`);
