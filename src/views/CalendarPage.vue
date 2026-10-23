<template>
  <div class="calendar-page">
    <div class="page-header">
      <h1>Planning des Projets</h1>
      <div class="header-actions">
        <select v-model="selectedCompany" class="company-select" @change="loadProjects">
          <option value="">Toutes les entreprises</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
        <select v-model="selectedProject" class="project-select">
          <option value="">Tous les projets</option>
          <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
        <select v-model="viewPeriod" class="period-select">
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
        <button @click="previousPeriod" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span class="current-period">{{ currentPeriodLabel }}</span>
        <button @click="nextPeriod" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button @click="goToToday" class="btn-today">Aujourd'hui</button>
        <button @click="showCreateMilestone = true" class="btn-create">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle étape
        </button>
      </div>
    </div>

    <div class="calendar-container">
      <div class="calendar-main">
        <!-- Vue Semaine -->
        <div v-if="viewPeriod === 'week'" class="week-view">
          <div class="week-header">
            <div class="time-column-header"></div>
            <div v-for="day in weekDays" :key="day.date" class="day-header" :class="{ today: day.isToday }">
              <div class="day-name">{{ day.dayName }}</div>
              <div class="day-number">{{ day.dayNumber }}</div>
              <div class="day-date">{{ day.fullDate }}</div>
            </div>
          </div>
          <div class="week-body">
            <div class="time-column">
              <div v-for="hour in hours" :key="hour" class="hour-label">{{ formatHour(hour) }}</div>
            </div>
            <div v-for="day in weekDays" :key="day.date" class="day-column">
              <div
                v-for="hour in hours"
                :key="`${day.date}-${hour}`"
                class="hour-slot"
                @click="handleSlotClick(day.date, hour)"
              >
                <div
                  v-for="milestone in getMilestonesForSlot(day.date, hour)"
                  :key="milestone.id"
                  class="milestone-block"
                  :style="{
                    background: getProjectColor(milestone.projectId),
                    height: calculateMilestoneHeight(milestone)
                  }"
                  @click.stop="openMilestoneDetails(milestone)"
                >
                  <span class="milestone-title">{{ milestone.title }}</span>
                  <span class="milestone-project">{{ milestone.projectName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Mois -->
        <div v-if="viewPeriod === 'month'" class="month-view">
          <div class="month-header">
            <div v-for="day in dayNames" :key="day" class="day-name-header">{{ day }}</div>
          </div>
          <div class="month-grid">
            <div
              v-for="(day, index) in monthDays"
              :key="index"
              :class="['month-day', { 'other-month': day.otherMonth, today: day.isToday }]"
              @click="handleDayClick(day)"
            >
              <div class="day-number">{{ day.date }}</div>
              <div class="day-date">{{ day.fullDate }}</div>
              <div class="day-milestones">
                <div
                  v-for="milestone in day.milestones"
                  :key="milestone.id"
                  class="milestone-item"
                  :style="{ background: getProjectColor(milestone.projectId) }"
                  @click.stop="openMilestoneDetails(milestone)"
                >
                  <span class="milestone-title">{{ milestone.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Année -->
        <div v-if="viewPeriod === 'year'" class="year-view">
          <div class="year-grid">
            <div v-for="month in yearMonths" :key="month.index" class="year-month">
              <div class="month-title">{{ month.name }}</div>
              <div class="mini-calendar">
                <div class="mini-days">
                  <div v-for="d in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="d" class="mini-day-header">{{ d }}</div>
                </div>
                <div class="mini-grid">
                  <div
                    v-for="(day, idx) in month.days"
                    :key="idx"
                    :class="['mini-day', { 'has-milestone': day.hasMilestone, today: day.isToday }]"
                  >
                    {{ day.date }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Modal -->
      <div class="sidebar-modal" :class="{ open: selectedMilestone }">
        <div class="sidebar-header">
          <h3>Détails de l'étape</h3>
          <button @click="closeSidebar" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="selectedMilestone" class="sidebar-content">
          <div class="milestone-detail-section">
            <label>Projet</label>
            <div class="detail-value">
              <div class="project-dot" :style="{ background: getProjectColor(selectedMilestone.projectId) }"></div>
              <span>{{ selectedMilestone.projectName }}</span>
            </div>
          </div>

          <div class="milestone-detail-section">
            <label>Titre</label>
            <div class="detail-value">{{ selectedMilestone.title }}</div>
          </div>

          <div class="milestone-detail-section">
            <label>Description</label>
            <div class="detail-value">{{ selectedMilestone.description }}</div>
          </div>

          <div class="milestone-detail-row">
            <div class="milestone-detail-section">
              <label>Date début</label>
              <div class="detail-value">{{ formatFullDate(selectedMilestone.startDate) }}</div>
            </div>
            <div class="milestone-detail-section">
              <label>Date fin</label>
              <div class="detail-value">{{ formatFullDate(selectedMilestone.endDate) }}</div>
            </div>
          </div>

          <div class="milestone-detail-row">
            <div class="milestone-detail-section">
              <label>Durée</label>
              <div class="detail-value">{{ calculateDuration(selectedMilestone) }} jours</div>
            </div>
            <div class="milestone-detail-section">
              <label>Temps estimé</label>
              <div class="detail-value">{{ selectedMilestone.estimatedTime }}h</div>
            </div>
          </div>

          <div class="milestone-detail-section">
            <label>Statut</label>
            <div class="detail-value">
              <span class="status-badge" :class="selectedMilestone.status">
                {{ getStatusLabel(selectedMilestone.status) }}
              </span>
            </div>
          </div>

          <div class="milestone-detail-section">
            <label>Progression</label>
            <div class="progress-section">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: selectedMilestone.progress + '%' }"
                ></div>
              </div>
              <span class="progress-value">{{ selectedMilestone.progress }}%</span>
            </div>
          </div>

          <div class="milestone-detail-section">
            <label>Assigné à</label>
            <div class="assignees-list">
              <div v-for="assignee in selectedMilestone.assignees" :key="assignee.id" class="assignee-item">
                <div class="assignee-avatar">{{ assignee.name.charAt(0) }}</div>
                <span>{{ assignee.name }}</span>
              </div>
            </div>
          </div>

          <div class="sidebar-actions">
            <button @click="editMilestone" class="btn-action btn-edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modifier
            </button>
            <button @click="deleteMilestone" class="btn-action btn-delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Création Étape -->
    <div v-if="showCreateMilestone" class="modal-overlay" @click="showCreateMilestone = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Nouvelle étape de projet</h3>
          <button @click="showCreateMilestone = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Projet</label>
            <select v-model="milestoneForm.projectId">
              <option value="">Sélectionner un projet</option>
              <option v-for="project in allProjects" :key="project.id" :value="project.id">
                {{ project.name }} ({{ project.companyName }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Titre de l'étape</label>
            <input v-model="milestoneForm.title" type="text" placeholder="Ex: Développement frontend" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date début</label>
              <input v-model="milestoneForm.startDate" type="date" />
            </div>
            <div class="form-group">
              <label>Date fin</label>
              <input v-model="milestoneForm.endDate" type="date" />
            </div>
          </div>
          <div class="form-group">
            <label>Temps estimé (heures)</label>
            <input v-model="milestoneForm.estimatedTime" type="number" placeholder="40" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="milestoneForm.description" placeholder="Description de l'étape..." rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateMilestone = false" class="btn-cancel">Annuler</button>
          <button @click="createMilestone" class="btn-confirm">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const selectedCompany = ref('')
const selectedProject = ref('')
const viewPeriod = ref('month')
const selectedMilestone = ref(null)
const showCreateMilestone = ref(false)

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const companies = ref([
  { id: 1, name: 'TechCorp Solutions' },
  { id: 2, name: 'Marketing Pro' },
])

const allProjects = ref([
  {
    id: 1,
    name: 'Refonte E-commerce',
    color: '#10B981',
    companyId: 1,
    companyName: 'TechCorp Solutions',
  },
  {
    id: 2,
    name: 'Application Mobile',
    color: '#293848',
    companyId: 1,
    companyName: 'TechCorp Solutions',
  },
  {
    id: 3,
    name: 'Dashboard Analytics',
    color: '#8B5CF6',
    companyId: 1,
    companyName: 'TechCorp Solutions',
  },
  {
    id: 4,
    name: 'Campagne Social Media',
    color: '#F59E0B',
    companyId: 2,
    companyName: 'Marketing Pro',
  },
  {
    id: 5,
    name: 'SEO Audit',
    color: '#EF4444',
    companyId: 2,
    companyName: 'Marketing Pro',
  },
])

const milestones = ref([
  {
    id: 1,
    title: 'Analyse des besoins',
    projectId: 1,
    projectName: 'Refonte E-commerce',
    companyId: 1,
    startDate: new Date(Date.now() - 86400000 * 3),
    endDate: new Date(Date.now() - 86400000 * 1),
    estimatedTime: 40,
    status: 'completed',
    progress: 100,
    description: 'Analyse et documentation des besoins fonctionnels',
    assignees: [
      { id: 1, name: 'Marie Dupont' },
      { id: 2, name: 'Jean Martin' },
    ],
  },
  {
    id: 2,
    title: 'Design UI/UX',
    projectId: 1,
    projectName: 'Refonte E-commerce',
    companyId: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000 * 5),
    estimatedTime: 60,
    status: 'in_progress',
    progress: 45,
    description: 'Création des maquettes et prototypes',
    assignees: [
      { id: 3, name: 'Sophie Bernard' },
      { id: 4, name: 'Pierre Leroy' },
    ],
  },
  {
    id: 3,
    title: 'Développement Backend',
    projectId: 1,
    projectName: 'Refonte E-commerce',
    companyId: 1,
    startDate: new Date(Date.now() + 86400000 * 6),
    endDate: new Date(Date.now() + 86400000 * 20),
    estimatedTime: 80,
    status: 'pending',
    progress: 0,
    description: 'Développement de l\'API et de la base de données',
    assignees: [
      { id: 2, name: 'Jean Martin' },
      { id: 5, name: 'Claire Moreau' },
    ],
  },
  {
    id: 4,
    title: 'Architecture App',
    projectId: 2,
    projectName: 'Application Mobile',
    companyId: 1,
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 7),
    estimatedTime: 50,
    status: 'in_progress',
    progress: 30,
    description: 'Architecture technique de l\'application mobile',
    assignees: [
      { id: 2, name: 'Jean Martin' },
    ],
  },
  {
    id: 5,
    title: 'Développement iOS',
    projectId: 2,
    projectName: 'Application Mobile',
    companyId: 1,
    startDate: new Date(Date.now() + 86400000 * 10),
    endDate: new Date(Date.now() + 86400000 * 30),
    estimatedTime: 120,
    status: 'pending',
    progress: 0,
    description: 'Développement natif iOS',
    assignees: [
      { id: 2, name: 'Jean Martin' },
      { id: 5, name: 'Claire Moreau' },
    ],
  },
  {
    id: 6,
    title: 'Analyse SEO',
    projectId: 5,
    projectName: 'SEO Audit',
    companyId: 2,
    startDate: new Date(Date.now() - 86400000 * 5),
    endDate: new Date(Date.now() - 86400000 * 2),
    estimatedTime: 25,
    status: 'completed',
    progress: 100,
    description: 'Audit SEO technique et contenu',
    assignees: [
      { id: 6, name: 'Lucas Petit' },
    ],
  },
  {
    id: 7,
    title: 'Optimisation On-Page',
    projectId: 5,
    projectName: 'SEO Audit',
    companyId: 2,
    startDate: new Date(Date.now() + 86400000 * 1),
    endDate: new Date(Date.now() + 86400000 * 10),
    estimatedTime: 35,
    status: 'in_progress',
    progress: 20,
    description: 'Optimisation des pages et méta-données',
    assignees: [
      { id: 6, name: 'Lucas Petit' },
      { id: 4, name: 'Pierre Leroy' },
    ],
  },
])

const milestoneForm = ref({
  projectId: '',
  title: '',
  startDate: '',
  endDate: '',
  estimatedTime: 40,
  description: '',
})

const filteredProjects = computed(() => {
  if (!selectedCompany.value) return allProjects.value
  return allProjects.value.filter(p => p.companyId === parseInt(selectedCompany.value))
})

const currentPeriodLabel = computed(() => {
  if (viewPeriod.value === 'week') {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return `${formatFullDate(weekStart)} - ${formatFullDate(weekEnd)}`
  } else if (viewPeriod.value === 'month') {
    return currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  } else {
    return currentDate.value.getFullYear().toString()
  }
})

const weekDays = computed(() => {
  const weekStart = getWeekStart(currentDate.value)
  const days = []
  const dayNamesFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    days.push({
      date: formatFullDate(date),
      dayName: dayNames[i],
      dayNumber: date.getDate(),
      fullDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      isToday: isSameDay(date, new Date()),
    })
  }
  return days
})

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const totalDays = lastDay.getDate()

  const days = []

  // Jours du mois précédent
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: date.getDate(),
      otherMonth: true,
      isToday: isSameDay(date, new Date()),
      fullDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      milestones: getMilestonesForDate(date),
    })
  }

  // Jours du mois actuel
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
    days.push({
      date: i,
      otherMonth: false,
      isToday: isSameDay(date, new Date()),
      fullDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      milestones: getMilestonesForDate(date),
    })
  }

  // Jours du mois suivant
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: i,
      otherMonth: true,
      isToday: isSameDay(date, new Date()),
      fullDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      milestones: getMilestonesForDate(date),
    })
  }

  return days
})

