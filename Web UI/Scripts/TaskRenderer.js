export class TaskRenderer {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.criticalTasksElement = document.getElementById("criticalTasks");
    this.highTasksElement = document.getElementById("highTasks");
    this.normalTasksElement = document.getElementById("normalTasks");
    this.lowTasksElement = document.getElementById("lowTasks");
    this.criticalCountElement = document.getElementById("criticalCount");
    this.highCountElement = document.getElementById("highCount");
    this.normalCountElement = document.getElementById("normalCount");
    this.lowCountElement = document.getElementById("lowCount");
    // Reference the section containers
    this.criticalSection =
      document.querySelector("#criticalTasks").parentElement;
    this.highSection = document.querySelector("#highTasks").parentElement;
    this.normalSection = document.querySelector("#normalTasks").parentElement;
    this.lowSection = document.querySelector("#lowTasks").parentElement;
  }

  render() {
    // Clear existing content
    this.criticalTasksElement.innerHTML = "";
    this.highTasksElement.innerHTML = "";
    this.normalTasksElement.innerHTML = "";
    this.lowTasksElement.innerHTML = "";

    // Filter tasks by priority
    const criticalTasks = this.taskManager.tasks.filter(
      (t) => t.priority === "Critical"
    );
    const highTasks = this.taskManager.tasks.filter(
      (t) => t.priority === "High"
    );
    const normalTasks = this.taskManager.tasks.filter(
      (t) => t.priority === "Normal"
    );
    const lowTasks = this.taskManager.tasks.filter((t) => t.priority === "Low");

    // Toggle visibility and render tasks for each section
    this.renderSection(
      criticalTasks,
      this.criticalSection,
      this.criticalTasksElement,
      this.criticalCountElement
    );
    this.renderSection(
      highTasks,
      this.highSection,
      this.highTasksElement,
      this.highCountElement
    );
    this.renderSection(
      normalTasks,
      this.normalSection,
      this.normalTasksElement,
      this.normalCountElement
    );
    this.renderSection(
      lowTasks,
      this.lowSection,
      this.lowTasksElement,
      this.lowCountElement
    );
  }

  renderSection(tasks, sectionElement, taskListElement, countElement) {
    if (tasks.length > 0) {
      // Show section and render tasks
      sectionElement.style.display = "block";
      tasks.forEach((task, index) => {
        taskListElement.appendChild(
          this.createTaskCard(task, index, tasks.length)
        );
      });
      countElement.textContent = tasks.length;
    } else {
      // Hide section if no tasks
      sectionElement.style.display = "none";
    }
  }

  createTaskCard(task, index, sectionLength) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.innerHTML = `
      <div class="control-sleeve">
        <button class="control-btn to-top" onclick="taskController.moveToTop(${
          task.id
        })"><i class="fas fa-step-backward"></i></button>
        <button class="control-btn up" onclick="taskController.moveUp(${
          task.id
        })"><i class="fas fa-play"></i></button>
        <input type="number" class="position-input" value="${
          task.position
        }" min="0" max="${
      sectionLength - 1
    }" onchange="taskController.moveToPosition(${task.id}, this.value)">
        <button class="control-btn down" onclick="taskController.moveDown(${
          task.id
        })"><i class="fas fa-play"></i></button>
        <button class="control-btn to-bottom" onclick="taskController.moveToBottom(${
          task.id
        })"><i class="fas fa-step-forward"></i></button>
      </div>
      ${
        task.priority === "Critical"
          ? '<div class="critical-indicator"></div>'
          : ""
      }
      <h3>${task.title}</h3>
      <p>Type: ${task.task_type} | ETA: ${task.eta_time}</p>
      <div class="due-date">Due: ${task.due_date || "No due date"}</div>
      <span class="task-status status-${task.status.toLowerCase()}">${
      task.status
    }</span>
      <div class="task-actions">
        <button class="action-btn edit-btn" onclick="taskController.editTask(${
          task.id
        })">Edit</button>
        <button class="action-btn delete-btn" onclick="taskController.deleteTask(${
          task.id
        })">Delete</button>
        <button class="action-btn complete-btn" onclick="taskController.toggleComplete(${
          task.id
        })">
          ${task.status === "Completed" ? "Mark Incomplete" : "Mark Complete"}
        </button>
      </div>
    `;
    return taskCard;
  }
}
