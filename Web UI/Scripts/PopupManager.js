export class PopupManager {
  constructor(taskManager, taskRenderer) {
    this.taskManager = taskManager;
    this.taskRenderer = taskRenderer;
    this.popup = document.getElementById("taskPopup");
    this.overlay = document.getElementById("overlay");
    this.newTaskBtn = document.getElementById("newTaskBtn");
    this.submitTaskBtn = document.getElementById("submitTaskBtn");
    this.popupTitle = document.getElementById("popupTitle");
    this.editingId = null;

    this.newTaskBtn.addEventListener("click", () =>
      this.showPopup("Add New Task")
    );
    this.overlay.addEventListener("click", () => this.hidePopup());
    this.submitTaskBtn.addEventListener("click", () => this.submitTask());
  }

  showPopup(title, task = null, taskId = null) {
    this.popupTitle.textContent = title;
    const taskTitle = document.getElementById("taskTitle");
    const taskType = document.getElementById("taskType");
    const taskETATime = document.getElementById("taskETATime");
    const taskPriority = document.getElementById("taskPriority");
    const taskDueDate = document.getElementById("taskDueDate");

    if (task) {
      taskTitle.value = task.title || "";
      taskType.value = task.task_type || "Mental";
      taskETATime.value = task.eta_time || "";
      taskPriority.value = task.priority || "Normal";
      taskDueDate.value = task.due_date ? task.due_date.split("T")[0] : "";
      this.editingId = taskId;
      this.submitTaskBtn.textContent = "Update Task";
    } else {
      taskTitle.value = "";
      taskType.value = "Mental";
      taskETATime.value = "";
      taskPriority.value = "Normal";
      taskDueDate.value = new Date().toISOString().split("T")[0];
      this.editingId = null;
      this.submitTaskBtn.textContent = "Add Task";
    }

    this.popup.style.display = "block";
    this.overlay.style.display = "block";
  }

  hidePopup() {
    this.popup.style.display = "none";
    this.overlay.style.display = "none";
  }

  async submitTask() {
    const task = {
      title: document.getElementById("taskTitle").value,
      task_type: document.getElementById("taskType").value,
      eta_time: document.getElementById("taskETATime").value,
      priority: document.getElementById("taskPriority").value,
      status: "Pending", // Always Pending for new tasks
      due_date: document.getElementById("taskDueDate").value || null,
    };

    if (task.title && task.eta_time) {
      if (this.editingId !== null) {
        await this.taskManager.editTask(this.editingId, task);
      } else {
        await this.taskManager.addTask(task);
      }
      await this.taskManager.fetchTasks(); // Refresh after submission
      this.taskRenderer.render();
      this.hidePopup();
    }
  }
}
