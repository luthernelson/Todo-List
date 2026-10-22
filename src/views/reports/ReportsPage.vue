<template>
  <div class="reports-page">
    <div class="reports-header">
      <h1>{{ $t('reports.title') }}</h1>
      <p class="subtitle">{{ $t('reports.subtitle') }}</p>
    </div>

    <!-- Filtres -->
    <div class="filters-section">
      <div class="filter-group">
        <label>{{ $t('reports.project') }}</label>
        <select v-model="selectedProject" class="filter-select">
          <option value="all">{{ $t('reports.allProjects') }}</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>{{ $t('reports.period') }}</label>
        <select v-model="selectedPeriod" class="filter-select">
          <option value="week">{{ $t('reports.thisWeek') }}</option>
          <option value="month">{{ $t('reports.thisMonth') }}</option>
          <option value="quarter">{{ $t('reports.thisQuarter') }}</option>
          <option value="year">{{ $t('reports.thisYear') }}</option>
          <option value="custom">{{ $t('reports.custom') }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>{{ $t('reports.reportType') }}</label>
        <select v-model="selectedReportType" class="filter-select">
          <option value="all">{{ $t('reports.allTypes') }}</option>
          <option value="summary">{{ $t('reports.summary') }}</option>
          <option value="budget">{{ $t('reports.budget') }}</option>
          <option value="progress">{{ $t('reports.progress') }}</option>
        </select>
      </div>

      <button @click="generateReport" class="btn-generate">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        {{ $t('reports.generate') }}
      </button>
    </div>

    <!-- Statistiques globales -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: #293848;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </div>
        <div class="stat-info">
          <h3>{{ totalProjects }}</h3>
          <p>{{ $t('reports.totalProjects') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #10B981;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-info">
          <h3>{{ completedTasks }}</h3>
          <p>{{ $t('reports.completedTasks') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #F59E0B;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-info">
          <h3>{{ totalHours }}h</h3>
          <p>{{ $t('reports.totalHours') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #8B5CF6;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-info">
          <h3>{{ totalBudget }}€</h3>
          <p>{{ $t('reports.totalBudget') }}</p>
        </div>
      </div>
    </div>

    <!-- Rapports récents -->
    <div class="reports-section">
      <div class="section-header">
        <h2>{{ $t('reports.recentReports') }}</h2>
        <button @click="createNewReport" class="btn-create">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {{ $t('reports.createReport') }}
        </button>
      </div>

      <div class="reports-grid">
        <div v-for="report in reports" :key="report.id" class="report-card">
          <div class="report-header">
            <div class="report-icon" :class="report.type">
              <svg v-if="report.type === 'summary'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <svg v-if="report.type === 'budget'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <svg v-if="report.type === 'progress'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div class="report-info">
              <h4>{{ report.title }}</h4>
              <p>{{ formatDate(report.generatedAt) }}</p>
            </div>
            <span class="report-badge">{{ getReportTypeLabel(report.type) }}</span>
          </div>

          <div class="report-metrics">
            <div class="metric">
              <span class="label">{{ $t('reports.tasks') }}:</span>
              <span class="value">{{ report.metrics.totalTasks }}</span>
            </div>
            <div class="metric">
              <span class="label">{{ $t('reports.completed') }}:</span>
              <span class="value">{{ report.metrics.completedTasks }}</span>
            </div>
            <div class="metric">
              <span class="label">{{ $t('reports.hours') }}:</span>
              <span class="value">{{ report.metrics.totalHours }}h</span>
            </div>
          </div>

          <div class="report-actions">
            <button @click="viewReport(report)" class="btn-view">
              {{ $t('reports.view') }}
            </button>
            <button @click="exportReport(report)" class="btn-export">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {{ $t('reports.export') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rapports budgétaires par projet -->
    <div class="budget-section">
      <h2>{{ $t('reports.budgetReports') }}</h2>
      <div class="budget-cards">
        <div v-for="project in projectsWithBudget" :key="project.id" class="budget-card">
          <div class="budget-header">
            <h3>{{ project.name }}</h3>
            <span class="budget-amount">{{ project.budget.totalBudget }}€</span>
          </div>
          <div class="budget-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: calculateBudgetProgress(project.budget) + '%' }"
                :class="{ 'warning': calculateBudgetProgress(project.budget) > 80, 'danger': calculateBudgetProgress(project.budget) > 95 }"
              ></div>
            </div>
            <div class="budget-details">
              <span>{{ $t('reports.spent') }}: {{ project.budget.spent }}€</span>
              <span>{{ $t('reports.remaining') }}: {{ project.budget.remaining }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/projectStore'

const { t } = useI18n()
const projectStore = useProjectStore()

const selectedProject = ref('all')
const selectedPeriod = ref('month')
const selectedReportType = ref('all')

const projects = ref([
  { id: 1, name: 'Projet Alpha', budget: { totalBudget: 5000, spent: 3200, remaining: 1800 } },
  { id: 2, name: 'Projet Beta', budget: { totalBudget: 10000, spent: 7500, remaining: 2500 } },
  { id: 3, name: 'Projet Gamma', budget: { totalBudget: 3000, spent: 2100, remaining: 900 } },
])

const reports = ref([
  {
    id: 1,
    title: 'Rapport mensuel - Janvier',
    type: 'summary',
    generatedAt: new Date().toISOString(),
    metrics: { totalTasks: 45, completedTasks: 32, totalHours: 120 },
  },
  {
    id: 2,
    title: 'Budget - Projet Alpha',
    type: 'budget',
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    metrics: { totalTasks: 20, completedTasks: 15, totalHours: 65 },
  },
  {
    id: 3,
    title: 'Progression - Q1 2024',
    type: 'progress',
    generatedAt: new Date(Date.now() - 172800000).toISOString(),
    metrics: { totalTasks: 80, completedTasks: 55, totalHours: 200 },
  },
])

const totalProjects = computed(() => projects.value.length)
const completedTasks = computed(() => reports.value.reduce((sum, r) => sum + r.metrics.completedTasks, 0))
const totalHours = computed(() => reports.value.reduce((sum, r) => sum + r.metrics.totalHours, 0))
const totalBudget = computed(() => projects.value.reduce((sum, p) => sum + p.budget.totalBudget, 0))

const projectsWithBudget = computed(() => projects.value.filter(p => p.budget.totalBudget > 0))

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getReportTypeLabel = (type) => {
  const labels = {
    summary: t('reports.summary'),
    budget: t('reports.budget'),
    progress: t('reports.progress'),
  }
  return labels[type] || type
}

const calculateBudgetProgress = (budget) => {
  if (budget.totalBudget === 0) return 0
  return (budget.spent / budget.totalBudget) * 100
}

const generateReport = () => {
  alert('Génération de rapport - À implémenter avec l\'API')
}

const createNewReport = () => {
  alert('Création de nouveau rapport - À implémenter')
}

const viewReport = (report) => {
  alert(`Voir le rapport: ${report.title}`)
}

const exportReport = (report) => {
  alert(`Exporter le rapport: ${report.title}`)
}

onMounted(() => {
  // Charger les données réelles depuis le store
})
</script>

<style scoped>
.reports-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.reports-header {
  margin-bottom: 2rem;
}

.reports-header h1 {
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

.filters-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #293848;
}

.btn-generate {
  padding: 0.75rem 1.5rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  height: fit-content;
  align-self: flex-end;
}

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.stat-info p {
  color: #6B7280;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.reports-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: #F8FAFC;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.report-card:hover {
  border-color: #293848;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.report-icon {
  width: 45px;
  height: 45px;
  background: #293848;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-icon.budget {
  background: #8B5CF6;
}

.report-icon.progress {
  background: #F59E0B;
}

.report-info {
  flex: 1;
}

.report-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.report-info p {
  color: #6B7280;
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
}

.report-badge {
  padding: 0.25rem 0.75rem;
  background: #DBEAFE;
  color: #1E40AF;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.report-metrics {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric .label {
  font-size: 0.75rem;
  color: #6B7280;
  font-weight: 600;
}

.metric .value {
  font-size: 1rem;
  color: #1F2937;
  font-weight: 700;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-export {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-view {
  background: #293848;
  color: white;
}

.btn-view:hover {
  background: #1E40AF;
}

.btn-export {
  background: white;
  color: #6B7280;
  border: 2px solid #E5E7EB;
}

.btn-export:hover {
  border-color: #293848;
  color: #293848;
}

.budget-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.budget-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 1.5rem;
}

.budget-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.budget-card {
  background: #F8FAFC;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.budget-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.budget-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #10B981;
}

.budget-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
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

.budget-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6B7280;
}

@media (max-width: 768px) {
  .reports-page {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
  }

  .btn-generate {
    width: 100%;
  }

  .reports-grid,
  .budget-cards {
    grid-template-columns: 1fr;
  }
}
</style>
