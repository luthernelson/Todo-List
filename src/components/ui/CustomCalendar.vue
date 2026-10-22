<template>
  <div class="custom-calendar">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">
        <ChevronLeft :size="20" />
      </button>
      <div class="current-month">
        {{ currentMonthLabel }}
      </div>
      <button @click="nextMonth" class="nav-btn">
        <ChevronRight :size="20" />
      </button>
    </div>

    <div class="calendar-weekdays">
      <div v-for="day in weekDays" :key="day" class="weekday">
        {{ day }}
      </div>
    </div>

    <div class="calendar-days">
      <div
        v-for="day in calendarDays"
        :key="day.date"
        :class="[
          'calendar-day',
          {
            'other-month': day.isOtherMonth,
            'today': day.isToday,
            'selected': isSelected(day.date),
            'has-events': day.events?.length > 0
          }
        ]"
        @click="selectDate(day)"
      >
        <span class="day-number">{{ day.dayNumber }}</span>
        <div v-if="day.events?.length > 0" class="event-dots">
          <div
            v-for="(event, index) in day.events.slice(0, 3)"
            :key="index"
            class="event-dot"
            :style="{ backgroundColor: event.color }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="showTodayButton" class="calendar-footer">
      <button @click="goToToday" class="today-btn">
        Aujourd'hui
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date(),
  },
  events: {
    type: Array,
    default: () => [],
  },
  showTodayButton: {
    type: Boolean,
    default: true,
  },
  locale: {
    type: String,
    default: 'fr',
  },
})

const emit = defineEmits(['update:modelValue', 'dateClick'])

const currentDate = ref(new Date(props.modelValue))

const weekDays = computed(() => {
  const days = {
    fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  }
  return days[props.locale] || days.fr
})

const currentMonthLabel = computed(() => {
  const months = {
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  }
  const monthNames = months[props.locale] || months.fr
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
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
      events: getEventsForDate(date),
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
      events: getEventsForDate(date),
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
      events: getEventsForDate(date),
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

const getEventsForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return props.events.filter(event => event.date === dateStr)
}

const isSelected = (dateStr) => {
  const selectedDate = new Date(props.modelValue)
  const date = new Date(dateStr)
  return isSameDay(date, selectedDate)
}

const selectDate = (day) => {
  const date = new Date(day.date)
  emit('update:modelValue', date)
  emit('dateClick', date)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
  emit('update:modelValue', new Date())
}
</script>

<style scoped>
.custom-calendar {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: rgb(29, 40, 61);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f3f4f6;
  border-color: rgb(29, 40, 61);
}

.current-month {
  font-weight: 700;
  font-size: 1.125rem;
  color: rgb(29, 40, 61);
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
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.calendar-day:hover {
  border-color: rgb(29, 40, 61);
  background: #f9fafb;
}

.calendar-day.other-month {
  background: #f9fafb;
  color: #d1d5db;
}

.calendar-day.today {
  border-color: rgb(29, 40, 61);
  background: #eff6ff;
  font-weight: 700;
}

.calendar-day.selected {
  background: rgb(29, 40, 61);
  color: white;
  border-color: rgb(29, 40, 61);
}

.calendar-day.selected .day-number {
  color: white;
}

.calendar-day.has-events {
  background: #f0fdf4;
}

.day-number {
  font-size: 0.875rem;
  color: rgb(29, 40, 61);
}

.event-dots {
  display: flex;
  gap: 0.125rem;
  flex-wrap: wrap;
  justify-content: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.calendar-footer {
  margin-top: 1rem;
  text-align: center;
}

.today-btn {
  padding: 0.5rem 1rem;
  background: rgb(29, 40, 61);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.today-btn:hover {
  background: rgba(29, 40, 61, 0.8);
}
</style>
