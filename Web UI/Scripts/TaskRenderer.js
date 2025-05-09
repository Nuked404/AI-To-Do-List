export class TaskRenderer {
  constructor(taskManager, sidebarManager) {
    this.taskManager = taskManager;
    this.sidebarManager = sidebarManager;
    this.taskSectionsElement = document.getElementById("taskSections");
    this.criticalTasksElement = document.getElementById("criticalTasks");
    this.highTasksElement = document.getElementById("highTasks");
    this.normalTasksElement = document.getElementById("normalTasks");
    this.lowTasksElement = document.getElementById("lowTasks");
    this.criticalCountElement = document.getElementById("criticalCount");
    this.highCountElement = document.getElementById("highCount");
    this.normalCountElement = document.getElementById("normalCount");
    this.lowCountElement = document.getElementById("lowCount");
    this.criticalSectionHeader = document.getElementById(
      "criticalSectionHeader"
    );
    this.highSectionHeader = document.getElementById("highSectionHeader");
    this.normalSectionHeader = document.getElementById("normalSectionHeader");
    this.lowSectionHeader = document.getElementById("lowSectionHeader");
    this.hideEmptyCheckbox = document.getElementById("hideEmptyCategories");
    this.pendingCountElement = document.getElementById("pendingCount");
    this.dueTodayCountElement = document.getElementById("dueTodayCount");
    this.completedCountElement = document.getElementById("completedCount");
    this.allTasksCountElement = document.getElementById("allTasksCount");

    const hideEmptyDefault = localStorage.getItem("hideEmptyCategories");
    this.hideEmptyCheckbox.checked =
      hideEmptyDefault === null ? true : hideEmptyDefault === "true";
    this.hideEmptyCheckbox.addEventListener("change", () => {
      localStorage.setItem(
        "hideEmptyCategories",
        this.hideEmptyCheckbox.checked
      );
      this.render();
    });

    window.addEventListener("notificationRang", (event) =>
      this.updateTaskCard(event.detail.taskId)
    );
    window.addEventListener("notificationReset", (event) =>
      this.updateTaskCard(event.detail.taskId)
    );
  }

  render() {
    console.log("Rendering tasks:", this.taskManager.tasks);
    this.criticalTasksElement.innerHTML = "";
    this.highTasksElement.innerHTML = "";
    this.normalTasksElement.innerHTML = "";
    this.lowTasksElement.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];
    let filteredTasks = this.taskManager.tasks;
    const filter = this.sidebarManager.getCurrentFilter();

    switch (filter) {
      case "pending":
        filteredTasks = this.taskManager.tasks.filter(
          (t) => t.status === "Pending"
        );
        break;
      case "dueToday":
        filteredTasks = this.taskManager.tasks.filter(
          (t) => t.due_date && t.due_date.split("T")[0] === today
        );
        break;
      case "completed":
        filteredTasks = this.taskManager.tasks.filter(
          (t) => t.status === "Completed"
        );
        break;
      case "all":
        filteredTasks = this.taskManager.tasks;
        break;
      default:
        filteredTasks = this.taskManager.tasks.filter(
          (t) => t.status === "Pending"
        );
        break;
    }

    this.pendingCountElement.textContent = this.taskManager.tasks.filter(
      (t) => t.status === "Pending"
    ).length;
    this.dueTodayCountElement.textContent = this.taskManager.tasks.filter(
      (t) => t.due_date && t.due_date.split("T")[0] === today
    ).length;
    this.completedCountElement.textContent = this.taskManager.tasks.filter(
      (t) => t.status === "Completed"
    ).length;
    this.allTasksCountElement.textContent = this.taskManager.tasks.length;

    const criticalTasks = filteredTasks.filter(
      (t) => t.priority === "Critical"
    );
    const highTasks = filteredTasks.filter((t) => t.priority === "High");
    const normalTasks = filteredTasks.filter((t) => t.priority === "Normal");
    const lowTasks = filteredTasks.filter((t) => t.priority === "Low");

    const hideEmpty = this.hideEmptyCheckbox.checked;

    this.criticalSectionHeader.style.display = "none";
    this.criticalTasksElement.style.display = "none";
    this.highSectionHeader.style.display = "none";
    this.highTasksElement.style.display = "none";
    this.normalSectionHeader.style.display = "none";
    this.normalTasksElement.style.display = "none";
    this.lowSectionHeader.style.display = "none";
    this.lowTasksElement.style.display = "none";
    this.taskSectionsElement.style.display = "none";

    this.renderSection(
      criticalTasks,
      this.criticalSectionHeader,
      this.criticalTasksElement,
      this.criticalCountElement,
      hideEmpty
    );
    this.renderSection(
      highTasks,
      this.highSectionHeader,
      this.highTasksElement,
      this.highCountElement,
      hideEmpty
    );
    this.renderSection(
      normalTasks,
      this.normalSectionHeader,
      this.normalTasksElement,
      this.normalCountElement,
      hideEmpty
    );
    this.renderSection(
      lowTasks,
      this.lowSectionHeader,
      this.lowTasksElement,
      this.lowCountElement,
      hideEmpty
    );

    if (filteredTasks.length > 0 || !hideEmpty) {
      this.taskSectionsElement.style.display = "block";
    }
  }

  renderSection(
    tasks,
    headerElement,
    taskListElement,
    countElement,
    hideEmpty
  ) {
    if (tasks.length > 0) {
      headerElement.style.display = "flex";
      taskListElement.style.display = "grid";
      taskListElement.classList.remove(
        "flex",
        "flex-col",
        "md:flex-row",
        "space-y-4",
        "md:space-y-0",
        "md:space-x-4"
      );
      taskListElement.classList.add(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "gap-4"
      );
      taskListElement.innerHTML = "";
      tasks.forEach((task) => {
        taskListElement.appendChild(this.createTaskCard(task));
      });
      countElement.textContent = tasks.length;
    } else if (!hideEmpty) {
      headerElement.style.display = "flex";
      taskListElement.style.display = "grid";
      taskListElement.classList.remove(
        "flex",
        "flex-col",
        "md:flex-row",
        "space-y-4",
        "md:space-y-0",
        "md:space-x-4"
      );
      taskListElement.classList.add(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "gap-4"
      );
      taskListElement.innerHTML =
        "<p class='text-gray-500 p-4'>No tasks in this category.</p>";
      countElement.textContent = "0";
    } else {
      headerElement.style.display = "none";
      taskListElement.style.display = "none";
    }
  }

  createTaskCard(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "w-full",
      "min-w-0"
    );
    taskCard.dataset.taskId = task.id;

    let dueDateText = "No due date";
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      dueDateText = dueDate.toLocaleString("en-US", options).replace(",", "");
    }

    const hasRang =
      window.notificationManager &&
      window.notificationManager.hasRang(task.id, task.due_date);
    const bellColor = hasRang ? "text-red-500" : "text-yellow-500";
    const notificationIcon = task.should_notify
      ? `<i class="fas fa-bell ${bellColor} ml-2 cursor-pointer" title="Notification ${
          hasRang ? "has rung" : "scheduled"
        }" onclick="window.notificationManager.resetRangStatus(${
          task.id
        });"></i>`
      : "";

    taskCard.innerHTML = `
      <div class="flex flex-col space-y-2 md:flex-row md:items-start md:space-y-0 md:space-x-4">
        <!-- Title and Bell (Left on large screens, centered on small) -->
        <div class="flex items-center justify-center md:justify-start flex-1 min-w-0">
          <h3 class="text-xl font-bold text-black truncate">${
            task.title
          }${notificationIcon}</h3>
        </div>
        <!-- Buttons (Right on large screens, centered on small) -->
        <div class="flex flex-wrap justify-center md:justify-end space-x-2 shrink-0">
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.moveToTop(${
            task.id
          })">
            <i class="fas fa-angle-double-up"></i>
          </button>
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.moveUp(${
            task.id
          })">
            <i class="fas fa-angle-up"></i>
          </button>
          <span class="text-gray-600">${task.position}</span>
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.moveDown(${
            task.id
          })">
            <i class="fas fa-angle-down"></i>
          </button>
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.moveToBottom(${
            task.id
          })">
            <i class="fas fa-angle-double-down"></i>
          </button>
          <div class="h-6 w-px bg-gradient-to-b from-transparent via-gray-500 to-transparent mx-2"></div>
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.editTask(${
            task.id
          })">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-gray-500 hover:text-gray-700" onclick="taskController.deleteTask(${
            task.id
          })">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <!-- Details (Below on all screens) -->
      <div class="space-y-2 mt-2">
        <p class="text-gray-600 truncate">Type: ${task.task_type} | ETA: ${
      task.eta_time
    }</p>
        <p class="text-gray-600 truncate">Due: ${dueDateText}</p>
        <p class="text-gray-600 truncate">Notify: ${
          task.should_notify ? "Yes" : "No"
        }${task.notify_when ? ` (${task.notify_when})` : ""}</p>
        <div class="flex items-center justify-center md:justify-start space-x-2 flex-wrap">
          <span class="bg-${
            task.status === "Pending"
              ? "yellow"
              : task.status === "Ongoing"
              ? "blue"
              : "green"
          }-100 text-${
      task.status === "Pending"
        ? "yellow"
        : task.status === "Ongoing"
        ? "blue"
        : "green"
    }-600 px-2 py-1 rounded-full">${task.status}</span>
          <button class="bg-${
            task.status === "Completed" ? "red" : "green"
          }-100 text-${
      task.status === "Completed" ? "red" : "green"
    }-600 px-2 py-1 rounded-full hover:bg-${
      task.status === "Completed" ? "red" : "green"
    }-200 flex items-center" onclick="taskController.toggleComplete(${
      task.id
    })">
            <i class="fas fa-${
              task.status === "Completed" ? "undo" : "check"
            } mr-1"></i>
            ${task.status === "Completed" ? "Mark Incomplete" : "Complete"}
          </button>
        </div>
      </div>
    `;
    return taskCard;
  }

  updateTaskCard(taskId) {
    const taskCard = document.querySelector(`div[data-task-id="${taskId}"]`);
    if (!taskCard) return;

    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const hasRang =
      window.notificationManager &&
      window.notificationManager.hasRang(task.id, task.due_date);
    const bellColor = hasRang ? "text-red-500" : "text-yellow-500";
    const bellIcon = taskCard.querySelector(".fa-bell");
    if (bellIcon) {
      bellIcon.classList.remove("text-red-500", "text-yellow-500");
      bellIcon.classList.add(bellColor);
      bellIcon.title = `Notification ${hasRang ? "has rung" : "scheduled"}`;
    }
  }
}
