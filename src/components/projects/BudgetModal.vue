<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Gestion du budget</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="budget-toggle">
          <label class="toggle-label">
            <input type="checkbox" v-model="budgetData.enabled" @change="toggleBudget" />
            <span class="toggle-slider"></span>
            <span>Activer le budget pour ce projet</span>
          </label>
        </div>

        <div v-if="budgetData.enabled" class="budget-form">
          <div class="form-group">
            <label>Budget total (€)</label>
            <input
              type="number"
              v-model.number="budgetData.totalBudget"
              placeholder="5000"
              min="0"
              step="100"
            />
          </div>

          <div class="form-group">
            <label>Devise</label>
            <select v-model="budgetData.currency">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Seuil d'alerte (%)</label>
            <input
              type="number"
              v-model.number="budgetData.alertThreshold"
              placeholder="80"
              min="50"
              max="100"
            />
            <small>Alerte quand le budget atteint ce pourcentage</small>
          </div>

          <div class="budget-summary">
            <div class="summary-item">
              <span class="label">Budget total:</span>
              <span class="value">{{ budgetData.totalBudget }} {{ budgetData.currency }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Dépensé:</span>
              <span class="value">{{ budgetData.spent }} {{ budgetData.currency }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Restant:</span>
              <span class="value" :class="{ 'danger': budgetData.remaining <= 0 }">
                {{ budgetData.remaining }} {{ budgetData.currency }}
              </span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: budgetProgress + '%' }"
                :class="{
                  'warning': budgetProgress > 80,
                  'danger': budgetProgress > 95
                }"
              ></div>
            </div>
            <span class="progress-text">{{ budgetProgress.toFixed(1) }}% utilisé</span>
          </div>

          <div class="expenses-section">
            <h3>Dépenses globales</h3>
            <div v-if="budgetData.expenses.length === 0" class="no-expenses">
              <p>Aucune dépense enregistrée</p>
            </div>
            <div v-else class="expenses-list">
              <div v-for="expense in budgetData.expenses" :key="expense.id" class="expense-item">
                <div class="expense-info">
                  <h4>{{ expense.description }}</h4>
                  <span class="expense-date">{{ formatDate(expense.date) }}</span>
                  <span class="expense-category">{{ getCategoryLabel(expense.category) }}</span>
                </div>
                <div class="expense-amount">
                  <span class="amount">-{{ expense.amount }} {{ budgetData.currency }}</span>
                  <button @click="removeExpense(expense.id)" class="btn-remove">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <button @click="showAddExpense = true" class="btn-add-expense">
              <i class="fa-solid fa-plus"></i>
              Ajouter une dépense
            </button>
          </div>

          <!-- Budget par tâche -->
          <div class="task-budgets-section">
            <h3>Budget par tâche</h3>
            <p class="section-description">Affectez un budget spécifique à chaque tâche</p>

            <div v-if="projectTasks.length === 0" class="no-tasks">
              <p>Aucune tâche dans ce projet</p>
            </div>
            <div v-else class="task-budgets-list">
              <div v-for="task in projectTasks" :key="task.id" class="task-budget-item">
                <div class="task-info">
                  <h4>{{ task.title }}</h4>
                  <span class="task-status">{{ translateStatus(task.status) }}</span>
                </div>
                <div class="task-budget-input">
                  <input
                    type="number"
                    v-model.number="task.budgetAmount"
                    placeholder="0"
                    min="0"
                    step="100"
                    @change="updateTaskBudget(task)"
                  />
                  <span class="currency">{{ budgetData.currency }}</span>
                </div>
              </div>
            </div>

            <div class="tasks-budget-summary">
              <div class="summary-row">
                <span>Total alloué aux tâches:</span>
                <span class="value">{{ totalTasksBudget }} {{ budgetData.currency }}</span>
              </div>
              <div class="summary-row">
                <span>Budget disponible:</span>
                <span class="value" :class="{ 'danger': availableBudget < 0 }">
                  {{ availableBudget }} {{ budgetData.currency }}
                </span>
              </div>
            </div>
          </div>

          <!-- Formulaire d'ajout de dépense -->
          <div v-if="showAddExpense" class="add-expense-form">
            <div class="form-group">
              <label>Description</label>
              <input type="text" v-model="newExpense.description" placeholder="Ex: Licences logicielles" />
            </div>
            <div class="form-group">
              <label>Montant (€)</label>
              <input type="number" v-model.number="newExpense.amount" placeholder="100" min="0" />
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select v-model="newExpense.category">
                <option value="software">Logiciels</option>
                <option value="hardware">Matériel</option>
                <option value="services">Services</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div class="form-actions">
              <button @click="showAddExpense = false" class="btn-cancel">Annuler</button>
              <button @click="addExpense" class="btn-confirm">Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-cancel">Fermer</button>
        <button @click="saveBudget" class="btn-save">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'save'])

const budgetData = ref({
  enabled: props.project?.budget?.enabled || false,
  totalBudget: props.project?.budget?.totalBudget || 0,
  currency: props.project?.budget?.currency || 'EUR',
  spent: props.project?.budget?.spent || 0,
  remaining: props.project?.budget?.remaining || 0,
  alertThreshold: props.project?.budget?.alertThreshold || 80,
  expenses: props.project?.budget?.expenses || [],
})

