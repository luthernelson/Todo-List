<template>
  <div class="planning-calendar">
    <div class="calendar-header">
      <h2>Calendrier de planification</h2>
      <div class="header-actions">
        <button @click="goToPrevious" class="btn-nav">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="current-period">{{ currentPeriodLabel }}</span>
        <button @click="goToNext" class="btn-nav">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Phase Timeline -->
    <div class="phase-timeline">
      <h3>Chronologie des phases</h3>
      <div class="timeline-container">
        <div
          v-for="(phase, index) in phases"
          :key="phase.id"
          class="timeline-phase"
          :style="{ backgroundColor: phase.color }"
        >
          <div class="phase-label">{{ phase.name }}</div>
          <div class="phase-duration">{{ getPhaseDuration(phase) }}</div>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <div class="calendar-days">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day"
          :class="{
            'other-month': day.isOtherMonth,
            'today': day.isToday,
            'has-tasks': day.tasks.length > 0
          }"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.dayNumber }}</span>

          <!-- Tasks indicators -->
          <div v-if="day.tasks.length > 0" class="day-tasks">
            <div
              v-for="task in day.tasks.slice(0, 3)"
              :key="task.id"
              class="task-indicator"
              :style="{ backgroundColor: getTaskColor(task) }"
              :title="task.title"
            ></div>
            <span v-if="day.tasks.length > 3" class="more-tasks">+{{ day.tasks.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Day Details -->
    <div v-if="selectedDay" class="day-details">
      <h3>{{ selectedDayLabel }}</h3>

      <div v-if="selectedDayTasks.length === 0" class="no-tasks">
        <p>Aucune tâche prévue pour cette date</p>
        <button class="btn-add-task" @click="addTaskForDay">
          <i class="fa-solid fa-plus"></i>
          Ajouter une tâche
        </button>
      </div>

      <div v-else class="day-tasks-list">
        <div v-for="task in selectedDayTasks" :key="task.id" class="day-task-item">
          <div class="task-color" :style="{ backgroundColor: getTaskColor(task) }"></div>
          <div class="task-info">
            <h4>{{ task.title }}</h4>
            <div class="task-meta">
              <span class="duration">{{ task.timeTracking?.estimatedHours || 0 }}h estimées</span>
              <span class="phase">{{ getPhaseName(task.phaseId) }}</span>
            </div>
          </div>
          <div class="task-actions">
            <button @click="editTask(task)" class="btn-edit">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Planning Summary -->
    <div class="planning-summary">
      <h3>Résumé de la planification</h3>
      <div class="summary-grid">
        <div class="summary-card">
          <span class="label">Durée totale estimée</span>
          <span class="value">{{ totalEstimatedHours }}h</span>
        </div>
        <div class="summary-card">
          <span class="label">Tâches planifiées</span>
          <span class="value">{{ totalPlannedTasks }}</span>
        </div>
        <div class="summary-card">
          <span class="label">Date de début</span>
          <span class="value">{{ formatDate(planning.startDate) }}</span>
        </div>
        <div class="summary-card">
          <span class="label">Date de fin</span>
          <span class="value">{{ formatDate(planning.endDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'addTask', 'editTask'])

const currentDate = ref(new Date())
const selectedDay = ref(null)

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const phases = computed(() => {
  return props.project?.phases || []
})

const planning = computed(() => {
  return props.project?.planning || {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalEstimatedHours: 0,
  }
})

const currentPeriodLabel = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDayOfWeek = (firstDay.getDay() + 6) % 7 // Monday = 0
  const totalDays = lastDay.getDate()

  const days = []

  // Days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      isOtherMonth: true,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
    days.push({
      date: date.toISOString(),
      dayNumber: i,
      isOtherMonth: false,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  // Days from next month
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: date.toISOString(),
      dayNumber: i,
      isOtherMonth: true,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  return days
})

const selectedDayTasks = computed(() => {
  if (!selectedDay.value) return []
  return getTasksForDate(new Date(selectedDay.value.date))
})

const totalEstimatedHours = computed(() => {
  return (props.project?.tasks || []).reduce((sum, task) => {
    return sum + (task.timeTracking?.estimatedHours || 0)
  }, 0)
})

const totalPlannedTasks = computed(() => {
  return (props.project?.tasks || []).filter(task => task.dueDate).length
})

const selectedDayLabel = computed(() => {
  if (!selectedDay.value) return ''
  const date = new Date(selectedDay.value.date)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

const getTasksForDate = (date) => {
  const tasks = props.project?.tasks || []
  return tasks.filter(task => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    return isSameDay(taskDate, date)
  })
}

const getTaskColor = (task) => {
  const phase = phases.value.find(p => p.id === task.phaseId)
  return phase?.color || '#293848'
}

const getPhaseName = (phaseId) => {
  const phase = phases.value.find(p => p.id === phaseId)
  return phase?.name || 'Non assigné'
}

const getPhaseDuration = (phase) => {
  const tasks = (props.project?.tasks || []).filter(t => t.phaseId === phase.id)
  const totalHours = tasks.reduce((sum, task) => sum + (task.timeTracking?.estimatedHours || 0), 0)
  return totalHours > 0 ? `${totalHours}h` : '-'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const goToPrevious = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const goToNext = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDay = (day) => {
  selectedDay.value = day
}

const addTaskForDay = () => {
  emit('addTask', {
    dueDate: selectedDay.value.date
  })
}

const editTask = (task) => {
  emit('editTask', task)
}

onMounted(() => {
  // Select today by default
  const today = calendarDays.value.find(day => day.isToday)
  if (today) {
    selectedDay.value = today
  }
})
</script>

<style scoped>
.planning-calendar {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-nav {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-nav:hover {
  background: #f3f4f6;
  color: #293848;
}

.current-period {
  font-weight: 600;
  color: #1f2937;
  min-width: 150px;
  text-align: center;
}

/* Phase Timeline */
.phase-timeline {
  margin-bottom: 2rem;
}

.phase-timeline h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.timeline-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.timeline-phase {
  flex: 1;
  min-width: 120px;
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.phase-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.phase-duration {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Calendar Grid */
.calendar-grid {
  margin-bottom: 2rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.5rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.calendar-day:hover {
  border-color: #293848;
  background: #f9fafb;
}

.calendar-day.other-month {
  background: #f9fafb;
  color: #d1d5db;
}

.calendar-day.today {
  border-color: #293848;
  background: #eff6ff;
}

.calendar-day.has-tasks {
  background: #f0fdf4;
}

.day-number {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.task-indicator {
  height: 4px;
  border-radius: 2px;
  background: #293848;
}

.more-tasks {
  font-size: 0.625rem;
  color: #6b7280;
  font-weight: 600;
}

/* Day Details */
.day-details {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.day-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.no-tasks {
  text-align: center;
  padding: 2rem;
}

.no-tasks p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.btn-add-task {
  padding: 0.75rem 1.5rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-add-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.day-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.task-color {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.task-info {
  flex: 1;
}

.task-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-edit:hover {
  background: #f3f4f6;
  color: #293848;
}

/* Planning Summary */
.planning-summary h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-card .label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.summary-card .value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}
</style>
