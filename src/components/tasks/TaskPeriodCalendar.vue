<template>
  <div class="period-calendar">
    <div class="calendar-header">
      <div class="header-left">
        <h2>Calendrier des tâches</h2>
        <div class="period-selector">
          <button 
            v-for="period in periods" 
            :key="period.id"
            @click="selectedPeriod = period.id"
            :class="['period-btn', { active: selectedPeriod === period.id }]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      <div class="header-right">
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
      </div>
    </div>

    <div class="calendar-grid">
      <div class="time-header">
        <div class="time-labels">
          <div v-for="timeSlot in timeSlots" :key="timeSlot" class="time-label">
            {{ timeSlot }}
          </div>
        </div>
      </div>
      
      <div class="days-container">
        <div v-for="day in days" :key="day.date" class="day-column">
          <div class="day-header">
            <span class="day-name">{{ day.name }}</span>
            <span class="day-date">{{ day.date }}</span>
          </div>
          <div class="day-tasks">
            <div 
              v-for="task in getTasksForDay(day.date)" 
              :key="task.id"
              class="task-block"
              :style="{ 
                backgroundColor: task.color,
                height: calculateTaskHeight(task.duration)
              }"
              @click="openTask(task)"
            >
              <div class="task-time">{{ task.startTime }}</div>
              <div class="task-title">{{ task.title }}</div>
              <div class="task-assignee">{{ task.assignee }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Légende des périodes -->
    <div class="period-legend">
      <h3>Périodes actuelles</h3>
      <div class="legend-items">
        <div v-for="period in currentPeriods" :key="period.id" class="legend-item">
          <div class="legend-color" :style="{ backgroundColor: period.color }"></div>
          <div class="legend-info">
            <span class="legend-name">{{ period.name }}</span>
            <span class="legend-dates">{{ period.startDate }} - {{ period.endDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedPeriod = ref('month')
const currentDate = ref(new Date())

const periods = [
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'year', label: 'Année' },
]

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']

const days = ref([
  { name: 'Lun', date: '15 Jan' },
  { name: 'Mar', date: '16 Jan' },
  { name: 'Mer', date: '17 Jan' },
  { name: 'Jeu', date: '18 Jan' },
  { name: 'Ven', date: '19 Jan' },
  { name: 'Sam', date: '20 Jan' },
  { name: 'Dim', date: '21 Jan' },
])

const tasks = ref([
  {
    id: 1,
    title: 'Réunion équipe',
    date: '15 Jan',
    startTime: '09:00',
    duration: 2,
    assignee: 'Marie',
    color: '#1F2937',
  },
  {
    id: 2,
    title: 'Review design',
    date: '15 Jan',
    startTime: '14:00',
    duration: 3,
    assignee: 'Jean',
    color: '#374151',
  },
  {
    id: 3,
    title: 'Développement API',
    date: '16 Jan',
    startTime: '09:00',
    duration: 4,
    assignee: 'Pierre',
    color: '#4B5563',
  },
  {
    id: 4,
    title: 'Tests intégration',
    date: '17 Jan',
    startTime: '10:00',
    duration: 3,
    assignee: 'Sophie',
    color: '#6B7280',
  },
  {
    id: 5,
    title: 'Déploiement',
    date: '18 Jan',
    startTime: '14:00',
    duration: 2,
    assignee: 'Claire',
    color: '#9CA3AF',
  },
  {
    id: 6,
    title: 'Documentation',
    date: '19 Jan',
    startTime: '09:00',
    duration: 3,
    assignee: 'Lucas',
    color: '#D1D5DB',
  },
])

const currentPeriods = ref([
  {
    id: 1,
    name: 'Phase 1 - Conception',
    startDate: '15 Jan',
    endDate: '31 Jan',
    color: '#1F2937',
  },
  {
    id: 2,
    name: 'Phase 2 - Développement',
    startDate: '01 Fév',
    endDate: '28 Fév',
    color: '#374151',
  },
  {
    id: 3,
    name: 'Phase 3 - Tests',
    startDate: '01 Mar',
    endDate: '31 Mar',
    color: '#4B5563',
  },
])

const currentPeriodLabel = computed(() => {
  const month = currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return month.charAt(0).toUpperCase() + month.slice(1)
})

const getTasksForDay = (date) => {
  return tasks.value.filter(task => task.date === date)
}

const calculateTaskHeight = (duration) => {
  return `${duration * 60}px`
}

const previousPeriod = () => {
  if (selectedPeriod.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  }
}

const nextPeriod = () => {
  if (selectedPeriod.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  }
}

const openTask = (task) => {
  console.log('Open task:', task)
}
</script>

<style scoped>
.period-calendar {
  padding: 0;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 1rem 0;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  border-color: #1F2937;
  color: #1F2937;
}

.period-btn.active {
  background: #1F2937;
  border-color: #1F2937;
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #E5E7EB;
  background: white;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: #1F2937;
  color: #1F2937;
}

.current-period {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  min-width: 150px;
  text-align: center;
}

.calendar-grid {
  display: flex;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.time-header {
  width: 60px;
  border-right: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.time-labels {
  display: flex;
  flex-direction: column;
}

.time-label {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.days-container {
  flex: 1;
  display: flex;
  overflow-x: auto;
}

.day-column {
  flex: 1;
  min-width: 180px;
  border-right: 1px solid #E5E7EB;
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.day-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1F2937;
}

.day-date {
  font-size: 0.75rem;
  color: #6B7280;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 480px;
}

.task-block {
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.task-block:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.task-time {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.task-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.task-assignee {
  font-size: 0.75rem;
  opacity: 0.9;
}

.period-legend {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
}

.period-legend h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 1rem 0;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.legend-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2937;
}

.legend-dates {
  font-size: 0.75rem;
  color: #6B7280;
}

@media (max-width: 768px) {
  .period-calendar {
    padding: 1rem;
  }

  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .calendar-grid {
    overflow-x: auto;
  }

  .day-column {
    min-width: 150px;
  }
}
</style>
