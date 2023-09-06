// audio section:
let isAudioOn = true;
const bombAudio = document.getElementById("bomb");
const zeroAudio = document.getElementById("zero");
const tapAudio = document.getElementById("tap");
const victoryAudio = document.getElementById("victory");
tapAudio.volume -= 0.2;
victoryAudio.volume -= 0.2;

const soundBtn = document.querySelector(".sound-btn");

function startAudio() {
  isAudioOn = true;
  soundBtn.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-volume-2"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>`;

  soundBtn.onclick = stopAudio;
}

function stopAudio() {
  isAudioOn = false;
  soundBtn.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-volume-x"
        >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="22" x2="16" y1="9" y2="15" />
        <line x1="16" x2="22" y1="9" y2="15" />
      </svg>`;

  soundBtn.onclick = startAudio;
}

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
let SCORE = 0;
let LEVEL = 0;
let LIVES = 5;
let cellStorage;
let cellsPerRow = 5;
let maxScore = cellsPerRow * cellsPerRow;
const cellStates = [null, null, null, null, bomb];

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

function bootGame(size, _lives) {
  document.body.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];

  container.style.gridTemplateColumns = `repeat(${size}, auto)`;
  container.style.gridTemplateRows = `repeat(${size}, auto)`;

  restartDisplay.style.display = "none";
  nextDisplay.style.display = "none";
  container.textContent = "";
  cellStorage = [];
  cellsPerRow = size;
  LEVEL = size - 4;
  LIVES = _lives;
  maxScore = 0;
  SCORE = 0;

  // create the cells:
  for (let i = 0; i < cellsPerRow; i++) {
    const row = [];
    for (let j = 0; j < cellsPerRow; j++) {
      const className = `[${i}][${j}]`;
      row.push(new Cell(className));
    }
    cellStorage.push(row);
  }

  // game setup:
  for (let i = 0; i < cellsPerRow; i++) {
    for (let j = 0; j < cellsPerRow; j++) {
      game(i, j);
    }
  }
  updateGameStats();
}

function game(i, j) {
  // calculate the cell state for the rest:
  if (cellStorage[i][j].state === null) {
    cellStorage[i][j].state = String(countNeighborBombs(i, j));
    maxScore++;
  }

  // add click event listeners:
  cellStorage[i][j].element.onpointerup = function () {
    // play audio:
    if (isAudioOn) {
      bombAudio.pause();
      bombAudio.currentTime = 0;
      zeroAudio.pause();
      zeroAudio.currentTime = 0;
      tapAudio.pause();
      tapAudio.currentTime = 0;

      if (cellStorage[i][j].state === bomb) {
        bombAudio.play();
      } else if (cellStorage[i][j].state === "0") {
        zeroAudio.play();
      } else {
        tapAudio.play();
      }
    }

    if (!cellStorage[i][j].isVisited) {
      cellStorage[i][j].update();

      // if no bomb nearby show every neighbor:
      if (cellStorage[i][j].state !== bomb) {
        if (cellStorage[i][j].state === "0") {
          updateNeighbors(i, j);
        }
      } else LIVES--;
    }
    updateGameStats();
  };
}

function updateGameStats() {
  // handle game over:
  if (LIVES === 0 || cellsPerRow >= 15) {
    restartDisplay.style.display = "flex";
  }

  if (SCORE >= maxScore) {
    if (isAudioOn) {
      victoryAudio.play();
    }
    nextDisplay.style.display = "flex";
  }

  level.textContent = LEVEL >= 10 ? LEVEL : `0${LEVEL}`;
  lives.textContent = live.repeat(LIVES);
}

function isThereBomb(i, j) {
  try {
    if (cellStorage[i][j] !== undefined) {
      return cellStorage[i][j].state === bomb ? 1 : 0;
    }
  } catch (error) {}
  return 0;
}

function countNeighborBombs(i, j) {
  return (
    isThereBomb(i - 1, j) +
    isThereBomb(i, j - 1) +
    isThereBomb(i - 1, j - 1) +
    isThereBomb(i + 1, j) +
    isThereBomb(i, j + 1) +
    isThereBomb(i + 1, j + 1) +
    isThereBomb(i + 1, j - 1) +
    isThereBomb(i - 1, j + 1)
  );
}

function updateNeighbors(i, j) {
  if (i > 0) cellStorage[i - 1][j].update();
  if (j > 0) cellStorage[i][j - 1].update();
  if (i > 0 && j > 0) cellStorage[i - 1][j - 1].update();
  if (i < cellsPerRow - 1) cellStorage[i + 1][j].update();
  if (j < cellsPerRow - 1) cellStorage[i][j + 1].update();
  if (i < cellsPerRow - 1 && j < cellsPerRow - 1)
    cellStorage[i + 1][j + 1].update();
  if (j > 0 && i < cellsPerRow - 1) cellStorage[i + 1][j - 1].update();
  if (i > 0 && j < cellsPerRow - 1) cellStorage[i - 1][j + 1].update();
}

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
