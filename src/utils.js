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

function updateNeighbors(prevI, prevJ) {
  for (let iOff = -1; iOff <= 1; iOff++) {
    for (let jOff = -1; jOff <= 1; jOff++) {
      let i = prevI + iOff;
      let j = prevJ + jOff;
      console.log(i, j);

      if (
        i > -1 &&
        i < cellsPerRow &&
        j > -1 &&
        j < cellsPerRow &&
        !cellStorage[i][j].isVisited
      ) {
        console.log("worked!");
        cellStorage[i][j].update();
        if (cellStorage[i][j].state === "0") updateNeighbors(i, j);
      }
    }
  }
}
