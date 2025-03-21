export class TaskManager {
  constructor() {
    this.tasks = [];
    this.userId = localStorage.getItem("user_id");
    this.fetchTasks(); // Initial fetch, rendering handled elsewhere
  }

  async fetchTasks() {
    try {
      const response = await fetch(
        `http://localhost:8000/tasks/${this.userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.tasks = await response.json();
      console.log("Tasks after fetch:", this.tasks);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      this.tasks = [];
    }
    return this.tasks;
  }

  async addTask(task) {
    const response = await fetch(`http://localhost:8000/tasks/${this.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const newTask = await response.json();
    this.tasks.push(newTask);
    return newTask;
  }

  async editTask(taskId, task) {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const updatedTask = await response.json();
    const index = this.tasks.findIndex((t) => t.id === taskId);
    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  async deleteTask(taskId) {
    await fetch(`http://localhost:8000/tasks/${taskId}`, { method: "DELETE" });
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
  }

  async toggleComplete(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    const updatedTask = {
      ...task,
      status: task.status === "Completed" ? "Pending" : "Completed",
    };
    await this.editTask(taskId, updatedTask);
  }

  getSectionTasks(priority) {
    return this.tasks.filter((t) => t.priority === priority);
  }
}
