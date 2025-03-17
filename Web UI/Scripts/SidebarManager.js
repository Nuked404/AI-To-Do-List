export class SidebarManager {
  constructor() {
    this.menuToggle = document.getElementById("menuToggle");
    this.sidebar = document.getElementById("sidebar");
    this.menuToggle.addEventListener("click", () => this.toggleSidebar());
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
  }
}
