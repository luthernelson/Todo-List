<template>
  <div class="activity-feed">
    <div class="feed-header">
      <h3>Journal d'activité</h3>
      <div class="header-actions">
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        <button @click="markAllAsRead" class="btn-mark-read" title="Tout marquer comme lu">
          <CheckCheck :size="16" />
        </button>
        <button @click="clearActivities" class="btn-clear" title="Effacer tout">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <div class="feed-content">
      <div v-if="activities.length === 0" class="empty-state">
        <Activity :size="48" class="empty-icon" />
        <p>Aucune activité récente</p>
      </div>

      <div v-else class="activity-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
          :class="{ unread: !activity.read }"
          @click="markAsRead(activity.id)"
        >
          <div class="activity-icon" :class="`category-${activity.category}`">
            <component :is="getIconComponent(activity.icon)" :size="20" />
          </div>
          <div class="activity-details">
            <div class="activity-user">{{ activity.username }}</div>
            <div class="activity-action">{{ activity.action }}</div>
            <div class="activity-time">{{ formatTime(activity.createdAt) }}</div>
          </div>
          <div v-if="!activity.read" class="unread-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import {
  Activity,
  CheckCheck,
  Trash2,
  FolderPlus,
  PlusCircle,
  CheckCircle,
  Edit,
  MessageCircle,
  UserPlus,
  Coins,
  Building,
  UserCheck,
  CreditCard,
} from 'lucide-vue-next'

const activityStore = useActivityStore()

const activities = computed(() => activityStore.activities)
const recentActivities = computed(() => activityStore.recentActivities)
const unreadCount = computed(() => activityStore.unreadCount)

const getIconComponent = (iconName) => {
  const iconMap = {
    'folder-plus': FolderPlus,
    'plus-circle': PlusCircle,
    'check-circle': CheckCircle,
    'edit': Edit,
    'message-circle': MessageCircle,
    'user-plus': UserPlus,
    'coins': Coins,
    'building': Building,
    'user-check': UserCheck,
    'credit-card': CreditCard,
  }
  return iconMap[iconName] || Activity
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours} h`
  if (days < 7) return `Il y a ${days} j`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const markAsRead = (activityId) => {
  activityStore.markAsRead(activityId)
}

const markAllAsRead = () => {
  activityStore.markAllAsRead()
}

const clearActivities = () => {
  if (confirm('Voulez-vous vraiment effacer toutes les activités ?')) {
    activityStore.clearActivities()
  }
}
</script>

<style scoped>
.activity-feed {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.feed-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unread-badge {
  background: #293848;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
  text-align: center;
}

.btn-mark-read,
.btn-clear {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-mark-read:hover,
.btn-clear:hover {
  background: #e5e7eb;
  color: #293848;
}

.feed-content {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 0.875rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-item.unread {
  background: #eff6ff;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.activity-icon.category-project {
  background: #3b82f6;
}

.activity-icon.category-task {
  background: #10b981;
}

.activity-icon.category-comment {
  background: #8b5cf6;
}

.activity-icon.category-member {
  background: #f59e0b;
}

.activity-icon.category-budget {
  background: #ef4444;
}

.activity-icon.category-company {
  background: #6366f1;
}

.activity-icon.category-subscription {
  background: #ec4899;
}

.activity-details {
  flex: 1;
  min-width: 0;
}

.activity-user {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

.activity-action {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  background: #293848;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .feed-content {
    max-height: 300px;
  }

  .activity-item {
    padding: 0.75rem 1rem;
  }
}
</style>
