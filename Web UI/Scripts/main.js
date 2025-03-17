import { ThemeManager } from "./ThemeManager.js";
import { TaskManager } from "./TaskManager.js";
import { TaskRenderer } from "./TaskRenderer.js";
import { TaskController } from "./TaskController.js";
import { PopupManager } from "./PopupManager.js";
import { AISuggestionManager } from "./AISuggestionManager.js";
import { SidebarManager } from "./SidebarManager.js";

const taskManager = new TaskManager();
const taskRenderer = new TaskRenderer(taskManager);
const popupManager = new PopupManager(taskManager, taskRenderer);
const taskController = new TaskController(
  taskManager,
  taskRenderer,
  popupManager
);
window.taskController = taskController; // Expose globally
window.taskRenderer = taskRenderer; // Expose globally

new ThemeManager();
new AISuggestionManager();
new SidebarManager();
taskRenderer.render();
