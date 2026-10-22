<template>
  <div class="enhanced-reports">
    <div class="reports-header">
      <div>
        <h1>Rapports</h1>
        <p>Analyses et statistiques de vos projets</p>
      </div>
      <button @click="showCreateModal = true" class="btn-create">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouveau rapport
      </button>
    </div>

    <!-- Types de rapports -->
    <div class="report-types">
      <div 
        v-for="type in reportTypes" 
        :key="type.id"
        @click="selectedType = type.id"
        :class="['type-card', { active: selectedType === type.id }]"
      >
        <div class="type-icon" :style="{ color: type.color }">
          <component :is="type.icon" />
        </div>
        <h3>{{ type.name }}</h3>
        <p>{{ type.description }}</p>
        <span class="type-count">{{ type.count }} rapports</span>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>Projet</label>
        <select v-model="selectedProject">
          <option value="all">Tous les projets</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>Période</label>
        <select v-model="selectedPeriod">
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
          <option value="custom">Personnalisé</option>
        </select>
      </div>
      <button @click="generateReport" class="btn-generate">
        Générer
      </button>
    </div>

    <!-- Rapports filtrés -->
    <div class="reports-list">
      <div 
        v-for="report in filteredReports" 
        :key="report.id"
        class="report-card"
      >
        <div class="report-header">
          <div class="report-icon" :style="{ backgroundColor: report.color }">
            <component :is="getReportIcon(report.type)" />
          </div>
          <div class="report-info">
            <h4>{{ report.title }}</h4>
            <p>{{ report.projectName }}</p>
            <span class="report-date">{{ formatDate(report.generatedAt) }}</span>
          </div>
          <span class="report-type-badge">{{ getReportTypeLabel(report.type) }}</span>
        </div>

        <div class="report-metrics">
          <div class="metric">
            <span class="metric-label">Tâches</span>
            <span class="metric-value">{{ report.metrics.totalTasks }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Terminées</span>
            <span class="metric-value">{{ report.metrics.completedTasks }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Progression</span>
            <span class="metric-value">{{ report.metrics.progress }}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Heures</span>
            <span class="metric-value">{{ report.metrics.totalHours }}h</span>
          </div>
        </div>

        <div class="report-footer">
          <button @click="viewReport(report)" class="btn-view">
            Voir le détail
          </button>
          <button @click="exportReport(report)" class="btn-export">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Créer un rapport</h3>
          <button @click="showCreateModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Type de rapport</label>
            <select v-model="newReport.type">
              <option value="progression">Progression du projet</option>
              <option value="budget">Budget et dépenses</option>
              <option value="performance">Performance équipe</option>
              <option value="timeline">Timeline et jalons</option>
              <option value="risks">Analyse des risques</option>
              <option value="summary">Résumé global</option>
            </select>
          </div>
          <div class="form-group">
            <label>Projet</label>
            <select v-model="newReport.projectId">
              <option value="">Sélectionner un projet</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Période</label>
            <select v-model="newReport.period">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn-cancel">Annuler</button>
          <button @click="createReport" class="btn-confirm">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const showCreateModal = ref(false)
const selectedType = ref('all')
const selectedProject = ref('all')
const selectedPeriod = ref('month')

const newReport = ref({
  type: 'progression',
  projectId: '',
  period: 'month',
})

const projects = ref([
  { id: 1, name: 'Projet Alpha' },
  { id: 2, name: 'Projet Beta' },
  { id: 3, name: 'Projet Gamma' },
])

const reportTypes = [
  {
    id: 'progression',
    name: 'Progression',
    description: 'Avancement et complétion des tâches',
    color: '#1F2937',
    count: 12,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('line', { x1: 18, y1: 20, x2: 18, y2: 10 }),
      h('line', { x1: 12, y1: 20, x2: 12, y2: 4 }),
      h('line', { x1: 6, y1: 20, x2: 6, y2: 14 }),
    ]),
  },
  {
    id: 'budget',
    name: 'Budget',
    description: 'Suivi des dépenses et budget',
    color: '#374151',
    count: 8,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('line', { x1: 12, y1: 1, x2: 12, y2: 23 }),
      h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
    ]),
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Productivité et KPIs équipe',
    color: '#4B5563',
    count: 15,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: 9, cy: 7, r: 4 }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ]),
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Planning et jalons',
    color: '#6B7280',
    count: 6,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
      h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
      h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
      h('line', { x1: 3, y1: 10, x2: 21, y2: 10 }),
    ]),
  },
  {
    id: 'risks',
    name: 'Risques',
    description: 'Analyse et mitigation',
    color: '#9CA3AF',
    count: 4,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
      h('line', { x1: 12, y1: 9, x2: 12, y2: 13 }),
      h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
    ]),
  },
  {
    id: 'summary',
    name: 'Résumé',
    description: 'Vue d\'ensemble globale',
    color: '#D1D5DB',
    count: 3,
    icon: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: 16, y1: 13, x2: 8, y2: 13 }),
      h('line', { x1: 16, y1: 17, x2: 8, y2: 17 }),
      h('polyline', { points: '10 9 9 9 8 9' }),
    ]),
  },
]

