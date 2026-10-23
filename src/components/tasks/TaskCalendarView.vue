<template>
  <div class="task-calendar-view">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h2>{{ currentMonthLabel }}</h2>
      <button @click="nextMonth" class="nav-btn">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="calendar-grid">
      <div class="calendar-day-names">
        <div v-for="day in dayNames" :key="day" class="day-name">
          {{ day }}
        </div>
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
              v-for="task in day.tasks"
              :key="task.id"
              :class="['task-dot', task.priority]"
              :title="task.title"
              @click="editTask(task)"
            ></div>
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

const currentDate = ref(new Date())

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const tasks = computed(() => projectStore.activeProjectTasks)

const currentMonthLabel = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
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

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const editTask = (task) => {
  console.log('Edit task:', task)
}
</script>

<style scoped>
.task-calendar-view {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.calendar-header h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1f2937;
  text-transform: capitalize;
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

.calendar-grid {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.calendar-day-names {
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

.task-dot {
  height: 24px;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e5e7eb;
}

.task-dot:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.task-dot.low {
  background: #dbeafe;
  border-color: #bfdbfe;
}

.task-dot.medium {
  background: #fef3c7;
  border-color: #fde68a;
}

.task-dot.high {
  background: #fee2e2;
  border-color: #fecaca;
}

.task-dot.urgent {
  background: #fecaca;
  border-color: #fca5a5;
}
</style>
