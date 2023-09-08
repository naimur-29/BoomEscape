// audio section:
let isAudioOn = true;
const bombAudio = document.getElementById("bomb");
const zeroAudio = document.getElementById("zero");
const tapAudio = document.getElementById("tap");
const victoryAudio = document.getElementById("victory");
tapAudio.volume -= 0.2;
victoryAudio.volume -= 0.2;

const soundBtn = document.querySelector(".sound-btn");

// colors section:
const colors = [
  "#006466",
  "#065a60",
  "#0b525b",
  "#144552",
  "#1b3a4b",
  "#212f45",
  "#272640",
  "#312244",
  "#3e1f47",
  "#4d194d",
];

const container = document.querySelector(".container");
const level = document.querySelector(".level > span");
const lives = document.querySelector(".lives");

const nextDisplay = document.querySelector(".next-menu-container");
const nextButton = document.querySelector(".next");

const restartDisplay = document.querySelector(".restart-menu-container");
const restartButton = document.querySelector(".restart");

let containerSize =
  Math.min(window.innerWidth, window.innerHeight) -
  (Math.min(window.innerWidth, window.innerHeight) > 720
    ? (Math.min(window.innerWidth, window.innerHeight) * 25) / 100
    : 20);
const bomb = "💣";
const live = "❤️";
let timeStep = 0;
let SCORE = 0;
let LEVEL = 0;
let LIVES = 5;
let cellStorage;
let cellsPerRow = 5;
let maxScore = cellsPerRow * cellsPerRow;
const cellStates = [null, null, bomb, null];

container.style.width = `${containerSize}px`;
container.style.height = `${containerSize}px`;

// start game:
bootGame(5, LIVES);

// game over:
restartButton.onclick = function () {
  bootGame(5, 5);
};

// next level:
nextButton.onclick = function () {
  bootGame(cellsPerRow + 1, 5);
  victoryAudio.pause();
  victoryAudio.currentTime = 0;
};

// handle window resize:
window.addEventListener("resize", () => {
  containerSize =
    Math.min(window.innerWidth, window.innerHeight) -
    (Math.min(window.innerWidth, window.innerHeight) > 720
      ? (Math.min(window.innerWidth, window.innerHeight) * 25) / 100
      : 20);

  container.style.width = `${containerSize}px`;
  container.style.height = `${containerSize}px`;

  for (let i = 0; i < cellsPerRow; i++) {
    for (let j = 0; j < cellsPerRow; j++) {
      cellStorage[i][j].element.style.width = `${
        containerSize / cellsPerRow
      }px`;
      cellStorage[i][j].element.style.height = `${
        containerSize / cellsPerRow
      }px`;
    }
  }
});
