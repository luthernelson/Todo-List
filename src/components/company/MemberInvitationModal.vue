<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Inviter un membre</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label>Email *</label>
          <input
            v-model="email"
            type="email"
            placeholder="collegue@entreprise.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Nom complet</label>
          <input
            v-model="username"
            type="text"
            placeholder="Jean Dupont"
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
          <label>Département (optionnel)</label>
          <input
            v-model="department"
            type="text"
            placeholder="Ex: Marketing, Développement..."
          />
        </div>

        <div class="form-group">
          <label>Poste (optionnel)</label>
          <input
            v-model="jobTitle"
            type="text"
            placeholder="Ex: Chef de projet, Développeur..."
          />
        </div>

        <div class="form-group">
          <label>Message personnalisé (optionnel)</label>
          <textarea
            v-model="message"
            placeholder="Bonjour, je t'invite à rejoindre notre équipe sur TaskFlow Pro..."
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'invited'])

const email = ref('')
const username = ref('')
const selectedRole = ref('member')
const department = ref('')
const jobTitle = ref('')
const message = ref('')

const roles = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Peut gérer les projets et inviter des membres',
    icon: 'fa-solid fa-shield-halved',
  },
  {
    value: 'member',
    label: 'Membre',
    description: 'Peut voir et modifier les tâches assignées',
    icon: 'fa-solid fa-user',
  },
]

const handleSubmit = () => {
  const member = {
    id: Date.now(),
    companyId: props.company.id,
    userId: Date.now(),
    email: email.value,
    username: username.value || email.value.split('@')[0],
    role: selectedRole.value,
    status: 'pending',
    department: department.value,
    jobTitle: jobTitle.value,
    invitedAt: new Date().toISOString(),
  }

  emit('invited', member)

  // Reset form
  email.value = ''
  username.value = ''
  department.value = ''
  jobTitle.value = ''
  message.value = ''
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
</style>
