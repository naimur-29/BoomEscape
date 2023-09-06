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
        this.element.style.backgroundColor = "#f474";
      } else {
        this.element.style.backgroundColor = "#4f84";
      }
      this.element.textContent = this.state;
    }
  }
}
