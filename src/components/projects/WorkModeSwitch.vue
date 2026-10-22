<template>
  <div class="work-mode-switch">
    <div class="switch-container">
      <button
        @click="setMode('professional')"
        :class="['mode-button', { active: currentMode === 'professional' }]"
        class="professional"
      >
        <i class="fa-solid fa-briefcase"></i>
        <span>Entreprise</span>
      </button>
      <button
        @click="setMode('personal')"
        :class="['mode-button', { active: currentMode === 'personal' }]"
        class="personal"
      >
        <i class="fa-solid fa-user"></i>
        <span>Personnel</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { WORK_MODES } from '@/types/projectModels'

const projectStore = useProjectStore()

const currentMode = computed(() => projectStore.currentWorkMode)

const setMode = (mode) => {
  projectStore.setWorkMode(mode)
}
</script>

<style scoped>
.work-mode-switch {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.switch-container {
  display: flex;
  background: #f3f4f6;
  border-radius: 9999px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.mode-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: transparent;
  color: #6b7280;
}

.mode-button.professional:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.mode-button.personal:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.mode-button.active.professional {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.mode-button.active.personal {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.mode-button i {
  font-size: 1rem;
}
</style>
