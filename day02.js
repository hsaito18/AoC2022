const fs = require("fs");
const input = fs.readFileSync("./inputs/day2.txt").toString().split("\n");

// A,X - ROCK
// B,Y - PAPER
// C,Z - SCISSORS
const SCORE = {
  "A X": 4,
  "A Y": 8,
  "A Z": 3,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 7,
  "C Y": 2,
  "C Z": 6,
};

// X - LOSE
// Y - DRAW
// Z - WIN
const SCORE_2 = {
  "A X": 3, //
  "A Y": 4,
  "A Z": 8,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 2,
  "C Y": 6,
  "C Z": 7,
};

let totalScore = 0;
let totalScore2 = 0;
for (let line of input) {
  if (line) {
    totalScore += SCORE[line];
    totalScore2 += SCORE_2[line];
  }
}

console.log(`Part 1: ${totalScore}`);
console.log(`Part 2: ${totalScore2}`);
