<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Administration - Gestion des Utilisateurs</h1>
      <p class="subtitle">Créez et gérez les comptes utilisateurs</p>
    </div>

    <!-- Formulaire de création d'utilisateur -->
    <div class="create-user-section">
      <h2>Créer un nouvel utilisateur</h2>
      <form @submit.prevent="createUser" class="user-form">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="newUser.username"
            type="text"
            required
            placeholder="Ex: JeanDupont"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="newUser.email"
            type="email"
            required
            placeholder="Ex: jean@taskflow.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="newUser.password"
            type="password"
            required
            placeholder="Minimum 6 caractères"
          />
        </div>

        <div class="form-group">
          <label for="mode">Mode</label>
          <select id="mode" v-model="newUser.mode" required>
            <option value="perso">Personnel</option>
            <option value="pro">Professionnel</option>
          </select>
        </div>

        <button type="submit" class="btn-create">
          <span class="icon">+</span> Créer l'utilisateur
        </button>
      </form>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="users-list-section">
      <h2>Liste des utilisateurs ({{ users.length }})</h2>
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
              <h3>{{ user.username }}</h3>
              <p class="email">{{ user.email }}</p>
            </div>
            <span class="badge" :class="user.mode">{{ user.mode.toUpperCase() }}</span>
          </div>

          <div class="user-details">
            <div class="detail">
              <span class="label">Rôle:</span>
              <span class="value">{{ user.role }}</span>
            </div>
            <div class="detail">
              <span class="label">ID:</span>
              <span class="value">{{ user.id }}</span>
            </div>
          </div>

          <div class="user-actions" v-if="user.role !== 'admin'">
            <button @click="deleteUser(user.id)" class="btn-delete">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const newUser = ref({
  username: '',
  email: '',
  password: '',
  mode: 'perso',
})

const users = ref([])
const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
  loadUsers()
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
      errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères'
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
    successMessage.value = `Utilisateur ${createdUser.username} créé avec succès!`
    errorMessage.value = ''

    // Reset form
    newUser.value = {
      username: '',
      email: '',
      password: '',
      mode: 'perso',
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message
    successMessage.value = ''
  }
}

const deleteUser = (userId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
    try {
      userStore.deleteUser(userId)
      users.value = users.value.filter((u) => u.id !== userId)
      successMessage.value = 'Utilisateur supprimé avec succès!'
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
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.create-user-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.create-user-section h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.user-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn-create {
  grid-column: 1 / -1;
  background: #3b82f6;
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

.icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.users-list-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.users-list-section h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.user-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-card.is-admin {
  background: #fef3c7;
  border-color: #f59e0b;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0;
}

.email {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0 0 0;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.pro {
  background: #dbeafe;
  color: #1e40af;
}

.badge.perso {
  background: #d1fae5;
  color: #065f46;
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
  color: #666;
  font-weight: 600;
}

.detail .value {
  font-size: 0.9rem;
  color: #333;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #dc2626;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
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
  background: #ef4444;
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
</style>
