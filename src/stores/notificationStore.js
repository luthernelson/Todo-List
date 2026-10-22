import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    notifications: [],
  }),

  actions: {
    addNotification(notification) {
      const id = Date.now()
      const newNotification = {
        id,
        type: notification.type || 'info', // success, error, warning, info
        title: notification.title || '',
        message: notification.message || '',
        duration: notification.duration || 5000,
        icon: notification.icon || null,
        action: notification.action || null,
        createdAt: new Date().toISOString(),
      }

      this.notifications.push(newNotification)

      // Auto-remove after duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }

      return id
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },

    clearAll() {
      this.notifications = []
    },

    // Convenience methods
    success(title, message, options = {}) {
      return this.addNotification({
        type: 'success',
        title,
        message,
        icon: 'fa-solid fa-check-circle',
        ...options,
      })
    },

    error(title, message, options = {}) {
      return this.addNotification({
        type: 'error',
        title,
        message,
        icon: 'fa-solid fa-exclamation-circle',
        duration: 8000, // Longer duration for errors
        ...options,
      })
    },

    warning(title, message, options = {}) {
      return this.addNotification({
        type: 'warning',
        title,
        message,
        icon: 'fa-solid fa-exclamation-triangle',
        ...options,
      })
    },

    info(title, message, options = {}) {
      return this.addNotification({
        type: 'info',
        title,
        message,
        icon: 'fa-solid fa-info-circle',
        ...options,
      })
    },
  },
})
