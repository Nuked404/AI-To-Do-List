export class NotificationManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.rangNotificationsKey = "rangNotifications";
    this.serviceWorkerRegistration = null;
    this.requestPermission();
    this.registerServiceWorker();
    this.startNotificationCheck();
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      console.log("Notifications not supported in this browser.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
    }
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register(
          "sw.js"
        );
        console.log("Service Worker registered for notifications");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  startNotificationCheck() {
    setInterval(() => this.checkTasksForNotifications(), 1000); // Check every 1 second
    this.checkTasksForNotifications(); // Initial check
  }

  getRangNotifications() {
    const stored = localStorage.getItem(this.rangNotificationsKey);
    return stored ? JSON.parse(stored) : {};
  }

  setRangNotification(taskId, timestamp) {
    const rangNotifications = this.getRangNotifications();
    rangNotifications[taskId] =
      timestamp instanceof Date ? timestamp.toISOString() : timestamp;
    localStorage.setItem(
      this.rangNotificationsKey,
      JSON.stringify(rangNotifications)
    );
    // Dispatch custom event to notify UI of update
    const event = new CustomEvent("notificationRang", { detail: { taskId } });
    window.dispatchEvent(event);
  }

  hasRang(taskId, dueDate) {
    const rangNotifications = this.getRangNotifications();
    const rangTime = rangNotifications[taskId];
    if (!rangTime) return false;

    try {
      const rangDate = new Date(rangTime);
      const due = dueDate ? new Date(dueDate) : null;
      if (isNaN(rangDate.getTime()) || (due && isNaN(due.getTime()))) {
        return false;
      }
      return due ? rangDate.toISOString() === due.toISOString() : false;
    } catch (error) {
      console.warn(`Invalid date detected for task ${taskId}:`, error);
      return false;
    }
  }

  resetRangStatus(taskId) {
    const rangNotifications = this.getRangNotifications();
    if (taskId in rangNotifications) {
      delete rangNotifications[taskId];
      localStorage.setItem(
        this.rangNotificationsKey,
        JSON.stringify(rangNotifications)
      );
      console.log(`Rang status reset for task ${taskId}`);
      // Dispatch event to update UI
      const event = new CustomEvent("notificationReset", {
        detail: { taskId },
      });
      window.dispatchEvent(event);
    }
  }

  clearRangNotifications() {
    localStorage.removeItem(this.rangNotificationsKey);
  }

  checkTasksForNotifications() {
    const now = new Date();
    const catchUpWindow = 5 * 60 * 1000; // 5 minutes in milliseconds

    this.taskManager.tasks.forEach((task) => {
      if (
        !task.should_notify ||
        !task.due_date ||
        task.status === "Completed" ||
        this.hasRang(task.id, task.due_date)
      )
        return;

      let dueDate;
      try {
        dueDate = new Date(task.due_date);
        if (isNaN(dueDate.getTime())) {
          console.warn(
            `Invalid due_date for task ${task.id}: ${task.due_date}`
          );
          return;
        }
      } catch (error) {
        console.warn(`Error parsing due_date for task ${task.id}:`, error);
        return;
      }

      let notifyTime = dueDate;

      switch (task.notify_when) {
        case "5 Minutes Before":
          notifyTime = new Date(dueDate.getTime() - 5 * 60 * 1000);
          break;
        case "30 Minutes Before":
          notifyTime = new Date(dueDate.getTime() - 30 * 60 * 1000);
          break;
        case "1 Hour Before":
          notifyTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
          break;
        case "On Due Time":
        default:
          notifyTime = dueDate;
          break;
      }

      const timeDiff = notifyTime - now;
      if (
        (timeDiff > 0 && timeDiff <= 1000) ||
        (timeDiff <= 0 && timeDiff >= -catchUpWindow)
      ) {
        this.showNotification(task);
        this.setRangNotification(task.id, notifyTime);
      }
    });
  }

  showNotification(task) {
    if (
      Notification.permission === "granted" &&
      this.serviceWorkerRegistration
    ) {
      const dueDate = new Date(task.due_date);
      const notificationOptions = {
        body: `Due: ${dueDate.toLocaleString()} | ${task.notify_when || "Now"}`,
        icon: "Images/icon-192.png",
        data: { taskId: task.id },
      };
      navigator.serviceWorker.controller?.postMessage({
        type: "SHOW_NOTIFICATION",
        title: `Task Reminder: ${task.title}`,
        options: notificationOptions,
      });
    }
  }
}
