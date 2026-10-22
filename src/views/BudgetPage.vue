<template>
  <div class="budget-page">
    <div class="budget-header">
      <h1>Gestion du Budget</h1>
      <button @click="showBudgetModal = true" class="btn-primary">
        <i class="fa-solid fa-plus"></i>
        Nouveau budget
      </button>
    </div>

    <div v-if="projectsWithBudget.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-coins"></i>
      </div>
      <h3>Aucun budget défini</h3>
      <p>Créez un budget pour suivre vos dépenses par projet</p>
      <button @click="showBudgetModal = true" class="btn-primary">
        Créer un budget
      </button>
    </div>

    <div v-else class="budget-grid">
      <div
        v-for="project in projectsWithBudget"
        :key="project.id"
        class="budget-card"
      >
        <div class="budget-card-header">
          <div class="project-info">
            <div class="project-dot" :style="{ background: project.color }"></div>
            <h3>{{ project.name }}</h3>
          </div>
          <span class="budget-amount">{{ project.budget.totalBudget }}€</span>
        </div>

        <div class="budget-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: calculateBudgetProgress(project.budget) + '%' }"
              :class="{
                'warning': calculateBudgetProgress(project.budget) > 80,
                'danger': calculateBudgetProgress(project.budget) > 95
              }"
            ></div>
          </div>
          <div class="budget-details">
            <span class="spent">Dépensé: {{ project.budget.spent }}€</span>
            <span class="remaining">Restant: {{ project.budget.remaining }}€</span>
          </div>
        </div>

        <div class="budget-actions">
          <button @click="editBudget(project)" class="btn-secondary">
            <i class="fa-solid fa-edit"></i>
            Modifier
          </button>
          <button @click="viewDetails(project)" class="btn-ghost">
            <i class="fa-solid fa-eye"></i>
            Détails
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de budget -->
    <BudgetModal
      v-if="showBudgetModal"
      :project="editingProject"
      @close="showBudgetModal = false"
      @saved="onBudgetSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import BudgetModal from '@/components/projects/BudgetModal.vue'

const projectStore = useProjectStore()
const showBudgetModal = ref(false)
const editingProject = ref(null)

const projectsWithBudget = computed(() => {
  return projectStore.projects.filter(p => p.budget && p.budget.totalBudget > 0)
})

const calculateBudgetProgress = (budget) => {
  if (budget.totalBudget === 0) return 0
  return (budget.spent / budget.totalBudget) * 100
}

const editBudget = (project) => {
  editingProject.value = project
  showBudgetModal.value = true
}

const viewDetails = (project) => {
  // Implémenter la vue détaillée du budget
  console.log('Voir détails pour', project.name)
}

const onBudgetSaved = () => {
  showBudgetModal.value = false
  editingProject.value = null
}
</script>

<style scoped>
.budget-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.budget-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #293848;
  color: white;
}

.btn-primary:hover {
  background: #1E3A5F;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #E5E7EB;
}

.btn-secondary:hover {
  border-color: #293848;
  color: #293848;
}

.btn-ghost {
  background: transparent;
  color: #6B7280;
}

.btn-ghost:hover {
  color: #293848;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #E5E7EB;
}

.empty-icon {
  font-size: 4rem;
  color: #D1D5DB;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6B7280;
  margin-bottom: 1.5rem;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.budget-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.budget-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.project-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.project-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.budget-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10B981;
}

.budget-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: #10B981;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: #F59E0B;
}

.progress-fill.danger {
  background: #EF4444;
}

.budget-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6B7280;
}

.budget-actions {
  display: flex;
  gap: 0.75rem;
}

.budget-actions button {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .budget-page {
    padding: 1rem;
  }

  .budget-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .budget-grid {
    grid-template-columns: 1fr;
  }
}
</style>