const yearMonths = computed(() => {
  const year = currentDate.value.getFullYear()
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  return months.map((name, index) => {
    const firstDay = new Date(year, index, 1)
    const lastDay = new Date(year, index + 1, 0)
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const totalDays = lastDay.getDate()

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push({ date: '', isToday: false, hasMilestone: false })
    }
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, index, i)
      days.push({
        date: i,
        isToday: isSameDay(date, new Date()),
        hasMilestone: hasMilestoneInMonth(date),
      })
    }
    const remaining = 42 - days.length
    for (let i = 0; i < remaining; i++) {
      days.push({ date: '', isToday: false, hasMilestone: false })
    }

    return { index, name, days }
  })
})

const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const formatFullDate = (date) => {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const getMilestonesForSlot = (dateStr, hour) => {
  const date = new Date(dateStr)
  return milestones.value.filter(m => {
    const matchProject = !selectedProject.value || m.projectId === parseInt(selectedProject.value)
    const matchCompany = !selectedCompany.value || m.companyId === parseInt(selectedCompany.value)
    const isInRange = date >= m.startDate && date <= m.endDate
    return matchProject && matchCompany && isInRange
  })
}

const getMilestonesForDate = (date) => {
  return milestones.value.filter(m => {
    const matchProject = !selectedProject.value || m.projectId === parseInt(selectedProject.value)
    const matchCompany = !selectedCompany.value || m.companyId === parseInt(selectedCompany.value)
    const isInRange = date >= m.startDate && date <= m.endDate
    return matchProject && matchCompany && isInRange
  })
}

const hasMilestoneInMonth = (date) => {
  return milestones.value.some(m => {
    const matchProject = !selectedProject.value || m.projectId === parseInt(selectedProject.value)
    const matchCompany = !selectedCompany.value || m.companyId === parseInt(selectedCompany.value)
    const isInRange = date >= m.startDate && date <= m.endDate
    return matchProject && matchCompany && isInRange
  })
}

const getProjectColor = (projectId) => {
  const project = allProjects.value.find(p => p.id === projectId)
  return project?.color || '#6B7280'
}

const calculateMilestoneHeight = (milestone) => {
  const duration = Math.ceil((milestone.endDate - milestone.startDate) / (1000 * 60 * 60 * 24))
  return `${Math.max(duration * 60, 60)}px`
}

const calculateDuration = (milestone) => {
  return Math.ceil((milestone.endDate - milestone.startDate) / (1000 * 60 * 60 * 24))
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'Terminé',
    in_progress: 'En cours',
    pending: 'En attente',
  }
  return labels[status] || status
}

