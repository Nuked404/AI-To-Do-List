import { API_BASE_URL } from "./Config.js";

export class AISuggestionManager {
  constructor() {
    this.suggestBtn = document.getElementById("suggestBtn");
    this.toggleAltLeft = document.getElementById("toggleAltLeft");
    this.toggleAltRight = document.getElementById("toggleAltRight");
    this.motiBtn = document.getElementById("motiBtn");
    this.suggestionOutput = document.getElementById("suggestionOutput");
    this.altSuggestionOutput = document.getElementById("altSuggestionOutput");
    this.motiOutput = document.getElementById("motiOutput");
    this.userId = localStorage.getItem("user_id");

    this.initButtons();
    this.loadUserDataAndSuggestions();
    this.suggestBtn.addEventListener("click", () => this.generateSuggestion());
    this.toggleAltRight.addEventListener("click", () =>
      this.showAltSuggestion()
    );
    this.toggleAltLeft.addEventListener("click", () =>
      this.showMainSuggestion()
    );
    this.motiBtn.addEventListener("click", () =>
      this.generateMotivationalMessage()
    );
  }

  initButtons() {
    const moodButtons = document.querySelectorAll("#moodButtons button"); // Updated selector
    const energyButtons = document.querySelectorAll("#energyButtons button"); // Updated selector

    moodButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        moodButtons.forEach((b) => b.classList.remove("selected")); // Use 'selected' class from CSS
        btn.classList.add("selected");
        this.selectedMood = btn.dataset.value;
        this.updateUserData("mood");
      });
    });

    energyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        energyButtons.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        this.selectedEnergy = btn.dataset.value;
        this.updateUserData("energy");
      });
    });
  }

  async updateUserData(type) {
    const payload = {};
    if (type === "mood" && this.selectedMood)
      payload.current_mood = this.selectedMood;
    if (type === "energy" && this.selectedEnergy)
      payload.current_energy = this.selectedEnergy;

    if (Object.keys(payload).length > 0) {
      await fetch(`${API_BASE_URL}/user_data/${this.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  }

  async loadUserDataAndSuggestions() {
    const userDataResponse = await fetch(
      `${API_BASE_URL}/user_data/${this.userId}`
    );
    const suggestionResponse = await fetch(
      `${API_BASE_URL}/suggestions/${this.userId}`
    );

    if (userDataResponse.ok) {
      const userData = await userDataResponse.json();
      this.selectedMood = userData.current_mood;
      this.selectedEnergy = userData.current_energy;
      this.setActiveButton("#moodButtons", this.selectedMood);
      this.setActiveButton("#energyButtons", this.selectedEnergy);
    }

    if (suggestionResponse.ok) {
      const suggestion = await suggestionResponse.json();
      this.currentSuggestion = suggestion;
      this.updateOutputs();
    }
  }

  setActiveButton(selector, value) {
    const buttons = document.querySelectorAll(`${selector} button`);
    buttons.forEach((btn) => {
      if (btn.dataset.value === value) btn.classList.add("selected");
      else btn.classList.remove("selected");
    });
  }

  async generateSuggestion() {
    if (this.selectedMood || this.selectedEnergy) {
      const response = await fetch(
        `${API_BASE_URL}/suggestions/${this.userId}`,
        {
          method: "POST",
        }
      );
      this.currentSuggestion = await response.json();
      this.showMainSuggestion();
      this.updateOutputs();
    } else {
      this.suggestionOutput.querySelector("p").textContent =
        "Please select a mood or energy level.";
    }
  }

  showMainSuggestion() {
    if (this.currentSuggestion) {
      this.suggestionOutput.querySelector("p").textContent =
        this.currentSuggestion.current_suggestion || "";
      this.altSuggestionOutput.classList.add("hidden");
      this.suggestionOutput.classList.remove("hidden");
      this.toggleAltLeft.classList.add("hidden");
      this.toggleAltRight.classList.remove("hidden");
      this.suggestionOutput.style.transform = "translateX(0)";
      this.altSuggestionOutput.style.transform = "translateX(100%)";
    }
  }

  async showAltSuggestion() {
    if (this.currentSuggestion) {
      const altText = this.currentSuggestion.current_alternative_suggestion;
      if (altText) {
        this.altSuggestionOutput.querySelector("p").textContent = altText;
        this.suggestionOutput.classList.add("hidden");
        this.altSuggestionOutput.classList.remove("hidden");
        this.toggleAltRight.classList.add("hidden");
        this.toggleAltLeft.classList.remove("hidden");
        this.suggestionOutput.style.transform = "translateX(-100%)";
        this.altSuggestionOutput.style.transform = "translateX(0)";
      }
    }
  }

  async generateMotivationalMessage() {
    // Updated method
    const response = await fetch(
      `${API_BASE_URL}/suggestions/motivation/${this.userId}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const data = await response.json();
      this.motiOutput.querySelector("p").textContent =
        data.motivational_message;
      if (this.currentSuggestion)
        this.currentSuggestion.current_moti_message = data.motivational_message;
    } else {
      this.motiOutput.querySelector("p").textContent =
        "Couldn’t get a motivational boost right now.";
    }
  }

  updateOutputs() {
    this.suggestionOutput.querySelector("p").textContent =
      this.currentSuggestion?.current_suggestion ||
      "Click 'Get Suggestion' to start!";
    this.altSuggestionOutput.querySelector("p").textContent =
      this.currentSuggestion?.current_alternative_suggestion ||
      "No backup suggestion yet.";
    this.motiOutput.querySelector("p").textContent =
      this.currentSuggestion?.current_moti_message ||
      "Click 'Get Motivation' for a boost!";
    this.altSuggestionOutput.classList.add("hidden");
    this.suggestionOutput.classList.remove("hidden");
    this.toggleAltLeft.classList.add("hidden");
    this.toggleAltRight.classList.remove("hidden");
  }
}
