<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Créer un nouveau projet</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label>Nom du projet *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Ex: Site Web E-commerce"
            required
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="formData.description"
            placeholder="Décrivez votre projet..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Couleur</label>
          <div class="color-picker">
            <div
              v-for="color in colors"
              :key="color"
              @click="formData.color = color"
              :class="['color-option', { active: formData.color === color }]"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </div>

        <div class="form-group">
          <label>Icône</label>
          <div class="icon-picker">
            <div
              v-for="icon in icons"
              :key="icon.value"
              @click="formData.icon = icon.value"
              :class="['icon-option', { active: formData.icon === icon.value }]"
            >
              <i :class="icon.class"></i>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Mode</label>
          <div class="mode-selector">
            <div
              @click="formData.mode = 'professional'"
              :class="['mode-option', { active: formData.mode === 'professional' }]"
            >
              <i class="fa-solid fa-briefcase"></i>
              <span>Entreprise</span>
            </div>
            <div
              @click="formData.mode = 'personal'"
              :class="['mode-option', { active: formData.mode === 'personal' }]"
            >
              <i class="fa-solid fa-user"></i>
              <span>Personnel</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.budgetEnabled" />
            <span class="checkbox-custom"></span>
            <span>Activer le budget pour ce projet</span>
          </label>
        </div>

        <div v-if="formData.budgetEnabled" class="form-group">
          <label>Budget total (€)</label>
          <input
            v-model.number="formData.totalBudget"
            type="number"
            placeholder="5000"
            min="0"
            step="100"
          />
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn-primary">
            Créer le projet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { WORK_MODES } from '@/types/projectModels'

const props = defineProps({
  mode: {
    type: String,
    default: WORK_MODES.PERSONAL,
  },
})

defineEmits(['close', 'created'])

const formData = ref({
  name: '',
  description: '',
  color: '#293848',
  icon: 'folder',
  mode: props.mode,
  budgetEnabled: false,
  totalBudget: 0,
})

const colors = [
  '#293848', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
]

const icons = [
  { value: 'folder', class: 'fa-solid fa-folder' },
  { value: 'code', class: 'fa-solid fa-code' },
  { value: 'design', class: 'fa-solid fa-palette' },
  { value: 'rocket', class: 'fa-solid fa-rocket' },
  { value: 'home', class: 'fa-solid fa-home' },
  { value: 'briefcase', class: 'fa-solid fa-briefcase' },
]

onMounted(() => {
  formData.value.mode = props.mode
})

const handleSubmit = () => {
  const project = {
    ...formData.value,
    id: Date.now(),
    ownerId: 1, // À remplacer par l'ID utilisateur réel
    members: [],
    phases: [],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
    settings: {
      allowGuestAccess: false,
      requireApproval: false,
      notificationsEnabled: true,
    },
    planning: {
      estimatedStartDate: null,
      estimatedEndDate: null,
      actualStartDate: null,
      actualEndDate: null,
      totalEstimatedHours: 0,
    },
    budget: {
      enabled: formData.value.budgetEnabled,
      totalBudget: formData.value.totalBudget || 0,
      currency: 'EUR',
      spent: 0,
      remaining: formData.value.totalBudget || 0,
      expenses: [],
      alertThreshold: 80,
    },
  }

  emit('created', project)
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
  max-width: 500px;
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
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-picker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #1f2937;
  transform: scale(1.1);
}

.icon-picker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.icon-option {
  width: 48px;
  height: 48px;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  font-size: 1.25rem;
}

.icon-option:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.icon-option.active {
  border-color: #3b82f6;
  background: #dbeafe;
  color: #3b82f6;
}

.mode-selector {
  display: flex;
  gap: 1rem;
}

.mode-option {
  flex: 1;
  padding: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.mode-option:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.mode-option.active {
  border-color: #3b82f6;
  background: #dbeafe;
  color: #3b82f6;
}

.mode-option i {
  font-size: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #293848;
  border-color: transparent;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
