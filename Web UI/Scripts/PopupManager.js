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
    document.getElementById("taskTitle").value = task?.title || "";
    document.getElementById("taskType").value = task?.task_type || "Mental";
    document.getElementById("taskETATime").value = task?.eta_time || "";
    document.getElementById("taskPriority").value = task?.priority || "Normal";
    document.getElementById("taskStatus").value = task?.status || "Pending";
    document.getElementById("taskDueDate").value = task?.due_date || "";
    this.submitTaskBtn.textContent = task ? "Update Task" : "Add Task";
    this.editingId = taskId;
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
      task_type:
        document.getElementById("taskType").value.charAt(0).toUpperCase() +
        document.getElementById("taskType").value.slice(1), // "physical" -> "Physical"
      eta_time: document.getElementById("taskETATime").value,
      priority:
        document.getElementById("taskPriority").value.charAt(0).toUpperCase() +
        document.getElementById("taskPriority").value.slice(1), // "normal" -> "Normal"
      status:
        document.getElementById("taskStatus").value.charAt(0).toUpperCase() +
        document.getElementById("taskStatus").value.slice(1), // "pending" -> "Pending"
      due_date: document.getElementById("taskDueDate").value || null,
    };

    if (task.title && task.eta_time) {
      if (this.editingId !== null) {
        await this.taskManager.editTask(this.editingId, task);
      } else {
        await this.taskManager.addTask(task);
      }
      this.hidePopup();
    }
  }
}
