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
    rangNotifications[taskId] = timestamp;
    localStorage.setItem(
      this.rangNotificationsKey,
      JSON.stringify(rangNotifications)
    );
  }

  hasRang(taskId, dueDate) {
    const rangNotifications = this.getRangNotifications();
    const rangTime = rangNotifications[taskId];
    if (!rangTime) return false;
    return new Date(rangTime).toISOString() === new Date(dueDate).toISOString();
  }

  clearRangNotifications() {
    localStorage.removeItem(this.rangNotificationsKey);
  }

  checkTasksForNotifications() {
    const now = new Date();
    this.taskManager.tasks.forEach((task) => {
      if (
        !task.should_notify ||
        !task.due_date ||
        task.status === "Completed" ||
        this.hasRang(task.id, task.due_date)
      )
        return;

      const dueDate = new Date(task.due_date);
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
      if (timeDiff > 0 && timeDiff <= 1000) {
        // Within the next second
        this.showNotification(task);
        this.setRangNotification(task.id, notifyTime.toISOString());
      }
    });
  }

  showNotification(task) {
    if (
      Notification.permission === "granted" &&
      this.serviceWorkerRegistration
    ) {
      const notificationOptions = {
        body: `Due: ${new Date(task.due_date).toLocaleString()} | ${
          task.notify_when || "Now"
        }`,
        icon: "Images/icon-192.png",
        data: { taskId: task.id }, // Pass task ID for potential click handling
      };
      // Send message to Service Worker to show notification
      navigator.serviceWorker.controller?.postMessage({
        type: "SHOW_NOTIFICATION",
        title: `Task Reminder: ${task.title}`,
        options: notificationOptions,
      });
    }
  }
}
