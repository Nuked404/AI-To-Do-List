export class AISuggestionManager {
  constructor() {
    this.suggestBtn = document.getElementById("suggestBtn");
    this.altSuggestBtn = document.getElementById("altSuggestBtn");
    this.motiBtn = document.getElementById("motiBtn");
    this.suggestionOutput = document.getElementById("suggestionOutput");
    this.altSuggestionOutput = document.getElementById("altSuggestionOutput");
    this.motiOutput = document.getElementById("motiOutput");
    this.userId = localStorage.getItem("user_id");

    this.initButtons();
    this.loadUserDataAndSuggestions(); // Load on init
    this.suggestBtn.addEventListener("click", () => this.generateSuggestion());
    this.altSuggestBtn.addEventListener("click", () =>
      this.generateAltSuggestion()
    );
    this.motiBtn.addEventListener("click", () => this.getMotivationalMessage());
  }

  initButtons() {
    const moodButtons = document.querySelectorAll("#moodButtons .btn");
    const energyButtons = document.querySelectorAll("#energyButtons .btn");

    moodButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        moodButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedMood = btn.dataset.value;
        this.updateUserData("mood"); // Update only mood
      });
    });

    energyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        energyButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedEnergy = btn.dataset.value;
        this.updateUserData("energy"); // Update only energy
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
      await fetch(`http://localhost:8000/user_data/${this.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  }

  async loadUserDataAndSuggestions() {
    const userDataResponse = await fetch(
      `http://localhost:8000/user_data/${this.userId}`
    );
    const suggestionResponse = await fetch(
      `http://localhost:8000/suggestions/${this.userId}`
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
    const buttons = document.querySelectorAll(`${selector} .btn`);
    buttons.forEach((btn) => {
      if (btn.dataset.value === value) btn.classList.add("active");
      else btn.classList.remove("active");
    });
  }

  async generateSuggestion() {
    if (this.selectedMood || this.selectedEnergy) {
      const response = await fetch(
        `http://localhost:8000/suggestions/${this.userId}`,
        { method: "POST" }
      );
      this.currentSuggestion = await response.json();
      this.updateOutputs();
    } else {
      this.suggestionOutput.textContent =
        "Please select a mood or energy level.";
      this.suggestionOutput.style.display = "block";
    }
  }

  async generateAltSuggestion() {
    if (this.currentSuggestion) {
      this.altSuggestionOutput.textContent =
        this.currentSuggestion.current_alternative_suggestion;
      this.altSuggestionOutput.style.display = "block";
    }
  }

  async getMotivationalMessage() {
    const response = await fetch(
      `http://localhost:8000/suggestions/motivation/${this.userId}`
    );
    const data = await response.json();
    this.motiOutput.textContent = data.motivational_message;
    this.motiOutput.style.display = "block";
    if (this.currentSuggestion)
      this.currentSuggestion.current_moti_message = data.motivational_message;
  }

  updateOutputs() {
    this.suggestionOutput.textContent =
      this.currentSuggestion?.current_suggestion || "";
    this.altSuggestionOutput.textContent = "";
    this.motiOutput.textContent =
      this.currentSuggestion?.current_moti_message || "";
    this.suggestionOutput.style.display = this.currentSuggestion
      ?.current_suggestion
      ? "block"
      : "none";
    this.altSuggestionOutput.style.display = "none"; // Only show alt when explicitly requested
    this.motiOutput.style.display = this.currentSuggestion?.current_moti_message
      ? "block"
      : "none";
  }
}