const reports = ref([
  {
    id: 1,
    title: 'Progression - Janvier',
    type: 'progression',
    projectName: 'Projet Alpha',
    generatedAt: '2024-01-31T10:00:00',
    color: '#1F2937',
    metrics: { totalTasks: 45, completedTasks: 32, progress: 71, totalHours: 156 },
  },
  {
    id: 2,
    title: 'Budget - Q1 2024',
    type: 'budget',
    projectName: 'Projet Beta',
    generatedAt: '2024-01-30T14:30:00',
    color: '#374151',
    metrics: { totalTasks: 30, completedTasks: 25, progress: 83, totalHours: 210 },
  },
  {
    id: 3,
    title: 'Performance équipe',
    type: 'performance',
    projectName: 'Projet Alpha',
    generatedAt: '2024-01-29T09:15:00',
    color: '#4B5563',
    metrics: { totalTasks: 50, completedTasks: 38, progress: 76, totalHours: 180 },
  },
  {
    id: 4,
    title: 'Timeline - Phase 1',
    type: 'timeline',
    projectName: 'Projet Gamma',
    generatedAt: '2024-01-28T16:45:00',
    color: '#6B7280',
    metrics: { totalTasks: 20, completedTasks: 15, progress: 75, totalHours: 95 },
  },
  {
    id: 5,
    title: 'Analyse des risques',
    type: 'risks',
    projectName: 'Projet Beta',
    generatedAt: '2024-01-27T11:20:00',
    color: '#9CA3AF',
    metrics: { totalTasks: 15, completedTasks: 12, progress: 80, totalHours: 72 },
  },
])

const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const typeMatch = selectedType.value === 'all' || report.type === selectedType.value
    const projectMatch = selectedProject.value === 'all' || report.projectId === selectedProject.value
    return typeMatch && projectMatch
  })
})

const getReportIcon = (type) => {
  const typeInfo = reportTypes.find(t => t.id === type)
  return typeInfo ? typeInfo.icon : () => null
}

const getReportTypeLabel = (type) => {
  const typeInfo = reportTypes.find(t => t.id === type)
  return typeInfo ? typeInfo.name : type
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const generateReport = () => {
  console.log('Generate report with filters')
}

const createReport = () => {
  console.log('Create report:', newReport.value)
  showCreateModal.value = false
}

const viewReport = (report) => {
  console.log('View report:', report)
}

const exportReport = (report) => {
  console.log('Export report:', report)
}
</script>

<style scoped>
.enhanced-reports {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reports-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.reports-header p {
  color: #6B7280;
  margin: 0;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #374151;
}

.report-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.type-card:hover {
  border-color: #1F2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.type-card.active {
  border-color: #1F2937;
  background: #F9FAFB;
}

.type-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0.75rem;
}

.type-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.type-card p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.type-count {
  font-size: 0.75rem;
  color: #9CA3AF;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-group select {
  padding: 0.625rem;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
}

.btn-generate {
  padding: 0.625rem 1.25rem;
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  height: fit-content;
  align-self: flex-end;
}

.btn-generate:hover {
  background: #374151;
}

.reports-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.report-card:hover {
  border-color: #1F2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.report-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.report-icon {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.report-info {
  flex: 1;
}

.report-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.report-info p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.25rem 0;
}

.report-date {
  font-size: 0.75rem;
  color: #9CA3AF;
}

.report-type-badge {
  padding: 0.25rem 0.75rem;
  background: #F3F4F6;
  color: #6B7280;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.report-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 6px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #6B7280;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
}

.report-footer {
  display: flex;
  gap: 0.75rem;
}

.btn-view,
.btn-export {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-view {
  background: #1F2937;
  color: white;
}

.btn-view:hover {
  background: #374151;
}

.btn-export {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.btn-export:hover {
  border-color: #1F2937;
  color: #1F2937;
}

/* Modal */
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #1F2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.btn-cancel:hover {
  background: #F3F4F6;
}

.btn-confirm {
  background: #1F2937;
  color: white;
}

.btn-confirm:hover {
  background: #374151;
}

@media (max-width: 768px) {
  .enhanced-reports {
    padding: 1rem;
  }

  .reports-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .report-types {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-bar {
    flex-direction: column;
  }

  .btn-generate {
    width: 100%;
  }

  .reports-list {
    grid-template-columns: 1fr;
  }

  .report-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
