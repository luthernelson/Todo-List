<template>
  <div class="user-profile-summary">
    <div class="profile-card">
      <!-- Avatar et niveau -->
      <div class="profile-header">
        <div class="avatar-container">
          <div class="avatar" :style="{ borderColor: currentTheme.colors.primary }">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="level-badge" :style="{ backgroundColor: currentTheme.colors.primary }">
            <span class="level-number">{{ currentLevel }}</span>
          </div>
        </div>
        <div class="profile-info">
          <h3 class="username">Mon Profil</h3>
          <p class="level-text">Niveau {{ currentLevel }}</p>
        </div>
      </div>

      <!-- Barre de progression XP -->
      <div class="xp-section">
        <div class="xp-info">
          <span class="xp-current">{{ userProfile?.xp || 0 }} XP</span>
          <span class="xp-next">+{{ xpToNextLevel }} XP pour le niveau suivant</span>
        </div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: levelProgress + '%', backgroundColor: currentTheme.colors.primary }"></div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: currentTheme.colors.primary + '20' }">
            <i class="fa-solid fa-check-circle" :style="{ color: currentTheme.colors.primary }"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalTasksCompleted }}</span>
            <span class="stat-label">Tâches</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: currentTheme.colors.secondary + '20' }">
            <i class="fa-solid fa-fire" :style="{ color: currentTheme.colors.secondary }"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.currentStreak }}</span>
            <span class="stat-label">Jours</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: '#f59e0b20' }">
            <i class="fa-solid fa-clock" style="color: #f59e0b"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalHoursSaved }}h</span>
            <span class="stat-label">Gagnées</span>
          </div>
        </div>
      </div>

      <!-- Badges récents -->
      <div class="badges-section">
        <h4 class="section-title">Badges</h4>
        <div class="badges-list">
          <div
            v-for="badge in recentBadges"
            :key="badge.id"
            class="badge-item"
            :title="badge.description"
          >
            <span class="badge-icon">{{ badge.icon }}</span>
          </div>
          <div v-if="lockedBadges.length > 0" class="badge-item locked" title="À débloquer">
            <i class="fa-solid fa-lock"></i>
          </div>
        </div>
      </div>

      <!-- Animation de niveau supérieur -->
      <div v-if="showLevelUp" class="level-up-animation">
        <div class="level-up-content">
          <i class="fa-solid fa-trophy"></i>
          <h3>Niveau {{ currentLevel }}!</h3>
          <p>Vous avez atteint un nouveau niveau</p>
        </div>
      </div>

      <!-- Animation de badge débloqué -->
      <div v-if="showBadgeUnlocked" class="badge-unlocked-animation">
        <div class="badge-content">
          <span class="badge-icon-large">{{ lastUnlockedBadge?.icon }}</span>
          <h3>Badge Débloqué!</h3>
          <p>{{ lastUnlockedBadge?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGamificationStore } from '@/stores/gamificationStore'

const gamificationStore = useGamificationStore()

const userProfile = computed(() => gamificationStore.userProfile)
const currentLevel = computed(() => gamificationStore.currentLevel)
const xpToNextLevel = computed(() => gamificationStore.xpToNextLevel)
const levelProgress = computed(() => gamificationStore.levelProgress)
const unlockedBadges = computed(() => gamificationStore.unlockedBadges)
const lockedBadges = computed(() => gamificationStore.lockedBadges)
const currentTheme = computed(() => gamificationStore.currentTheme)
const showLevelUp = computed(() => gamificationStore.showLevelUpAnimation)
const showBadgeUnlocked = computed(() => gamificationStore.showBadgeUnlocked)
const lastUnlockedBadge = computed(() => gamificationStore.lastUnlockedBadge)

const stats = computed(() => gamificationStore.productivityStats || {
  totalTasksCompleted: 0,
  currentStreak: 0,
  totalHoursSaved: 0,
})

const recentBadges = computed(() => {
  return unlockedBadges.value.slice(-5).reverse()
})
</script>

<style scoped>
.user-profile-summary {
  margin-bottom: 2rem;
}

.profile-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  border: 3px solid;
}

.level-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  border: 2px solid white;
}

.profile-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.level-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.xp-section {
  margin-bottom: 1.5rem;
}

.xp-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.xp-current {
  font-weight: 600;
  color: #1f2937;
}

.xp-next {
  color: #6b7280;
}

.xp-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.stat-icon i {
  font-size: 1.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.badges-section {
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.badges-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.badge-item:hover {
  transform: scale(1.1);
}

.badge-item.locked {
  background: #e5e7eb;
  color: #9ca3af;
}

.level-up-animation,
.badge-unlocked-animation {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

.level-up-content,
.badge-content {
  text-align: center;
  color: white;
}

.level-up-content i,
.badge-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;
}

.level-up-content h3,
.badge-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.level-up-content p,
.badge-content p {
  font-size: 1rem;
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
