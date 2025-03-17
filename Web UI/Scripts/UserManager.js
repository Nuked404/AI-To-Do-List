export class UserManager {
  constructor() {
    this.userId = localStorage.getItem("user_id");
    this.usernameElement = document.getElementById("username");
    this.loadUsername();
  }

  async loadUsername() {
    if (this.userId) {
      try {
        const response = await fetch(
          `http://localhost:8000/users/${this.userId}`
        );
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
