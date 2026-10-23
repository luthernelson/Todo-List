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
          <option value="summary">Résumé général</option>
          <option value="tasks">Rapport de tâches</option>
          <option value="productivity">Productivité</option>
          <option value="team">Performance équipe</option>
          <option value="budget">Budget</option>
          <option value="timeline">Timeline</option>
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
          <h3>{{ totalBudget.toLocaleString() }}€</h3>
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

      <div v-if="isLoading" class="reports-grid">
        <CardSkeleton v-for="i in 6" :key="i" />
      </div>

      <div v-else class="reports-grid">
        <div v-for="report in reports" :key="report.id" class="report-card">
          <div class="report-header">
            <div class="report-icon" :class="report.type">
              <svg v-if="report.type === 'summary'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <svg v-if="report.type === 'tasks'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <svg v-if="report.type === 'productivity'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <svg v-if="report.type === 'team'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <svg v-if="report.type === 'budget'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <svg v-if="report.type === 'timeline'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="report-info">
              <h4>{{ report.title }}</h4>
              <p>{{ formatDate(report.generatedAt) }}</p>
              <span class="report-badge">{{ getReportTypeLabel(report.type) }}</span>
            </div>
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
            <span class="budget-amount">{{ project.budget.totalBudget.toLocaleString() }}€</span>
          </div>
          <div v-if="project.startDate && project.endDate" class="budget-period">
            <span>{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</span>
          </div>
          <div v-if="project.budget" class="budget-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: calculateBudgetProgress(project.budget) + '%' }"
                :class="{ 'warning': calculateBudgetProgress(project.budget) > 80, 'danger': calculateBudgetProgress(project.budget) > 95 }"
              ></div>
            </div>
            <div class="budget-details">
              <span>{{ $t('reports.spent') }}: {{ project.budget.spent.toLocaleString() }}€</span>
              <span>{{ $t('reports.remaining') }}: {{ project.budget.remaining.toLocaleString() }}€</span>
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
import CardSkeleton from '@/components/ui/CardSkeleton.vue'

const { t } = useI18n()
const projectStore = useProjectStore()
const isLoading = ref(true)

const selectedProject = ref('all')
const selectedPeriod = ref('month')
const selectedReportType = ref('all')

const projects = ref([
  {
    id: 1,
    name: 'Refonte E-commerce',
    budget: { totalBudget: 25000, spent: 18200, remaining: 6800 },
    startDate: '2024-01-01',
    endDate: '2024-06-30',
  },
  {
    id: 2,
    name: 'Application Mobile',
    budget: { totalBudget: 35000, spent: 28500, remaining: 6500 },
    startDate: '2024-02-01',
    endDate: '2024-08-31',
  },
  {
    id: 3,
    name: 'Dashboard Analytics',
    budget: { totalBudget: 15000, spent: 8900, remaining: 6100 },
    startDate: '2024-03-01',
    endDate: '2024-05-31',
  },
  {
    id: 4,
    name: 'Campagne Social Media',
    budget: { totalBudget: 8000, spent: 7200, remaining: 800 },
    startDate: '2024-01-15',
    endDate: '2024-04-15',
  },
  {
    id: 5,
    name: 'SEO Audit',
    budget: { totalBudget: 5000, spent: 2100, remaining: 2900 },
    startDate: '2024-02-15',
    endDate: '2024-03-31',
  },
])

const reports = ref([
  {
    id: 1,
    title: 'Résumé mensuel - Janvier 2024',
    type: 'summary',
    generatedAt: new Date().toISOString(),
    metrics: { totalTasks: 145, completedTasks: 98, totalHours: 520 },
  },
  {
    id: 2,
    title: 'Rapport de tâches - Refonte E-commerce',
    type: 'tasks',
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    metrics: { totalTasks: 58, completedTasks: 42, totalHours: 215 },
  },
  {
    id: 3,
    title: 'Productivité - Q1 2024',
    type: 'productivity',
    generatedAt: new Date(Date.now() - 172800000).toISOString(),
    metrics: { totalTasks: 320, completedTasks: 245, totalHours: 1280 },
  },
  {
    id: 4,
    title: 'Performance équipe - TechCorp Solutions',
    type: 'team',
    generatedAt: new Date(Date.now() - 259200000).toISOString(),
    metrics: { totalTasks: 185, completedTasks: 142, totalHours: 780 },
  },
  {
    id: 5,
    title: 'Budget - Application Mobile',
    type: 'budget',
    generatedAt: new Date(Date.now() - 345600000).toISOString(),
    metrics: { totalTasks: 95, completedTasks: 78, totalHours: 410 },
  },
  {
    id: 6,
    title: 'Timeline - Dashboard Analytics',
    type: 'timeline',
    generatedAt: new Date(Date.now() - 432000000).toISOString(),
    metrics: { totalTasks: 67, completedTasks: 55, totalHours: 285 },
  },
  {
    id: 7,
    title: 'Résumé mensuel - Décembre 2023',
    type: 'summary',
    generatedAt: new Date(Date.now() - 2592000000).toISOString(),
    metrics: { totalTasks: 132, completedTasks: 115, totalHours: 580 },
  },
  {
    id: 8,
    title: 'Rapport de tâches - Campagne Social Media',
    type: 'tasks',
    generatedAt: new Date(Date.now() - 518400000).toISOString(),
    metrics: { totalTasks: 38, completedTasks: 32, totalHours: 145 },
  },
])

const totalProjects = computed(() => projects.value.length)
const completedTasks = computed(() => reports.value.reduce((sum, r) => sum + r.metrics.completedTasks, 0))
const totalHours = computed(() => reports.value.reduce((sum, r) => sum + r.metrics.totalHours, 0))
const totalBudget = computed(() => projects.value.reduce((sum, p) => sum + (p.budget?.totalBudget || 0), 0))

const projectsWithBudget = computed(() => projects.value.filter(p => p.budget && p.budget.totalBudget > 0))

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getReportTypeLabel = (type) => {
  const labels = {
    summary: 'Résumé',
    tasks: 'Tâches',
    productivity: 'Productivité',
    team: 'Équipe',
    budget: 'Budget',
    timeline: 'Timeline',
  }
  return labels[type] || type
}

const calculateBudgetProgress = (budget) => {
  if (!budget || budget.totalBudget === 0) return 0
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
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<style scoped>
.reports-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.reports-header {
  margin-bottom: 1.5rem;
}

.reports-header h1 {
  font-size: 1.75rem;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6B7280;
  font-size: 0.9rem;
}

.filters-section {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: white;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.8125rem;
}

.filter-select {
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #374151;
}

.btn-generate {
  padding: 0.625rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  height: fit-content;
  align-self: flex-end;
  font-size: 0.875rem;
}

.btn-generate:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.stat-info p {
  color: #6B7280;
  font-size: 0.8125rem;
  margin: 0.25rem 0 0 0;
}

.reports-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.btn-create {
  padding: 0.625rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-create:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.report-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.25rem;
  transition: all 0.15s ease;
}

.report-card:hover {
  border-color: #d1d5db;
  background: #f3f4f6;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.report-icon {
  width: 36px;
  height: 36px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-icon.summary {
  background: #dbeafe;
  color: #1e40af;
}

.report-icon.tasks {
  background: #d1fae5;
  color: #065f46;
}

.report-icon.productivity {
  background: #fef3c7;
  color: #92400e;
}

.report-icon.team {
  background: #e0e7ff;
  color: #3730a3;
}

.report-icon.budget {
  background: #fce7f3;
  color: #9d174d;
}

.report-icon.timeline {
  background: #cffafe;
  color: #155e75;
}

.report-info {
  flex: 1;
}

.report-info h4 {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.report-info p {
  color: #6B7280;
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
}

.report-badge {
  padding: 0.25rem 0.625rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
}

.report-metrics {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric .label {
  font-size: 0.6875rem;
  color: #6B7280;
  font-weight: 500;
}

.metric .value {
  font-size: 0.875rem;
  color: #1F2937;
  font-weight: 600;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-export {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: white;
}

.btn-view {
  background: #374151;
  color: white;
  border-color: #374151;
}

.btn-view:hover {
  background: #1f2937;
  border-color: #1f2937;
}

.btn-export:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.budget-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
}

.budget-section h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 1.25rem;
}

.budget-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.budget-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.25rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
}

.budget-header h3 {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.budget-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: #059669;
}

.budget-period {
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.875rem;
}

.budget-progress {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #374151;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: #d97706;
}

.progress-fill.danger {
  background: #dc2626;
}

.budget-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
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
