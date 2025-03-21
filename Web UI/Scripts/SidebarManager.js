export class SidebarManager {
  constructor(taskRenderer) {
    this.taskRenderer = taskRenderer;
    this.menuToggle = document.getElementById("menuToggle");
    this.sidebar = document.getElementById("sidebar");
    this.pendingTasksLink = document.getElementById("pendingTasksLink");
    this.dueTodayLink = document.getElementById("dueTodayLink");
    this.completedTasksLink = document.getElementById("completedTasksLink");
    this.allTasksLink = document.getElementById("allTasksLink");

    this.currentFilter = "pending"; // Default to pending

    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () => this.toggleSidebar());
    }

    this.initEventListeners();
    this.updateSelection(); // Set initial selection
  }

  initEventListeners() {
    this.pendingTasksLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.setFilter("pending");
    });
    this.dueTodayLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.setFilter("dueToday");
    });
    this.completedTasksLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.setFilter("completed");
    });
    this.allTasksLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.setFilter("all");
    });
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.updateSelection();
    this.taskRenderer.render(); // Trigger re-render with new filter
  }

  updateSelection() {
    const links = [
      this.pendingTasksLink,
      this.dueTodayLink,
      this.completedTasksLink,
      this.allTasksLink,
    ];
    links.forEach((link) => {
      link.classList.remove("bg-blue-100", "text-blue-600");
      link.classList.add("hover:bg-blue-100", "hover:text-blue-600");
    });
    const selectedLink = this.getLinkForFilter(this.currentFilter);
    selectedLink.classList.add("bg-blue-100", "text-blue-600");
    selectedLink.classList.remove("hover:bg-blue-100", "hover:text-blue-600");
  }

  getLinkForFilter(filter) {
    switch (filter) {
      case "pending":
        return this.pendingTasksLink;
      case "dueToday":
        return this.dueTodayLink;
      case "completed":
        return this.completedTasksLink;
      case "all":
        return this.allTasksLink;
      default:
        return this.pendingTasksLink; // Default to pending
    }
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
  }

  getCurrentFilter() {
    return this.currentFilter;
  }
}
