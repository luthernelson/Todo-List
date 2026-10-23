<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-logo">
        <img src="../assets/images/logoApp4.png" alt="logoApp" class="logo-image" />
        <span class="logo-text">WorkStream</span>
      </div>

      <!-- Menu principal (desktop) -->
      <ul class="navbar-menu">
        <RouterLink
          to="/"
          :class="['nav-link', { active: activeLink === '/' }]"
          @click="setActiveLink('/')"
        >
          <i class="fa-solid fa-house"></i>
          <span>{{ $t('nav.home') }}</span>
        </RouterLink>
        <RouterLink
          to="/community"
          :class="['nav-link', { active: activeLink === '/community' }]"
          @click="setActiveLink('/community')"
        >
          <i class="fa-solid fa-people-group"></i>
          <span>{{ $t('nav.community') }}</span>
        </RouterLink>
        <RouterLink
          to="/reports"
          :class="['nav-link', { active: activeLink === '/reports' }]"
          @click="setActiveLink('/reports')"
        >
          <i class="fa-solid fa-chart-bar"></i>
          <span>{{ $t('nav.reports') }}</span>
        </RouterLink>
        <RouterLink
          to="/settings"
          :class="['nav-link', { active: activeLink === '/settings' }]"
          @click="setActiveLink('/settings')"
        >
          <i class="fa-solid fa-cog"></i>
          <span>{{ $t('nav.settings') }}</span>
        </RouterLink>
      </ul>

      <!-- Actions utilisateur (desktop) -->
      <div class="navbar-actions">
        <!-- Bouton nouvelle tâche -->
        <button @click="taskStore.toggleForm" class="btn-new-task">
          <i class="fa-solid fa-plus"></i>
          <span>{{ $t('nav.newTask') }}</span>
        </button>

        <!-- Sélecteur de langue -->
        <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
          <option value="fr">🇫🇷 FR</option>
          <option value="en">🇬🇧 EN</option>
        </select>

        <!-- Menu utilisateur -->
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
            <RouterLink to="/login" @click="isUserMenuOpen = false" class="dropdown-item logout">
              <i class="fa-solid fa-sign-out-alt"></i>
              <span>{{ $t('nav.logout') }}</span>
            </RouterLink>
          </div>
        </div>

        <!-- Bouton menu burger (mobile) -->
        <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
          <i :class="isMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Menu mobile -->
  <transition name="slide-in">
    <div v-if="isMenuOpen" class="mobile-menu">
      <div class="mobile-menu-header">
        <div class="mobile-logo">
          <img src="../assets/images/logoApp4.png" alt="logoApp" class="logo-image" />
          <span class="logo-text">WorkStream</span>
        </div>
        <button @click="isMenuOpen = false" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <ul class="mobile-menu-list">
        <RouterLink
          to="/"
          :class="['mobile-nav-link', { active: activeLink === '/' }]"
          @click="setActiveLink('/')"
        >
          <i class="fa-solid fa-house"></i>
          <span>{{ $t('nav.home') }}</span>
        </RouterLink>
        <RouterLink
          to="/community"
          :class="['mobile-nav-link', { active: activeLink === '/community' }]"
          @click="setActiveLink('/community')"
        >
          <i class="fa-solid fa-people-group"></i>
          <span>{{ $t('nav.community') }}</span>
        </RouterLink>
        <RouterLink
          to="/reports"
          :class="['mobile-nav-link', { active: activeLink === '/reports' }]"
          @click="setActiveLink('/reports')"
        >
          <i class="fa-solid fa-chart-bar"></i>
          <span>{{ $t('nav.reports') }}</span>
        </RouterLink>
        <RouterLink
          to="/settings"
          :class="['mobile-nav-link', { active: activeLink === '/settings' }]"
          @click="setActiveLink('/settings')"
        >
          <i class="fa-solid fa-cog"></i>
          <span>{{ $t('nav.settings') }}</span>
        </RouterLink>
      </ul>
      <div class="mobile-menu-footer">
        <button @click="taskStore.toggleForm" class="mobile-btn-new-task">
          <i class="fa-solid fa-plus"></i>
          <span>{{ $t('nav.newTask') }}</span>
        </button>
        <RouterLink to="/login" @click="userStore.logout()" class="mobile-logout">
          <i class="fa-solid fa-sign-out-alt"></i>
          <span>{{ $t('nav.logout') }}</span>
        </RouterLink>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const userStore = useUserStore()
const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const activeLink = ref('/')
const taskStore = useTaskStore()
const currentLocale = ref(locale.value)

function setActiveLink(link) {
  activeLink.value = link
  isMenuOpen.value = false // Ferme le menu après sélection
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function changeLanguage() {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

// Close user dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== NAVBAR PRINCIPALE ===== */
.navbar {
  background: #293848;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

/* Menu principal */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-link i {
  font-size: 1rem;
}

/* Actions utilisateur */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-new-task {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  color: #293848;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-new-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.lang-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-select:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.lang-select option {
  background: #1e40af;
  color: white;
}

/* Menu utilisateur */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: white;
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
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  background: #293848;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
}

.dropdown-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dropdown-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #293848;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dropdown-item i {
  font-size: 1rem;
  width: 20px;
}

/* Menu burger */
.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ===== MENU MOBILE ===== */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #293848;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-logo .logo-image {
  height: 36px;
}

.mobile-logo .logo-text {
  font-size: 1.25rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 0.5rem;
  overflow-y: auto;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.mobile-nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mobile-nav-link i {
  font-size: 1.25rem;
  width: 24px;
}

.mobile-menu-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-btn-new-task {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  color: #293848;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-btn-new-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.mobile-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.mobile-logout:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Animation */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar-container {
    gap: 1rem;
  }

  .navbar-menu {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .user-menu {
    display: none;
  }

  .btn-new-task {
    display: none;
  }

  .logo-text {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .logo-image {
    height: 32px;
  }

  .logo-text {
    display: none;
  }

  .lang-select {
    display: none;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0.5rem 0.75rem;
  }

  .logo-image {
    height: 28px;
  }

  .menu-toggle {
    width: 32px;
    height: 32px;
  }
}
</style>
