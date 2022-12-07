const fs = require("fs");
let input = fs.readFileSync("./inputs/day7.txt").toString().split("\n");
input = input.map((l) => l.trim());

const TOTAL_SPACE = 70000000;
const SPACE_NEEDED = 30000000;

let directory = {};
let path = [];
let currDir;
let hasChangedDir = false;

// build the tree
for (let line of input) {
  if (line.length == 0) continue;
  if (line.charAt(0) == "$") {
    if (line.charAt(2) == "c") {
      hasChangedDir = true;
      let cdParam = line.substring(5);
      if (cdParam == "..") {
        path.pop();
      } else if (cdParam.charAt(0) == "/") {
        path = [];
        // apparently only happens at top of file.
      } else {
        path.push(cdParam);
      }
    } else {
      // can just ignore
    }
  } else {
    if (hasChangedDir) {
      currDir = directory;
      for (let dir of path) {
        if (!currDir.hasOwnProperty(dir)) {
          currDir[dir] = {};
        } else {
          currDir = currDir[dir];
        }
      }
      hasChangedDir = false;
    }
    if (line.substring(0, 3) == "dir") {
      let dirName = line.substring(4);
      currDir[dirName] = {};
    } else {
      let [size, fileName] = line.split(" ");
      currDir[fileName] = size;
    }
  }
}

function dfs(obj) {
  let dirSize = 0;
  for (let val of Object.values(obj)) {
    if (typeof val === "object" && val !== null && val !== undefined) {
      dirSize += dfs(val);
    } else {
      dirSize += Number(val);
    }
  }

  if (dirSize <= 100000) {
    result += dirSize;
  }
  dirSizes.push(dirSize);
  return dirSize;
}

let result = 0;
let dirSizes = [];

let totalSize = dfs(directory);
let spaceLeft = TOTAL_SPACE - totalSize;
let sizeToDelete = SPACE_NEEDED - spaceLeft;

let result2 = Infinity;
for (let size of dirSizes) {
  if (size >= sizeToDelete && size < result2) {
    result2 = size;
  }
}

console.log(`Part 1: ${result}`);
console.log(`Part 2: ${result2}`);
