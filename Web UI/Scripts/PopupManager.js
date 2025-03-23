// Web UI/Scripts/PopupManager.js
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
    const taskDueTime = document.getElementById("taskDueTime"); // New time input
    const shouldNotify = document.getElementById("shouldNotify"); // New checkbox
    const notifyWhen = document.getElementById("notifyWhen"); // New select

    if (task) {
      taskTitle.value = task.title || "";
      taskType.value = task.task_type || "Mental";
      taskETATime.value = task.eta_time || "";
      taskPriority.value = task.priority || "Normal";
      if (task.due_date) {
        const [date, time] = task.due_date.split("T");
        taskDueDate.value = date;
        taskDueTime.value = time ? time.split(".")[0] : "00:00";
      } else {
        taskDueDate.value = "";
        taskDueTime.value = "00:00";
      }
      shouldNotify.checked = task.should_notify || false;
      notifyWhen.value = task.notify_when || "";
      this.editingId = taskId;
      this.submitTaskBtn.textContent = "Update Task";
    } else {
      taskTitle.value = "";
      taskType.value = "Mental";
      taskETATime.value = "";
      taskPriority.value = "Normal";
      taskDueDate.value = new Date().toISOString().split("T")[0];
      taskDueTime.value = "00:00";
      shouldNotify.checked = false;
      notifyWhen.value = "";
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
    const existingTask =
      this.editingId !== null
        ? this.taskManager.tasks.find((t) => t.id === this.editingId)
        : null;
    const dueDate = document.getElementById("taskDueDate").value;
    const dueTime = document.getElementById("taskDueTime").value;
    const dueDateTime = dueDate && dueTime ? `${dueDate}T${dueTime}:00` : null;

    const task = {
      title: document.getElementById("taskTitle").value,
      task_type: document.getElementById("taskType").value,
      eta_time: document.getElementById("taskETATime").value,
      priority: document.getElementById("taskPriority").value,
      status: existingTask ? existingTask.status : "Pending",
      due_date: dueDateTime,
      position: existingTask ? existingTask.position : 0,
      should_notify: document.getElementById("shouldNotify").checked,
      notify_when: document.getElementById("notifyWhen").value || null,
    };
    if (task.title && task.eta_time) {
      if (this.editingId !== null) {
        await this.taskManager.editTask(this.editingId, task);
      } else {
        await this.taskManager.addTask(task);
      }
      await this.taskManager.fetchTasks();
      this.taskRenderer.render();
      this.hidePopup();
    }
  }
}
