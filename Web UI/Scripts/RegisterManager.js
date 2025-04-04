import { API_BASE_URL } from "./Config.js";

class RegisterManager {
  constructor() {
    document
      .getElementById("registerForm")
      .addEventListener("submit", (e) => this.handleRegister(e));
  }

  async handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = "login.html";
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("An error occurred");
    }
  }
}

new RegisterManager();
