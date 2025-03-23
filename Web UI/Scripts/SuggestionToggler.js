export class SuggestionToggler {
  constructor() {
    this.suggestionOutput = document.getElementById("suggestionOutput");
    this.altSuggestionOutput = document.getElementById("altSuggestionOutput");
    this.toggleAltRight = document.getElementById("toggleAltRight");
    this.toggleAltLeft = document.getElementById("toggleAltLeft");

    this.initEventListeners();
  }

  initEventListeners() {
    this.toggleAltRight.addEventListener("click", () => {
      this.suggestionOutput.classList.add("hidden");
      this.altSuggestionOutput.classList.remove("hidden");
      this.toggleAltLeft.classList.remove("hidden");
      this.suggestionOutput.style.transform = "translateX(-100%)";
      this.altSuggestionOutput.style.transform = "translateX(0)";
    });

    this.toggleAltLeft.addEventListener("click", () => {
      this.altSuggestionOutput.classList.add("hidden");
      this.suggestionOutput.classList.remove("hidden");
      this.toggleAltLeft.classList.add("hidden");
      this.suggestionOutput.style.transform = "translateX(0)";
      this.altSuggestionOutput.style.transform = "translateX(100%)";
    });
  }
}

new SuggestionToggler();
