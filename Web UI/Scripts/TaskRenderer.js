export class TaskRenderer {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskSectionsElement = document.getElementById("taskSections");
    this.criticalTasksElement = document.getElementById("criticalTasks");
    this.highTasksElement = document.getElementById("highTasks");
    this.normalTasksElement = document.getElementById("normalTasks");
    this.lowTasksElement = document.getElementById("lowTasks");
    this.criticalCountElement = document.getElementById("criticalCount");
    this.highCountElement = document.getElementById("highCount");
    this.normalCountElement = document.getElementById("normalCount");
    this.lowCountElement = document.getElementById("lowCount");
    this.criticalSection =
      document.querySelector("#criticalTasks").parentElement;
    this.highSection = document.querySelector("#highTasks").parentElement;
    this.normalSection = document.querySelector("#normalTasks").parentElement;
    this.lowSection = document.querySelector("#lowTasks").parentElement;
  }

  render() {
    console.log("Rendering tasks:", this.taskManager.tasks);
    this.criticalTasksElement.innerHTML = "";
    this.highTasksElement.innerHTML = "";
    this.normalTasksElement.innerHTML = "";
    this.lowTasksElement.innerHTML = "";

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

    // Show task sections if there are any tasks, hide otherwise
    if (this.taskManager.tasks.length > 0) {
      this.taskSectionsElement.style.display = "block";
    } else {
      this.taskSectionsElement.style.display = "none";
      this.normalTasksElement.innerHTML =
        "<p class='text-gray-500'>No tasks available. Add a new task to get started!</p>";
      this.normalSection.style.display = "block";
    }
  }

  renderSection(tasks, sectionElement, taskListElement, countElement) {
    if (tasks.length > 0) {
      sectionElement.style.display = "block";
      tasks.forEach((task) => {
        taskListElement.appendChild(this.createTaskCard(task));
      });
      countElement.textContent = tasks.length;
    } else {
      sectionElement.style.display = "none";
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
      "md:w-1/2"
    );
    taskCard.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-bold text-black">${task.title}</h3>
        <div class="flex space-x-2">
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
      <p class="text-gray-600 mb-2">Type: ${task.task_type} | ETA: ${
      task.eta_time
    }</p>
      <p class="text-gray-600 mb-2">Due: ${task.due_date || "No due date"}</p>
      <div class="flex items-center space-x-2 mb-4">
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
    `;
    return taskCard;
  }
}
