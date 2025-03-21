export class SidebarManager {
  constructor() {
    this.menuToggle = document.getElementById("menuToggle");
    this.sidebar = document.getElementById("sidebar");
    if (this.menuToggle)
      this.menuToggle.addEventListener("click", () => this.toggleSidebar());
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
  }
}
