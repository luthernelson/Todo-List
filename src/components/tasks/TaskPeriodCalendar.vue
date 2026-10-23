<template>
  <div class="task-period-calendar">
    <div class="calendar-header">
      <div class="period-selector">
        <select v-model="selectedPeriod" class="period-select">
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
        <button @click="previousPeriod" class="nav-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span class="period-label">{{ periodLabel }}</span>
        <button @click="nextPeriod" class="nav-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="calendar-grid">
      <div class="calendar-header-row">
        <div class="day-name">Lun</div>
        <div class="day-name">Mar</div>
        <div class="day-name">Mer</div>
        <div class="day-name">Jeu</div>
        <div class="day-name">Ven</div>
        <div class="day-name">Sam</div>
        <div class="day-name">Dim</div>
      </div>

      <div class="calendar-days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="['calendar-day', { 'other-month': day.otherMonth, today: day.isToday }]"
        >
          <div class="day-number">{{ day.date }}</div>
          <div class="day-tasks">
            <div
              v-for="task in day.tasks.slice(0, 3)"
              :key="task.id"
              class="task-item"
              :title="task.title"
              @click="editTask(task)"
            >
              <span class="task-title">{{ task.title }}</span>
            </div>
            <div v-if="day.tasks.length > 3" class="more-tasks">
              +{{ day.tasks.length - 3 }} de plus
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

const selectedPeriod = ref('month')
const currentDate = ref(new Date())

const tasks = computed(() => projectStore.activeProjectTasks)

const periodLabel = computed(() => {
  const date = currentDate.value
  const options = { month: 'long', year: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
})

const calendarDays = computed(() => {
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
      tasks: getTasksForDate(date),
    })
  }

  // Jours du mois actuel
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
    days.push({
      date: i,
      otherMonth: false,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date),
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
      tasks: getTasksForDate(date),
    })
  }

  return days
})

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

const getTasksForDate = (date) => {
  return tasks.value.filter((task) => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    return isSameDay(taskDate, date)
  })
}

const previousPeriod = () => {
  if (selectedPeriod.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else if (selectedPeriod.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (selectedPeriod.value === 'quarter') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 3, 1)
  } else if (selectedPeriod.value === 'year') {
    currentDate.value = new Date(currentDate.value.getFullYear() - 1, 0, 1)
  }
}

const nextPeriod = () => {
  if (selectedPeriod.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else if (selectedPeriod.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000)
  } else if (selectedPeriod.value === 'quarter') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 3, 1)
  } else if (selectedPeriod.value === 'year') {
    currentDate.value = new Date(currentDate.value.getFullYear() + 1, 0, 1)
  }
}

const editTask = (task) => {
  console.log('Edit task:', task)
}
</script>

<style scoped>
.task-period-calendar {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}

.calendar-header {
  margin-bottom: 1.25rem;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.period-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  color: #374151;
}

.period-select:focus {
  outline: none;
  border-color: #374151;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.period-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1f2937;
  min-width: 150px;
  text-align: center;
}

.calendar-grid {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.calendar-header-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.day-name {
  padding: 0.75rem;
  text-align: center;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 100px;
  padding: 0.5rem;
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s ease;
}

.calendar-day:hover {
  background: #f9fafb;
}

.calendar-day.other-month {
  background: #fafafa;
  opacity: 0.5;
}

.calendar-day.today {
  background: #f0f9ff;
}

.day-number {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.calendar-day.today .day-number {
  color: #0284c7;
  font-weight: 600;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-item {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 3px;
  font-size: 0.6875rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.task-item:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.more-tasks {
  font-size: 0.6875rem;
  color: #9ca3af;
  padding: 0.125rem 0.5rem;
}

@media (max-width: 768px) {
  .period-selector {
    flex-wrap: wrap;
  }

  .period-label {
    min-width: auto;
    flex: 1;
  }

  .calendar-day {
    min-height: 80px;
  }
}
</style>
