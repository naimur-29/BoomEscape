// audio:
const audio = document.getElementById("myAudio");
const btn = document.querySelector(".sound-btn");

function startAudio() {
  btn.innerHTML = `<svg
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

  audio.play();
  btn.onclick = stopAudio;
}

function stopAudio() {
  btn.innerHTML = `<svg
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

  audio.pause();
  btn.onclick = startAudio;
}

// dialog:
const tutorialDialog = document.querySelector(".game-info-dialog");
const playButton = document.querySelector(".play");

playButton.onclick = function (event) {
  event.preventDefault();

  tutorialDialog.style.display = "flex";
};