const previousPeriod = () => {
  if (viewPeriod.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() - 7 * 86400000)
  } else if (viewPeriod.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getFullYear() - 1, 0, 1)
  }
}

const nextPeriod = () => {
  if (viewPeriod.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() + 7 * 86400000)
  } else if (viewPeriod.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getFullYear() + 1, 0, 1)
  }
}

const goToToday = () => {
  currentDate.value = new Date()
}

const loadProjects = () => {
  selectedProject.value = ''
}

const handleSlotClick = (dateStr, hour) => {
  milestoneForm.value = {
    projectId: '',
    title: '',
    startDate: dateStr,
    endDate: dateStr,
    estimatedTime: 40,
    description: '',
  }
  showCreateMilestone.value = true
}

const handleDayClick = (day) => {
  if (!day.otherMonth) {
    const date = new Date(day.fullDate)
    milestoneForm.value = {
      projectId: '',
      title: '',
      startDate: formatFullDate(date),
      endDate: formatFullDate(date),
      estimatedTime: 40,
      description: '',
    }
    showCreateMilestone.value = true
  }
}

const openMilestoneDetails = (milestone) => {
  selectedMilestone.value = milestone
}

const closeSidebar = () => {
  selectedMilestone.value = null
}

const editMilestone = () => {
  console.log('Edit milestone:', selectedMilestone.value)
}

