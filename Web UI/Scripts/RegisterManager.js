import {
  API_BASE_URL,
  OTP_REQUEST_ENDPOINT,
  OTP_VERIFY_ENDPOINT,
} from "./Config.js";

class RegisterManager {
  constructor() {
    this.step = "form"; // form -> otp -> complete
    this.email = "";
    this.username = "";
    this.password = "";
    this.form = document.getElementById("registerForm");
    this.otpSection = document.getElementById("otpSection");
    this.formSection = document.getElementById("formSection");
    this.form.addEventListener("submit", (e) => this.handleStep(e));
    document
      .getElementById("verifyOtpBtn")
      .addEventListener("click", () => this.verifyOtp());
  }

  async handleStep(e) {
    e.preventDefault();
    if (this.step === "form") {
      this.username = document.getElementById("registerUsername").value;
      this.email = document.getElementById("registerEmail").value;
      this.password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById(
        "registerConfirmPassword"
      ).value;

      if (this.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch(OTP_REQUEST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, purpose: "Registration" }),
        });
        const data = await response.json();
        if (response.ok) {
          if (data.debug_content) alert(data.debug_content); // Show OTP if email is disabled
          this.step = "otp";
          this.formSection.classList.add("hidden");
          this.otpSection.classList.remove("hidden");
        } else {
          alert(data.detail || "Failed to request OTP");
        }
      } catch (error) {
        console.error("OTP request error:", error);
        alert("An error occurred");
      }
    }
  }

  async verifyOtp() {
    const otpCode = document.getElementById("otpCode").value;
    try {
      const response = await fetch(OTP_VERIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          otp_code: otpCode,
          purpose: "Registration",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await this.completeRegistration();
      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("An error occurred");
    }
  }

  async completeRegistration() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.username,
          email: this.email,
          password: this.password,
        }),
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
