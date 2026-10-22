<template>
  <div class="notifications-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
      >
        <div class="notification-icon">
          <i v-if="notification.icon" :class="notification.icon"></i>
          <i v-else-if="notification.type === 'success'" class="fa-solid fa-check-circle"></i>
          <i v-else-if="notification.type === 'error'" class="fa-solid fa-exclamation-circle"></i>
          <i v-else-if="notification.type === 'warning'" class="fa-solid fa-exclamation-triangle"></i>
          <i v-else class="fa-solid fa-info-circle"></i>
        </div>

        <div class="notification-content">
          <h4 v-if="notification.title" class="notification-title">{{ notification.title }}</h4>
          <p v-if="notification.message" class="notification-message">{{ notification.message }}</p>
        </div>

        <button @click="removeNotification(notification.id)" class="notification-close">
          <i class="fa-solid fa-times"></i>
        </button>

        <div
          v-if="notification.duration > 0"
          class="notification-progress"
          :style="{ animationDuration: notification.duration + 'ms' }"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  position: relative;
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  pointer-events: auto;
  overflow: hidden;
  min-width: 300px;
}

.notification.success {
  border-left: 4px solid #10B981;
}

.notification.error {
  border-left: 4px solid #EF4444;
}

.notification.warning {
  border-left: 4px solid #F59E0B;
}

.notification.info {
  border-left: 4px solid #293848;
}

.notification-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.notification.success .notification-icon {
  color: #10B981;
}

.notification.error .notification-icon {
  color: #EF4444;
}

.notification.warning .notification-icon {
  color: #F59E0B;
}

.notification.info .notification-icon {
  color: #293848;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #293848;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Animations */
.notification-enter-active {
  animation: slideIn 0.3s ease;
}

.notification-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-container {
    top: 4rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }

  .notification {
    min-width: auto;
  }
}
</style>
