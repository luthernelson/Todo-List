<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Partager le projet</h2>
        <button @click="$emit('close')" class="close-btn">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div class="share-form">
          <div class="form-group">
            <label>Inviter par email</label>
            <div class="email-input-group">
              <input
                v-model="emailInput"
                type="email"
                placeholder="exemple@email.com"
                @keydown.enter="inviteUser"
              />
              <CustomButton
                @click="inviteUser"
                :loading="inviting"
                variant="primary"
                size="small"
              >
                Inviter
              </CustomButton>
            </div>
          </div>

          <div class="form-group">
            <label>Permissions</label>
            <CustomSelect
              v-model="selectedPermission"
              :options="permissionOptions"
              placeholder="Sélectionner les permissions"
            />
          </div>
        </div>

        <div class="shared-users">
          <h3>Personnes avec accès</h3>
          <div v-if="sharedUsers.length === 0" class="empty-state">
            <Users :size="32" />
            <p>Aucun partage en cours</p>
          </div>
          <div v-else class="users-list">
            <div
              v-for="user in sharedUsers"
              :key="user.id"
              class="user-item"
            >
              <div class="user-info">
                <div class="user-avatar">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="user-name">{{ user.username }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <div class="user-permission">
                <span :class="['permission-badge', user.permission]">
                  {{ getPermissionLabel(user.permission) }}
                </span>
              </div>
              <div class="user-actions">
                <button
                  @click="removeUser(user.id)"
                  class="remove-btn"
                  title="Retirer l'accès"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="share-link">
          <h3>Lien de partage</h3>
          <div class="link-input-group">
            <input
              :value="shareLink"
              readonly
              class="share-link-input"
            />
            <CustomButton
              @click="copyLink"
              variant="outline"
              size="small"
            >
              <Copy :size="16" />
            </CustomButton>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <CustomButton @click="$emit('close')" variant="secondary">
          Fermer
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, Users, Trash2, Copy } from 'lucide-vue-next'
import CustomButton from '@/components/ui/CustomButton.vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'invite', 'remove'])

const emailInput = ref('')
const selectedPermission = ref('read')
const inviting = ref(false)

const permissionOptions = [
  { value: 'read', label: 'Lecture seule' },
  { value: 'write', label: 'Lecture et écriture' },
  { value: 'admin', label: 'Administrateur' },
]

const sharedUsers = computed(() => {
  return props.project.sharedWith || []
})

const shareLink = computed(() => {
  return `${window.location.origin}/project/${props.project.id}/share`
})

const getPermissionLabel = (permission) => {
  const labels = {
    read: 'Lecture',
    write: 'Écriture',
    admin: 'Admin',
  }
  return labels[permission] || permission
}

const inviteUser = async () => {
  if (!emailInput.value) return

  inviting.value = true
  try {
    emit('invite', {
      email: emailInput.value,
      permission: selectedPermission.value,
    })
    emailInput.value = ''
  } finally {
    inviting.value = false
  }
}

const removeUser = (userId) => {
  emit('remove', userId)
}

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(29, 40, 61);
  margin: 0;
}

.close-btn {
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

.close-btn:hover {
  background: #e5e7eb;
  color: rgb(29, 40, 61);
}

.modal-body {
  padding: 1.5rem;
}

.share-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: rgb(29, 40, 61);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.email-input-group {
  display: flex;
  gap: 0.5rem;
}

.email-input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.email-input-group input:focus {
  outline: none;
  border-color: rgb(29, 40, 61);
}

.shared-users {
  margin-bottom: 2rem;
}

.shared-users h3 {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(29, 40, 61);
  margin-bottom: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
  gap: 0.5rem;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(29, 40, 61);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-weight: 600;
  color: rgb(29, 40, 61);
  font-size: 0.875rem;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.user-permission {
  flex-shrink: 0;
}

.permission-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.permission-badge.read {
  background: #eff6ff;
  color: #3b82f6;
}

.permission-badge.write {
  background: #fef3c7;
  color: #f59e0b;
}

.permission-badge.admin {
  background: #fee2e2;
  color: #ef4444;
}

.user-actions {
  flex-shrink: 0;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  background: white;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fef2f2;
}

.share-link h3 {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(29, 40, 61);
  margin-bottom: 0.75rem;
}

.link-input-group {
  display: flex;
  gap: 0.5rem;
}

.share-link-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f9fafb;
  color: #6b7280;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
