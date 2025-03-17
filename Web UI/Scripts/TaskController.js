export class TaskController {
  constructor(taskManager, taskRenderer, popupManager) {
    this.taskManager = taskManager;
    this.taskRenderer = taskRenderer;
    this.popupManager = popupManager;
  }

  async moveToTop(taskId) {
    await this.updatePosition(taskId, 0);
    await this.taskManager.fetchTasks();
    this.taskRenderer.render();
  }

  async moveUp(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    if (task.position > 0) {
      await this.updatePosition(taskId, task.position - 1);
      await this.taskManager.fetchTasks();
      this.taskRenderer.render();
    }
  }

  async moveToPosition(taskId, position) {
    await this.updatePosition(taskId, parseInt(position));
    await this.taskManager.fetchTasks();
    this.taskRenderer.render();
  }

  async moveDown(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    const sectionTasks = this.taskManager.tasks.filter(
      (t) => t.priority === task.priority
    );
    if (task.position < sectionTasks.length - 1) {
      await this.updatePosition(taskId, task.position + 1);
      await this.taskManager.fetchTasks();
      this.taskRenderer.render();
    }
  }

  async moveToBottom(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    const sectionTasks = this.taskManager.tasks.filter(
      (t) => t.priority === task.priority
    );
    await this.updatePosition(taskId, sectionTasks.length - 1);
    await this.taskManager.fetchTasks();
    this.taskRenderer.render();
  }

  async updatePosition(taskId, position) {
    await fetch(`http://localhost:8000/tasks/position/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: position }),
    });
  }

  async editTask(taskId) {
    const task = this.taskManager.tasks.find((t) => t.id === taskId);
    this.popupManager.showPopup("Edit Task", task, taskId);
    // Rendering happens in PopupManager.submitTask
  }

  async deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
      await this.taskManager.deleteTask(taskId);
      await this.taskManager.fetchTasks();
      this.taskRenderer.render();
    }
  }

  async toggleComplete(taskId) {
    await this.taskManager.toggleComplete(taskId);
    await this.taskManager.fetchTasks();
    this.taskRenderer.render();
  }
}
