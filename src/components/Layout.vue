<template>
  <div class="app-layout" :class="{ 'dark-mode': isDarkMode }">
    <!-- Sidebar professionnelle -->
    <ProfessionalSidebar />

    <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Top Header -->
      <header class="top-header">
        <!-- Search Bar -->
        <div class="search-section">
          <SearchBar :placeholder="$t('search.placeholder')" @search="handleSearch" />
        </div>

        <!-- User Actions -->
        <div class="header-actions">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="action-btn"
            :title="isDarkMode ? 'Mode clair' : 'Mode sombre'"
          >
            <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>

          <!-- Language Selector -->
          <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
          </select>

          <!-- Notifications -->
          <button class="action-btn" :title="$t('nav.notifications')">
            <i class="fa-solid fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </button>

          <!-- Activity Feed Toggle -->
          <button 
            @click="showActivityFeed = !showActivityFeed" 
            class="action-btn"
            :class="{ 'active': showActivityFeed }"
            title="Journal d'activité"
          >
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>

          <!-- User Menu -->
          <div class="user-menu">
            <button @click="isUserMenuOpen = !isUserMenuOpen" class="user-btn">
              <div class="user-avatar">
                <i class="fa-solid fa-circle-user"></i>
              </div>
              <span class="user-name">{{ userStore.username || 'Utilisateur' }}</span>
              <i class="fa-solid fa-chevron-down dropdown-icon"></i>
            </button>

            <div v-if="isUserMenuOpen" class="user-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <i class="fa-solid fa-circle-user"></i>
                </div>
                <div class="dropdown-info">
                  <h4>{{ userStore.username || 'Utilisateur' }}</h4>
                  <p>{{ userStore.email || 'user@example.com' }}</p>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/settings" @click="isUserMenuOpen = false" class="dropdown-item">
                <i class="fa-solid fa-cog"></i>
                <span>Paramètres</span>
              </RouterLink>
              <RouterLink to="/profile" @click="isUserMenuOpen = false" class="dropdown-item">
                <i class="fa-solid fa-user"></i>
                <span>Mon profil</span>
              </RouterLink>
              <div class="dropdown-divider"></div>
              <RouterLink to="/login" @click="handleLogout" class="dropdown-item logout">
                <i class="fa-solid fa-sign-out-alt"></i>
                <span>{{ $t('nav.logout') }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content" :class="{ 'with-activity': showActivityFeed }">
        <RouterView />
      </main>

      <!-- Activity Feed Panel -->
      <div v-if="showActivityFeed" class="activity-panel">
        <div class="activity-panel-header">
          <h3>Journal d'activité</h3>
          <button @click="showActivityFeed = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <ActivityFeed />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import SearchBar from './SearchBar.vue'
import ProfessionalSidebar from './ProfessionalSidebar.vue'
import ActivityFeed from './ActivityFeed.vue'

const router = useRouter()
const { locale } = useI18n()
const userStore = useUserStore()

const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)
const currentLocale = ref(locale.value)
const isDarkMode = ref(false)
const unreadCount = ref(3)
const showActivityFeed = ref(false)

onMounted(() => {
  // Thème
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  // État de la sidebar
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState === 'true') {
    isSidebarCollapsed.value = true
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleSearch = (query) => {
  console.log('Search:', query)
}

const handleLogout = () => {
  userStore.logout()
  isUserMenuOpen.value = false
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    isUserMenuOpen.value = false
  }
}
</script>

<style scoped>
/* ===== LAYOUT ===== */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  transition: background 0.3s ease;
}

.app-layout.dark-mode {
  background: #1f2937;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width, 260px);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

/* ===== TOP HEADER ===== */
.top-header {
  background: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-mode .top-header {
  background: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.search-section {
  flex: 1;
  max-width: 600px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
  position: relative;
}

.dark-mode .action-btn {
  background: #4b5563;
  color: #d1d5db;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.action-btn.active {
  background: rgb(29, 40, 61);
  color: white;
}

.dark-mode .action-btn:hover {
  background: #6b7280;
  color: white;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 18px;
  text-align: center;
}

.lang-select {
  padding: 0.4rem 0.6rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .lang-select {
  background: #4b5563;
  border-color: #6b7280;
  color: white;
}

.lang-select:hover {
  border-color: #293848;
}

.lang-select option {
  background: white;
  color: #374151;
}

/* ===== USER MENU ===== */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .user-btn {
  background: #4b5563;
}

.user-btn:hover {
  border-color: #293848;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #293848;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.user-name {
  color: #374151;
  font-weight: 600;
  font-size: 0.8rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark-mode .user-name {
  color: white;
}

.dropdown-icon {
  color: #9ca3af;
  font-size: 0.75rem;
  transition: transform 0.2s;
}

.user-btn:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideDown 0.2s ease;
  z-index: 200;
}

.dark-mode .user-dropdown {
  background: #374151;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.dark-mode .dropdown-header {
  background: #4b5563;
  border-bottom-color: #6b7280;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  background: #293848;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.dropdown-info h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark-mode .dropdown-info h4 {
  color: white;
}

.dropdown-info p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.dark-mode .dropdown-info p {
  color: #d1d5db;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0;
}

.dark-mode .dropdown-divider {
  background: #6b7280;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.dark-mode .dropdown-item {
  color: #d1d5db;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #293848;
}

.dark-mode .dropdown-item:hover {
  background: #4b5563;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dark-mode .dropdown-item.logout:hover {
  background: #7f1d1d;
}

.dropdown-item i {
  font-size: 1rem;
  width: 20px;
}

/* ===== PAGE CONTENT ===== */
.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  transition: margin-right 0.3s ease;
}

.page-content.with-activity {
  margin-right: 400px;
}

/* ===== ACTIVITY PANEL ===== */
.activity-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  z-index: 100;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.activity-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.activity-panel-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }

  .user-name {
    display: none;
  }

  .activity-panel {
    width: 320px;
  }

  .page-content.with-activity {
    margin-right: 320px;
  }
}

@media (max-width: 768px) {
  .top-header {
    padding: 1rem;
    gap: 1rem;
  }

  .search-section {
    max-width: 200px;
  }

  .lang-select {
    display: none;
  }

  .page-content {
    padding: 1rem;
  }

  .activity-panel {
    display: none;
  }

  .page-content.with-activity {
    margin-right: 0;
  }
}
</style>