<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Inviter des membres</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label>Email du membre *</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Rôle</label>
          <div class="role-selector">
            <div
              v-for="role in roles"
              :key="role.value"
              @click="selectedRole = role.value"
              :class="['role-option', { active: selectedRole === role.value }]"
            >
              <i :class="role.icon"></i>
              <div>
                <div class="role-name">{{ role.label }}</div>
                <div class="role-description">{{ role.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Compétences (optionnel)</label>
          <input
            v-model="skills"
            type="text"
            placeholder="Ex: Développement, Design, Marketing..."
          />
          <p class="help-text">Séparez les compétences par des virgules</p>
        </div>

        <div class="form-group">
          <label>Message personnalisé (optionnel)</label>
          <textarea
            v-model="message"
            placeholder="Bonjour, je t'invite à rejoindre mon projet..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn-primary">
            <i class="fa-solid fa-paper-plane"></i>
            Envoyer l'invitation
          </button>
        </div>
      </form>

      <!-- Liste des invitations en attente -->
      <div v-if="pendingInvitations.length > 0" class="pending-section">
        <h3>Invitations en attente</h3>
        <div class="pending-list">
          <div
            v-for="invitation in pendingInvitations"
            :key="invitation.id"
            class="pending-item"
          >
            <div class="pending-info">
              <div class="pending-email">{{ invitation.email }}</div>
              <div class="pending-role">{{ getRoleLabel(invitation.role) }}</div>
            </div>
            <div class="pending-status">
              <span class="status-badge pending">En attente</span>
              <button @click="cancelInvitation(invitation.id)" class="cancel-btn">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PROJECT_ROLES } from '@/types/projectModels'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'invited'])

const email = ref('')
const selectedRole = ref(PROJECT_ROLES.MEMBER)
const skills = ref('')
const message = ref('')

const roles = [
  {
    value: PROJECT_ROLES.ADMIN,
    label: 'Admin',
    description: 'Peut gérer le projet et les membres',
    icon: 'fa-solid fa-shield-halved',
  },
  {
    value: PROJECT_ROLES.MEMBER,
    label: 'Membre',
    description: 'Peut voir et modifier les tâches',
    icon: 'fa-solid fa-user',
  },
  {
    value: PROJECT_ROLES.VIEWER,
    label: 'Lecteur',
    description: 'Peut seulement voir le projet',
    icon: 'fa-solid fa-eye',
  },
]

const pendingInvitations = ref([
  {
    id: 1,
    email: 'marie@example.com',
    role: PROJECT_ROLES.MEMBER,
    sentAt: new Date(Date.now() - 3600000).toISOString(),
  },
])

const getRoleLabel = (role) => {
  const roleObj = roles.find((r) => r.value === role)
  return roleObj ? roleObj.label : role
}

const handleSubmit = () => {
  const member = {
    id: Date.now(),
    userId: Date.now(),
    username: email.value.split('@')[0],
    email: email.value,
    role: selectedRole.value,
    status: 'pending',
    skills: skills.value.split(',').map((s) => s.trim()).filter((s) => s),
    joinedAt: new Date().toISOString(),
  }

  emit('invited', member)

  // Ajouter aux invitations en attente
  pendingInvitations.value.push({
    id: member.id,
    email: email.value,
    role: selectedRole.value,
    sentAt: new Date().toISOString(),
  })

  // Reset form
  email.value = ''
  skills.value = ''
  message.value = ''
}

const cancelInvitation = (invitationId) => {
  pendingInvitations.value = pendingInvitations.value.filter((i) => i.id !== invitationId)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.help-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-option {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.role-option.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.role-option i {
  font-size: 1.5rem;
  color: #667eea;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-name {
  font-weight: 600;
  color: #1f2937;
}

.role-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.pending-section {
  padding: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.pending-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.pending-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pending-email {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.pending-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.pending-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.cancel-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.375rem;
  background: #fee2e2;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn:hover {
  background: #fecaca;
}
</style>
