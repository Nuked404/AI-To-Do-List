import {
  API_BASE_URL,
  OTP_REQUEST_ENDPOINT,
  OTP_VERIFY_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "./Config.js";

class ResetPasswordManager {
  constructor() {
    this.step = "email"; // email -> otp -> reset
    this.email = "";
    this.form = document.getElementById("resetForm");
    this.emailSection = document.getElementById("emailSection");
    this.otpSection = document.getElementById("otpSection");
    this.resetSection = document.getElementById("resetSection");
    this.form.addEventListener("submit", (e) => this.handleStep(e));
    document
      .getElementById("verifyOtpBtn")
      .addEventListener("click", () => this.verifyOtp());
    document
      .getElementById("submitResetBtn")
      .addEventListener("click", () => this.resetPassword());
  }

  async handleStep(e) {
    e.preventDefault();
    if (this.step === "email") {
      this.email = document.getElementById("resetEmail").value;
      try {
        const response = await fetch(OTP_REQUEST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, purpose: "PasswordReset" }),
        });
        const data = await response.json();
        if (response.ok) {
          if (data.debug_content) alert(data.debug_content);
          this.step = "otp";
          this.emailSection.classList.add("hidden");
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
          purpose: "PasswordReset",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        this.step = "reset";
        this.otpSection.classList.add("hidden");
        this.resetSection.classList.remove("hidden");
      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("An error occurred");
    }
  }

  async resetPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmNewPassword").value;
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(RESET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password reset successful!");
        window.location.href = "login.html";
      } else {
        alert(data.detail || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("An error occurred");
    }
  }
}

new ResetPasswordManager();
