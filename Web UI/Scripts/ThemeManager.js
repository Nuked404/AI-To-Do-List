export class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
    this.loadTheme();
  }

  toggleTheme() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
  }

  loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
    }
  }
}
