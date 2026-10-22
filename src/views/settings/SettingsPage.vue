<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>{{ $t('settings.title') }}</h1>
      <p class="subtitle">{{ $t('settings.subtitle') }}</p>
    </div>

    <div class="settings-container">
      <!-- Menu latéral -->
      <div class="settings-sidebar">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id"
          :class="['sidebar-item', { active: activeSection === section.id }]"
        >
          <span class="icon">{{ section.icon }}</span>
          <span class="label">{{ section.label }}</span>
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="settings-content">
        <!-- Profil utilisateur -->
        <div v-if="activeSection === 'profile'" class="settings-section">
          <h2>{{ $t('settings.profile.title') }}</h2>
          <div class="profile-card">
            <div class="profile-avatar">
              <div class="avatar-circle">
                {{ userStore.username ? userStore.username.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div class="avatar-info">
                <h3>{{ userStore.username || 'Utilisateur' }}</h3>
                <p>{{ userStore.user?.email || '' }}</p>
                <span class="badge" :class="userStore.user?.mode || 'perso'">
                  {{ userStore.user?.mode === 'pro' ? $t('settings.profile.professional') : $t('settings.profile.personal') }}
                </span>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-item">
                <span class="label">{{ $t('settings.profile.username') }}:</span>
                <span class="value">{{ userStore.username }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ $t('settings.profile.email') }}:</span>
                <span class="value">{{ userStore.user?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ $t('settings.profile.role') }}:</span>
                <span class="value">{{ userStore.user?.role }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ $t('settings.profile.userId') }}:</span>
                <span class="value">{{ userStore.idUser }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestion des utilisateurs (Admin uniquement) -->
        <div v-if="activeSection === 'users' && isAdmin" class="settings-section">
          <h2>{{ $t('settings.users.title') }}</h2>
          <p class="section-description">{{ $t('settings.users.description') }}</p>

          <!-- Formulaire de création -->
          <div class="create-user-form">
            <h3>{{ $t('settings.users.createTitle') }}</h3>
            <form @submit.prevent="createUser" class="user-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ $t('settings.users.username') }}</label>
                  <input
                    v-model="newUser.username"
                    type="text"
                    required
                    placeholder="Ex: JeanDupont"
                  />
                </div>

                <div class="form-group">
                  <label>{{ $t('settings.users.email') }}</label>
                  <input
                    v-model="newUser.email"
                    type="email"
                    required
                    placeholder="Ex: jean@workstream.com"
                  />
                </div>

                <div class="form-group">
                  <label>{{ $t('settings.users.password') }}</label>
                  <input
                    v-model="newUser.password"
                    type="password"
                    required
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div class="form-group">
                  <label>{{ $t('settings.users.mode') }}</label>
                  <select v-model="newUser.mode" required>
                    <option value="perso">{{ $t('settings.users.personal') }}</option>
                    <option value="pro">{{ $t('settings.users.professional') }}</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-create">
                <span class="icon">+</span> {{ $t('settings.users.createUser') }}
              </button>
            </form>
          </div>

          <!-- Liste des utilisateurs -->
          <div class="users-list">
            <h3>{{ $t('settings.users.listTitle') }} ({{ users.length }})</h3>
            <div class="users-grid">
              <div
                v-for="user in users"
                :key="user.id"
                class="user-card"
                :class="{ 'is-admin': user.role === 'admin' }"
              >
                <div class="user-header">
                  <div class="user-avatar">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-info">
                    <h4>{{ user.username }}</h4>
                    <p class="email">{{ user.email }}</p>
                  </div>
                  <span class="badge" :class="user.mode">{{ user.mode.toUpperCase() }}</span>
                </div>

                <div class="user-details">
                  <div class="detail">
                    <span class="label">{{ $t('settings.profile.role') }}:</span>
                    <span class="value">{{ user.role }}</span>
                  </div>
                  <div class="detail">
                    <span class="label">ID:</span>
                    <span class="value">{{ user.id }}</span>
                  </div>
                </div>

                <div class="user-actions" v-if="user.role !== 'admin'">
                  <button @click="deleteUser(user.id)" class="btn-delete">
                    {{ $t('settings.users.delete') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Préférences -->
        <div v-if="activeSection === 'preferences'" class="settings-section">
          <h2>{{ $t('settings.preferences.title') }}</h2>
          <div class="preferences-list">
            <div class="preference-item">
              <div class="preference-info">
                <h3>{{ $t('settings.preferences.notifications') }}</h3>
                <p>{{ $t('settings.preferences.notificationsDesc') }}</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="preferences.notifications" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>{{ $t('settings.preferences.darkMode') }}</h3>
                <p>{{ $t('settings.preferences.darkModeDesc') }}</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="preferences.darkMode" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>{{ $t('settings.preferences.language') }}</h3>
                <p>{{ $t('settings.preferences.languageDesc') }}</p>
              </div>
              <select v-model="preferences.language" @change="changeLanguage(preferences.language)" class="language-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sécurité -->
        <div v-if="activeSection === 'security'" class="settings-section">
          <h2>{{ $t('settings.security.title') }}</h2>
          <div class="security-section">
            <div class="security-item">
              <div class="security-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div class="security-info">
                <h3>{{ $t('settings.security.changePassword') }}</h3>
                <p>{{ $t('settings.security.changePasswordDesc') }}</p>
              </div>
              <button class="btn-secondary">{{ $t('settings.security.modify') }}</button>
            </div>

            <div class="security-item two-factor-item">
              <div class="security-icon" :class="{ 'active': twoFactorStore.isTwoFactorEnabled }">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="security-info">
                <h3>{{ $t('settings.security.twoFactor') }}</h3>
                <p>{{ twoFactorStore.isTwoFactorEnabled ? $t('settings.security.twoFactorEnabled') : $t('settings.security.twoFactorDesc') }}</p>
              </div>
              <button
                v-if="!twoFactorStore.isTwoFactorEnabled"
                @click="handleEnable2FA"
                class="btn-primary"
              >
                {{ $t('settings.security.enable') }}
              </button>
              <button
                v-else
                @click="handleDisable2FA"
                class="btn-danger"
              >
                {{ $t('settings.security.disable') }}
              </button>
            </div>

            <div class="security-item">
              <div class="security-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="security-info">
                <h3>{{ $t('settings.security.loginHistory') }}</h3>
                <p>{{ $t('settings.security.loginHistoryDesc') }}</p>
              </div>
              <button class="btn-secondary">{{ $t('settings.security.view') }}</button>
            </div>
          </div>
        </div>

        <!-- Composant de configuration 2FA -->
        <TwoFactorSetup />
      </div>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTwoFactorStore } from '@/stores/twoFactorStore'
import { useI18n } from 'vue-i18n'
import TwoFactorSetup from '@/components/twoFactor/TwoFactorSetup.vue'

const userStore = useUserStore()
const twoFactorStore = useTwoFactorStore()
const { t, locale } = useI18n()

const activeSection = ref('profile')
const newUser = ref({
  username: '',
  email: '',
  password: '',
  mode: 'perso',
})

const users = ref([])
const successMessage = ref('')
const errorMessage = ref('')

const preferences = ref({
  notifications: true,
  darkMode: false,
  language: 'fr',
})

const isAdmin = computed(() => {
  return userStore.user && userStore.user.role === 'admin'
})

const sections = computed(() => {
  const baseSections = [
    { id: 'profile', label: t('settings.sections.profile'), icon: '👤' },
    { id: 'preferences', label: t('settings.sections.preferences'), icon: '⚙️' },
    { id: 'security', label: t('settings.sections.security'), icon: '🔒' },
  ]

  if (isAdmin.value) {
    baseSections.splice(1, 0, { id: 'users', label: t('settings.sections.users'), icon: '👥' })
  }

  return baseSections
})

onMounted(() => {
  if (isAdmin.value) {
    loadUsers()
  }
})

const loadUsers = () => {
  try {
    users.value = userStore.getAllUsers()
  } catch (error) {
    errorMessage.value = error.message
  }
}

const createUser = () => {
  try {
    if (newUser.value.password.length < 6) {
      errorMessage.value = t('settings.users.passwordMinLength')
      successMessage.value = ''
      return
    }

    const createdUser = userStore.createUser(
      newUser.value.username,
      newUser.value.email,
      newUser.value.password,
      newUser.value.mode
    )

    users.value.push(createdUser)
    successMessage.value = t('settings.users.userCreated')
    errorMessage.value = ''

    newUser.value = {
      username: '',
      email: '',
      password: '',
      mode: 'perso',
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message
    successMessage.value = ''
  }
}

const deleteUser = (userId) => {
  if (confirm(t('settings.users.deleteConfirm'))) {
    try {
      userStore.deleteUser(userId)
      users.value = users.value.filter((u) => u.id !== userId)
      successMessage.value = t('settings.users.userDeleted')
      errorMessage.value = ''

      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } catch (error) {
      errorMessage.value = error.message
      successMessage.value = ''
    }
  }
}

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const handleEnable2FA = () => {
  twoFactorStore.startSetup()
}

const handleDisable2FA = () => {
  if (confirm(t('settings.security.disable2FAConfirm'))) {
    twoFactorStore.disableTwoFactor()
    successMessage.value = t('settings.security.twoFactorDisabled')
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: #293848;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748B;
  font-size: 1.1rem;
}

.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-sidebar {
  background: #F8FAFC;
  padding: 1.5rem;
  border-right: 1px solid #E5E7EB;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  color: #64748B;
  margin-bottom: 0.5rem;
}

.sidebar-item:hover {
  background: #E5E7EB;
  color: #374151;
}

.sidebar-item.active {
  background: #293848;
  color: white;
}

.sidebar-item .icon {
  font-size: 1.25rem;
}

.settings-content {
  padding: 2rem;
}

.settings-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #64748B;
  margin-bottom: 2rem;
}

/* Profil */
.profile-card {
  background: #F0F9FF;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: #293848;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.avatar-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.avatar-info p {
  color: #64748B;
  margin: 0 0 0.5rem 0;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.pro {
  background: #DBEAFE;
  color: #1E40AF;
}

.badge.perso {
  background: #D1FAE5;
  color: #065F46;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 600;
}

.detail-item .value {
  font-size: 1rem;
  color: #1F2937;
}

/* Formulaire création utilisateur */
.create-user-form {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.create-user-form h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1rem;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #293848;
}

.btn-create {
  background: #293848;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Liste utilisateurs */
.users-list h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s;
}

.user-card:hover {
  border-color: #293848;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-card.is-admin {
  background: #FEF3C7;
  border-color: #F59E0B;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: #293848;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  font-size: 1rem;
  color: #1F2937;
  margin: 0;
}

.email {
  font-size: 0.85rem;
  color: #64748B;
  margin: 0.25rem 0 0 0;
}

.user-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail {
  display: flex;
  flex-direction: column;
}

.detail .label {
  font-size: 0.75rem;
  color: #64748B;
  font-weight: 600;
}

.detail .value {
  font-size: 0.85rem;
  color: #374151;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background: #EF4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #DC2626;
}

/* Préférences */
.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #F8FAFC;
  border-radius: 12px;
}

.preference-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.preference-info p {
  color: #64748B;
  font-size: 0.9rem;
  margin: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #CBD5E1;
  transition: 0.4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #293848, #10B981);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.language-select {
  padding: 0.5rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

/* Sécurité */
.security-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #F8FAFC;
  border-radius: 12px;
}

.security-item.two-factor-item {
  background: linear-gradient(135deg, #F0F9FF, #E0F2FE);
  border: 2px solid #BAE6FD;
}

.security-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #293848, #10B981);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-icon.active {
  background: linear-gradient(135deg, #10B981, #059669);
}

.security-info {
  flex: 1;
}

.security-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.security-info p {
  color: #64748B;
  font-size: 0.9rem;
  margin: 0;
}

.btn-secondary {
  background: white;
  color: #293848;
  border: 2px solid #293848;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #293848;
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #293848, #10B981);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-danger {
  background: #EF4444;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #DC2626;
}

/* Messages */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10B981;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #EF4444;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    display: flex;
    overflow-x: auto;
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid #E5E7EB;
  }

  .sidebar-item {
    flex-shrink: 0;
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
}

@media (max-width: 640px) {
  .settings-page {
    padding: 1rem;
  }

  .settings-header h1 {
    font-size: 2rem;
  }

  .settings-content {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .security-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
