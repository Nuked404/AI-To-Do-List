export class TaskController {
  constructor(taskManager, taskRenderer, popupManager) {
    this.taskManager = taskManager;
    this.taskRenderer = taskRenderer;
    this.popupManager = popupManager;
  }

  async moveToTop(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    await this.updatePosition(taskId, 0);
  }

  async moveUp(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    const sectionTasks = this.taskManager.tasks.filter(
      (t) => t.priority === task.priority
    );
    const index = sectionTasks.findIndex((t) => t.id === taskId);
    if (index > 0) {
      await this.updatePosition(taskId, sectionTasks[index - 1].position - 1);
    }
  }

  async moveToPosition(taskId, position) {
    await this.updatePosition(taskId, parseInt(position));
  }

  async moveDown(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    const sectionTasks = this.taskManager.tasks.filter(
      (t) => t.priority === task.priority
    );
    const index = sectionTasks.findIndex((t) => t.id === taskId);
    if (index < sectionTasks.length - 1) {
      await this.updatePosition(taskId, sectionTasks[index + 1].position + 1);
    }
  }

  async moveToBottom(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    const sectionTasks = this.taskManager.tasks.filter(
      (t) => t.priority === task.priority
    );
    const maxPosition = Math.max(...sectionTasks.map((t) => t.position));
    await this.updatePosition(taskId, maxPosition + 1);
  }

  async updatePosition(taskId, position) {
    await fetch(`http://localhost:8000/tasks/position/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position }),
    });
    await this.taskManager.fetchTasks();
  }

  editTask(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    this.popupManager.showPopup("Edit Task", task, taskId);
  }

  deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.taskManager.deleteTask(taskId);
    }
  }

  toggleComplete(taskId) {
    this.taskManager.toggleComplete(taskId);
  }
}