const showAddExpense = ref(false)
const newExpense = ref({
  description: '',
  amount: 0,
  category: 'other',
})

// Tâches du projet avec leur budget
const projectTasks = ref((props.project?.tasks || []).map(task => ({
  ...task,
  budgetAmount: task.budgetAmount || 0
})))

const budgetProgress = computed(() => {
  if (budgetData.value.totalBudget === 0) return 0
  return (budgetData.value.spent / budgetData.value.totalBudget) * 100
})

const totalTasksBudget = computed(() => {
  return projectTasks.value.reduce((sum, task) => sum + (task.budgetAmount || 0), 0)
})

const availableBudget = computed(() => {
  return budgetData.value.totalBudget - totalTasksBudget.value
})

watch(() => budgetData.value.totalBudget, (newVal) => {
  budgetData.value.remaining = newVal - budgetData.value.spent
})

watch(() => budgetData.value.spent, (newVal) => {
  budgetData.value.remaining = budgetData.value.totalBudget - newVal
})

const toggleBudget = () => {
  if (!budgetData.value.enabled) {
    budgetData.value.totalBudget = 0
    budgetData.value.spent = 0
    budgetData.value.remaining = 0
    budgetData.value.expenses = []
  }
}

const addExpense = () => {
  if (newExpense.value.description && newExpense.value.amount > 0) {
    const expense = {
      id: Date.now(),
      description: newExpense.value.description,
      amount: newExpense.value.amount,
      category: newExpense.value.category,
      date: new Date().toISOString(),
    }
    budgetData.value.expenses.push(expense)
    budgetData.value.spent += newExpense.value.amount
    budgetData.value.remaining = budgetData.value.totalBudget - budgetData.value.spent
    newExpense.value = { description: '', amount: 0, category: 'other' }
    showAddExpense.value = false
  }
}

const removeExpense = (expenseId) => {
  const expense = budgetData.value.expenses.find(e => e.id === expenseId)
  if (expense) {
    budgetData.value.spent -= expense.amount
    budgetData.value.remaining = budgetData.value.totalBudget - budgetData.value.spent
    budgetData.value.expenses = budgetData.value.expenses.filter(e => e.id !== expenseId)
  }
}

const updateTaskBudget = (task) => {
  // La mise à jour sera effectuée lors de la sauvegarde
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getCategoryLabel = (category) => {
  const labels = {
    software: 'Logiciels',
    hardware: 'Matériel',
    services: 'Services',
    other: 'Autre'
  }
  return labels[category] || category
}

const translateStatus = (status) => {
  const translations = {
    todo: 'À faire',
    in_progress: 'En cours',
    review: 'En révision',
    done: 'Terminé',
    blocked: 'Bloqué'
  }
  return translations[status] || status
}

const saveBudget = () => {
  // Inclure les budgets des tâches dans les données à sauvegarder
  const tasksWithBudget = projectTasks.value.map(task => ({
    id: task.id,
    budgetAmount: task.budgetAmount
  }))

  emit('save', {
    ...budgetData.value,
    tasksBudget: tasksWithBudget
  })
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
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
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
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.budget-toggle {
  margin-bottom: 1.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
}

.toggle-label input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  width: 48px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 9999px;
  position: relative;
  transition: background 0.3s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-label input:checked + .toggle-slider {
  background: #293848;
}

.toggle-label input:checked + .toggle-slider::after {
  transform: translateX(24px);
}

.budget-form {
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
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  color: #6b7280;
  font-size: 0.8rem;
}

.budget-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  font-weight: 600;
  color: #6b7280;
}

.summary-item .value {
  font-weight: 700;
  color: #1f2937;
}

.summary-item .value.danger {
  color: #ef4444;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #293848;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: #F59E0B;
}

.progress-fill.danger {
  background: #EF4444;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-align: right;
}

.expenses-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expenses-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.no-expenses {
  text-align: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #e5e7eb;
}

.no-expenses p {
  color: #6b7280;
  margin: 0;
}

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.expense-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.expense-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.expense-amount {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.expense-amount .amount {
  font-weight: 700;
  color: #ef4444;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.375rem;
  background: #fee2e2;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-add-expense {
  padding: 0.75rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-add-expense:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.add-expense-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-save {
  background: #293848;
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.modal-footer .btn-cancel,
.modal-footer .btn-save {
  flex: 1;
}

/* Section Budget par Tâche */
.task-budgets-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.task-budgets-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.no-tasks {
  text-align: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #e5e7eb;
}

.no-tasks p {
  color: #6b7280;
  margin: 0;
}

.task-budgets-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-status {
  font-size: 0.75rem;
  color: #6b7280;
}

.task-budget-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.task-budget-input input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: right;
  transition: border-color 0.2s;
}

.task-budget-input input:focus {
  outline: none;
  border-color: #293848;
}

.task-budget-input .currency {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.tasks-budget-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 0.5rem;
  border: 1px solid #bae6fd;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.summary-row span:first-child {
  color: #6b7280;
  font-weight: 600;
}

.summary-row .value {
  font-weight: 700;
  color: #1f2937;
}

.summary-row .value.danger {
  color: #ef4444;
}

.expense-category {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}
</style>
