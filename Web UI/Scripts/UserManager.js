import { API_BASE_URL } from "./Config.js";

export class UserManager {
  constructor() {
    this.userId = localStorage.getItem("user_id");
    this.usernameElement = document.getElementById("username");
    this.loadUsername();
  }

  async loadUsername() {
    if (this.userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${this.userId}`);
        if (response.ok) {
          const user = await response.json();
          this.usernameElement.textContent = user.name;
        } else {
          console.error("Failed to fetch user:", response.statusText);
          this.usernameElement.textContent = "User";
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        this.usernameElement.textContent = "User";
      }
    }
  }
}
