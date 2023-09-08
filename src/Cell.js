// cell class:
class Cell {
  constructor(className) {
    this.state = cellStates[Math.floor(Math.random() * cellStates.length)];
    this.isVisited = false;
    this.className = className;

    this.element = document.createElement("button");
    this.element.classList.add("cell");
    this.element.classList.add(className);
    this.element.style.width = `${containerSize / cellsPerRow}px`;
    this.element.style.height = `${containerSize / cellsPerRow}px`;

    container.appendChild(this.element);

    timeStep += 25 - (cellsPerRow > 5 ? cellsPerRow + 6 : 0);
    const timeoutRef = setTimeout(() => {
      this.animateInit();

      clearTimeout(timeoutRef);
    }, timeStep);
    // this.element.textContent = this.state;
  }

  update() {
    if (!this.isVisited) {
      this.isVisited = true;
      this.element.disabled = true;
      if (this.state !== bomb) SCORE++;

      this.show();
    }
  }

  show() {
    if (this.isVisited) {
      if (this.state === bomb) {
        this.animateUncover();
        this.animateBomb();
        this.element.style.backgroundColor = "#f474";
      } else {
        this.animateUncover();
        this.element.style.backgroundColor = "#4f84";
      }
      this.element.textContent = this.state;
    }
  }

  animateInit() {
    this.element.animate(
      [
        {
          opacity: 0,
          backgroundColor: "#fff",
          transform: `scaleY(3)`,
        },
        {
          opacity: 1,
          backgroundColor: "#fff1",
          transform: "scaleY(0)",
        },
      ],
      {
        duration: 300,
        iterations: 1,
        fill: "backwards",
      }
    );
  }

  animateUncover() {
    this.element.animate(
      [
        {
          opacity: 0,
          transform: "scale(3) rotateY(180deg)",
        },
        {
          opacity: 0.5,
          transform: "scale(2) rotateY(0deg)",
        },
        {
          opacity: 1,
          transform: "scale(1) rotateY(0deg)",
        },
      ],
      {
        duration: 300,
        iterations: 1,
        fill: "backwards",
      }
    );
  }

  animateBomb() {
    this.element.animate(
      [
        {
          scale: 1.25,
          rotate: "10deg",
        },
        {
          scale: 1.25,
          rotate: "-10deg",
        },
      ],
      {
        delay: 350,
        duration: 100,
        iterations: 6,
        fill: "backwards",
        direction: "alternate",
      }
    );
  }
}
