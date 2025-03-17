import { ThemeManager } from "./ThemeManager.js";
import { TaskManager } from "./TaskManager.js";
import { TaskRenderer } from "./TaskRenderer.js";
import { TaskController } from "./TaskController.js";
import { PopupManager } from "./PopupManager.js";
import { AISuggestionManager } from "./AISuggestionManager.js";
import { SidebarManager } from "./SidebarManager.js";
import { UserManager } from "./UserManager.js";

const taskManager = new TaskManager();
const taskRenderer = new TaskRenderer(taskManager);
const popupManager = new PopupManager(taskManager, taskRenderer);
const taskController = new TaskController(
  taskManager,
  taskRenderer,
  popupManager
);

window.taskController = taskController;
window.taskRenderer = taskRenderer;

new ThemeManager();
new AISuggestionManager();
new SidebarManager();
new UserManager(); // Initialize UserManager here

async function init() {
  await taskManager.fetchTasks();
  taskRenderer.render();
}

init();