const deleteMilestone = () => {
  if (confirm('Voulez-vous vraiment supprimer cette étape ?')) {
    milestones.value = milestones.value.filter(m => m.id !== selectedMilestone.value.id)
    closeSidebar()
  }
}

const createMilestone = () => {
  if (milestoneForm.value.projectId && milestoneForm.value.title && milestoneForm.value.startDate) {
    const project = allProjects.value.find(p => p.id === parseInt(milestoneForm.value.projectId))
    milestones.value.push({
      id: Date.now(),
      ...milestoneForm.value,
      projectId: parseInt(milestoneForm.value.projectId),
      projectName: project?.name || 'Projet',
      companyId: project?.companyId || 1,
      startDate: new Date(milestoneForm.value.startDate),
      endDate: new Date(milestoneForm.value.endDate || milestoneForm.value.startDate),
      status: 'pending',
      progress: 0,
      assignees: [],
    })
    showCreateMilestone.value = false
  }
}
</script>

<style scoped>
.calendar-page {
  padding: 0;
  max-width: 1600px;
  margin: 0 auto;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1.5rem;
  gap: 1rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.company-select,
.project-select,
.period-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  min-width: 140px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.nav-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.current-period {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 200px;
  text-align: center;
}

.btn-today,
.btn-create {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-today {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-today:hover {
  background: #e5e7eb;
}

.btn-create {
  background: #293848;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-create:hover {
  background: #1f2937;
}

.calendar-container {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 0 1.5rem 1.5rem;
  overflow: hidden;
}

.calendar-main {
  flex: 1;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Vue Semaine */
.week-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.week-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.time-column-header {
  width: 60px;
  border-right: 1px solid #e5e7eb;
}

.day-header {
  flex: 1;
  padding: 0.75rem;
  text-align: center;
  border-right: 1px solid #e5e7eb;
}

.day-header.today {
  background: #eff6ff;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.day-number {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.125rem;
}

.day-date {
  font-size: 0.6875rem;
  color: #9CA3AF;
}

.week-body {
  flex: 1;
  display: flex;
  overflow-y: auto;
}

.time-column {
  width: 60px;
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
}

.hour-label {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6B7280;
  border-bottom: 1px solid #f3f4f6;
}

.day-column {
  flex: 1;
  border-right: 1px solid #f3f4f6;
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.25rem;
  cursor: pointer;
  position: relative;
}

.hour-slot:hover {
  background: #f9fafb;
}

.milestone-block {
  border-radius: 4px;
  padding: 0.375rem 0.5rem;
  cursor: pointer;
  transition: transform 0.15s ease;
  position: absolute;
  left: 0.25rem;
  right: 0.25rem;
  top: 0.25rem;
}

.milestone-block:hover {
  transform: scale(1.02);
}

.milestone-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.milestone-project {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Vue Mois */
.month-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.month-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0.75rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.day-name-header {
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6B7280;
}

.month-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  overflow-y: auto;
}

.month-day {
  border: 1px solid #f3f4f6;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;
  min-height: 80px;
}

.month-day:hover {
  background: #f9fafb;
}

.month-day.other-month {
  opacity: 0.5;
}

.month-day.today {
  background: #eff6ff;
  border-color: #3b82f6;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.6875rem;
  color: #9CA3AF;
  margin-bottom: 0.5rem;
}

.day-milestones {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.milestone-item {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vue Année */
.year-view {
  padding: 1.5rem;
  overflow-y: auto;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.year-month {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
}

.month-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 0.5rem;
  text-align: center;
}

.mini-calendar {
  border: 1px solid #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.mini-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9fafb;
}

.mini-day-header {
  font-size: 0.625rem;
  text-align: center;
  padding: 0.25rem;
  color: #6B7280;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.mini-day {
  font-size: 0.6875rem;
  text-align: center;
  padding: 0.25rem;
  color: #374151;
}

.mini-day.has-milestone {
  background: #dbeafe;
  font-weight: 600;
}

.mini-day.today {
  background: #3b82f6;
  color: white;
}

/* Sidebar Modal */
.sidebar-modal {
  width: 0;
  background: white;
  border-left: 1px solid #e5e7eb;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-modal.open {
  width: 380px;
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.sidebar-content {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
}

.milestone-detail-section {
  margin-bottom: 1.25rem;
}

.milestone-detail-section label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
}

.detail-value {
  font-size: 0.875rem;
  color: #1F2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.milestone-detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.in_progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10B981;
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1F2937;
}

.assignees-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assignee-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #293848;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-action {
  flex: 1;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.15s ease;
}

.btn-edit {
  background: white;
  color: #374151;
}

.btn-edit:hover {
  background: #f3f4f6;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 15 -3px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.modal-body {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 2px rgba(41, 56, 72, 0.05);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  padding: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
  padding: 0.625rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-cancel {
  background: white;
  color: #6B7280;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-confirm {
  background: #293848;
  color: white;
  border-color: #293848;
}

.btn-confirm:hover {
  background: #1f2937;
  border-color: #1f2937;
}

@media (max-width: 1024px) {
  .calendar-container {
    flex-direction: column;
  }

  .sidebar-modal.open {
    width: 100%;
    height: 400px;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }

  .year-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
