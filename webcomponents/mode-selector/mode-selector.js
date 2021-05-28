"use strict";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ModeCircle extends HTMLElement {
  // circle representing a mode
  constructor(selector = null) {
    super();

    this.selector = selector;
    this.addEventListener("click", (e) => selector.selection(e.target));
  }
}

customElements.define("mode-circle", ModeCircle);

class ModeSelector extends HTMLElement {
  // mode selector
  constructor() {
    super();

    // Initialize attributes
    // mandatory
    this.name = this.getAttribute("name");
    // optional
    this.n = parseInt(this.getAttribute("n")); // not used if choice={...}
    this.choices = this.getAttribute("choices") || "random";
    this.default = this.getAttribute("default") || 0;
    this.geometry = this.getAttribute("geometry") || "parabola";
    this.callback = this.getAttribute("callback") || "() => {}";
    this.circWidth = this.getAttribute("circ-width") || "100px";
    this.borderSize = this.getAttribute("border-size") || "3px";

    // Create a shadow root
    let shadow = this.attachShadow({ mode: "open" });
    // Apply external styles to the shadow dom
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "mode-selector.css");
    linkElem.setAttribute("type", "text/css");
    linkElem.setAttribute("charset", "utf-8");
    // Attach the created element to the shadow dom
    shadow.appendChild(linkElem);

    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
mode-selector {
  --circ-basew: ${this.circWidth};
  --border-size: ${this.borderSize};
  display: flex;
}`)
    );
    this.appendChild(style);

    this.selected = new ModeCircle(this); //document.createElement("div");
    this.selected.className = "selected circ";
    shadow.appendChild(this.selected);

    this.choiceArray = document.createElement("div");
    this.choiceArray.className = "choice-array";
    shadow.appendChild(this.choiceArray);
    let selID = window.localStorage.getItem(`mode-selector: ${this.name}`);

    let makeChoice = (id, backgroundColor, selector) => {
      let choice = new ModeCircle(this);
      choice.className = "choice circ";
      choice.id = id;
      choice.onclick = selector.newSelection;
      choice.style.backgroundColor = backgroundColor;
      return choice;
    };

    if (["gradient", "random"].includes(this.choices)) {
      this.default = parseInt(this.default);

      for (let x of Array(this.n).keys()) {
        let bkg = null;
        switch (this.choices) {
          case "gradient":
            bkg = `hsl(100, 50%, ${(x / n) * 50 + 20}%)`;
            break;
          case "random":
            bkg =
              "#" + (((1 << 24) * Math.random()) | 0).toString(16).padEnd(6, 0);
            break;
        }
        this.choiceArray.appendChild(makeChoice(x, bkg, this));
      }
    } else {
      let choices = JSON.parse(this.choices);
      this.n = Object.keys(choices).length;
      for (const [id, bkg] of Object.entries(choices)) {
        this.choiceArray.appendChild(makeChoice(id, bkg, this));
      }
      selID = Object.keys(choices).indexOf(selID);
      let d = parseInt(this.default);
      if (Number.isNaN(d)) {
        this.default = Object.keys(choices).indexOf(this.default);
        console.log(this.default, d);
      } else {
        this.default = d;
      }
    }

    // if selID not yet initialied choose the first one
    if (selID === -1 || selID === null) {
      selID = this.default;
    }
    console.log(this.default);
    this.selected.style.backgroundColor = this.choiceArray.childNodes[
      selID
    ].style.backgroundColor;
    // if there is a callback associated let's call it immediately
    eval(this.callback)(this.choiceArray.childNodes[selID].id);
  }

  async openCirc() {
    if (!this.open) {
      // append elements
      this.choiceArray.className = "choice-array";
      for (let [i, choice] of this.choiceArray.childNodes.entries()) {
        setTimeout(() => {
          let x = 0;
          if (this.n > 1) {
            x = parseInt(i) / (this.n - 1);
          }
          let top = 0;
          let left = 0;
          switch (this.geometry) {
            case "circle":
              top = 2 * Math.sin(x * Math.PI);
              left = -2 * Math.cos(x * Math.PI);
              break;
            case "parabola":
            default:
              top = 1 + 2.0 * x * (1 - x);
              left = 4.0 * (x - 0.5);
          }
          choice.oldClass = choice.className;
          choice.className += " open";
          choice.style.top = `calc(var(--circ-sp)*${top})`;
          choice.style.left = `calc(50% + var(--circ-sp)*${left} - 0.5*var(--circw) - var(--border-size))`;
        }, 1);
        await sleep(500 / this.n);
      }
    } else {
      for (let choice of this.choiceArray.childNodes) {
        setTimeout(() => {
          choice.className = choice.oldClass;
          delete choice.oldClass;
          choice.style.top = "";
          choice.style.left = "";
        }, 1);
        await sleep(500 / this.n);
      }
    }
    this.open = !this.open;
  }

  async selection(choice) {
    if (choice !== this.selected) {
      this.selected.style.backgroundColor = choice.style.backgroundColor;

      eval(this.callback)(choice.id);

      window.localStorage.setItem(`mode-selector: ${this.name}`, choice.id);
    }
    this.openCirc(this.selector);
  }
}

customElements.define("mode-selector", ModeSelector);
