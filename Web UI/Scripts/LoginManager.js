import { API_BASE_URL } from "./Config.js";

class LoginManager {
  constructor() {
    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user_id", data.user_id);
        window.location.href = "index.html";
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred");
    }
  }
}

new LoginManager();
