export class AISuggestionManager {
  constructor() {
    this.suggestBtn = document.getElementById("suggestBtn");
    this.suggestionOutput = document.getElementById("suggestionOutput");
    this.toggleBtn = document.createElement("button");
    this.toggleBtn.className = "btn mt-2";
    this.toggleBtn.textContent = "Toggle Suggestion";
    this.motiBtn = document.createElement("button"); // New button
    this.motiBtn.className = "btn mt-2 ml-2";
    this.motiBtn.textContent = "Get Motivation";
    this.suggestionOutput.after(this.toggleBtn);
    this.toggleBtn.after(this.motiBtn);
    this.isMain = true;
    this.userId = localStorage.getItem("user_id");

    this.initButtons();
    this.suggestBtn.addEventListener("click", () => this.generateSuggestion());
    this.toggleBtn.addEventListener("click", () => this.toggleSuggestion());
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
        this.updateUserData();
      });
    });

    energyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        energyButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedEnergy = btn.dataset.value;
        this.updateUserData();
      });
    });
  }

  async updateUserData() {
    if (this.selectedMood && this.selectedEnergy) {
      await fetch(`http://localhost:8000/user_data/${this.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_mood: this.selectedMood,
          current_energy: this.selectedEnergy,
        }),
      });
    }
  }

  async generateSuggestion() {
    if (this.selectedMood && this.selectedEnergy) {
      const response = await fetch(
        `http://localhost:8000/suggestions/${this.userId}`,
        { method: "POST" }
      );
      const suggestion = await response.json();
      this.currentSuggestion = suggestion;
      this.isMain = true;
      this.suggestionOutput.textContent = `${suggestion.current_suggestion} - ${suggestion.current_moti_message}`;
    } else {
      this.suggestionOutput.textContent =
        "Please select both a mood and an energy level.";
    }
  }

  toggleSuggestion() {
    if (this.currentSuggestion) {
      this.isMain = !this.isMain;
      this.suggestionOutput.textContent = this.isMain
        ? `${this.currentSuggestion.current_suggestion} - ${this.currentSuggestion.current_moti_message}`
        : `${this.currentSuggestion.current_alternative_suggestion} - ${this.currentSuggestion.current_moti_message}`;
    }
  }

  async getMotivationalMessage() {
    const response = await fetch(
      `http://localhost:8000/suggestions/motivation/${this.userId}`
    );
    const data = await response.json();
    this.suggestionOutput.textContent = data.motivational_message;
  }
}
