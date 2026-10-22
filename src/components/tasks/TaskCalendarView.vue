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
  margin-bottom: 1.5rem;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-transform: capitalize;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: #e5e7eb;
}

.calendar-grid {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.day-name {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
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
  transition: background 0.2s ease;
}

.calendar-day:hover {
  background: #f9fafb;
}

.calendar-day.other-month {
  background: #f9fafb;
  opacity: 0.5;
}

.calendar-day.today {
  background: #eff6ff;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.calendar-day.today .day-number {
  color: #2563eb;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-dot {
  height: 24px;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-dot:hover {
  transform: scale(1.05);
}

.task-dot.low {
  background: #3b82f6;
}

.task-dot.medium {
  background: #f59e0b;
}

.task-dot.high {
  background: #ef4444;
}

.task-dot.urgent {
  background: #dc2626;
}
</style>
