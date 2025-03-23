import { API_BASE_URL } from "./Config.js";
import { TaskManager } from "./TaskManager.js";
import { TaskRenderer } from "./TaskRenderer.js";
import { TaskController } from "./TaskController.js";
import { PopupManager } from "./PopupManager.js";
import { AISuggestionManager } from "./AISuggestionManager.js";
import { SidebarManager } from "./SidebarManager.js";
import { UserManager } from "./UserManager.js";
import { NotificationManager } from "./NotificationManager.js";

const taskManager = new TaskManager();
const taskRenderer = new TaskRenderer(taskManager, null);
const sidebarManager = new SidebarManager(taskRenderer);
const popupManager = new PopupManager(taskManager, taskRenderer);
const taskController = new TaskController(
  taskManager,
  taskRenderer,
  popupManager
);
const notificationManager = new NotificationManager(taskManager);

// Update TaskRenderer with sidebarManager after instantiation
taskRenderer.sidebarManager = sidebarManager;

window.taskController = taskController;
window.taskRenderer = taskRenderer;

new AISuggestionManager();
new UserManager();

async function init() {
  await taskManager.fetchTasks();
  taskRenderer.render();

  const hideEmptyCheckbox = document.getElementById("hideEmptyCategories");
  hideEmptyCheckbox.addEventListener("change", () => {
    localStorage.setItem("hideEmptyCategories", hideEmptyCheckbox.checked);
    taskRenderer.render();
  });
}

init();
