<template>
  <header class="top-header">
    <!-- Left: Search and Breadcrumb -->
    <div class="header-left">
      <div class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-item">Work</RouterLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ currentPageName }}</span>
      </div>
    </div>

    <!-- Center: Search -->
    <div class="header-center">
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher des projets, tâches..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <span class="shortcut">⌘K</span>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="header-right">
      <!-- Quick Create -->
      <button @click="openQuickCreate" class="action-btn quick-create">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>Créer</span>
      </button>

      <!-- Notifications -->
      <button class="action-btn notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="badge">3</span>
      </button>

      <!-- Help -->
      <button class="action-btn help">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>

      <!-- User Menu -->
      <div class="user-menu" @click="toggleUserMenu">
        <div class="user-avatar">
          <span>{{ userStore.username?.charAt(0).toUpperCase() || 'U' }}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>

        <!-- Dropdown -->
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-avatar">
              <span>{{ userStore.username?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <div class="dropdown-info">
              <p class="dropdown-name">{{ userStore.username || 'Utilisateur' }}</p>
              <p class="dropdown-email">{{ userStore.user?.email || '' }}</p>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <RouterLink to="/settings" class="dropdown-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Paramètres
          </RouterLink>
          <button @click="logout" class="dropdown-item logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

const currentPageName = computed(() => {
  const routeNames = {
    '/': 'Dashboard',
    '/projects': 'Projets',
    '/tasks': 'Tâches',
    '/community': 'Communauté',
    '/company': 'Équipe',
    '/settings': 'Paramètres',
    '/reports': 'Rapports',
    '/planning': 'Planification',
    '/roadmap': 'Roadmap'
  }
  return routeNames[route.path] || 'Page'
})

const handleSearch = () => {
  console.log('Recherche:', searchQuery.value)
  // Implémenter la recherche
}

const openQuickCreate = () => {
  console.log('Ouvrir le menu de création rapide')
  // Implémenter le menu de création rapide
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  userStore.logout()
}

// Fermer le menu utilisateur quand on clique ailleurs
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.top-header {
  height: 56px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  margin-left: var(--sidebar-width, 260px);
  transition: margin-left 0.3s ease;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: #293848;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 500;
}

.header-center {
  flex: 2;
  max-width: 600px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 6px;
  transition: all 0.2s;
}

.search-bar:focus-within {
  background: white;
  border: 2px solid #293848;
  box-shadow: 0 0 0 3px rgba(41, 56, 72, 0.1);
}

.search-bar svg {
  color: #6b7280;
  flex-shrink: 0;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
}

.search-bar input::placeholder {
  color: #9ca3af;
}

.shortcut {
  font-size: 0.75rem;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #293848;
}

.action-btn.quick-create {
  background: #293848;
  color: white;
}

.action-btn.quick-create:hover {
  background: #1e2a36;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 18px;
  text-align: center;
}

.action-btn.notifications {
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.user-menu:hover {
  background: #f3f4f6;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #293848;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #293848;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.dropdown-info {
  flex: 1;
  min-width: 0;
}

.dropdown-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.125rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}
</style>
