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

    // Initialize sidebar state: collapsed on small screens by default
    if (window.innerWidth < 768) {
      // Tailwind 'md' breakpoint
      this.sidebar.classList.add("hidden");
    }

    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () => this.toggleSidebar());
    }

    this.initEventListeners();
    this.updateSelection(); // Set initial selection

    // Handle window resize to adjust sidebar visibility
    window.addEventListener("resize", () => this.handleResize());
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
    this.sidebar.classList.toggle("hidden");
    const icon = this.menuToggle.querySelector("i");
    if (this.sidebar.classList.contains("hidden")) {
      icon.classList.replace("fa-angle-left", "fa-angle-right");
    } else {
      icon.classList.replace("fa-angle-right", "fa-angle-left");
    }
  }

  handleResize() {
    if (window.innerWidth >= 768) {
      // On medium+ screens, always show sidebar and hide toggle
      this.sidebar.classList.remove("hidden");
      this.menuToggle.classList.add("hidden");
    } else {
      // On small screens, collapse sidebar by default and show toggle
      this.sidebar.classList.add("hidden");
      this.menuToggle.classList.remove("hidden");
      const icon = this.menuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  }

  getCurrentFilter() {
    return this.currentFilter;
  }
}
