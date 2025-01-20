<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { apiService } from '@/service/apiServices'

const taskStore = useTaskStore()
// Définition des props du modal
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: {
    require: true,
    type: Object,
  },
})

// Définition des événements
const emit = defineEmits(['close'])
console.log('props.data', props.data)
const canUpdate = ref(false)
const blueBtn =
  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
const grayBtn =
  'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
// Méthode pour fermer le modal
const closeModal = () => {
  taskStore.updateSelectedTask(null)
  emit('close')
}

const handleTodoCheck = (todoId) => {
  const tempTask = taskStore.selectedTask
  let allCompleted = true
  tempTask.todos.map((todo) => {
    if (todo.idTodo == todoId) {
      todo.isCompled = !todo.isCompled
      canUpdate.value = true
    }
    if (!todo.isCompled) {
      allCompleted = false
    }
    return todo
  })
  tempTask.task.isCompled = allCompleted
  console.log('TODO', tempTask)

  taskStore.updateSelectedTask(tempTask)
}
const handleUpdate = async () => {
  try {
    const result = await apiService.updateTask(taskStore.selectedTask.task.idTask, {
      ...taskStore.selectedTask.task,
      todos: taskStore.selectedTask.todos,
    })
    console.log('result', result)
    taskStore.updateSelectedTask(null)
    canUpdate.value = false
    emit('close')
  } catch (e) {
    console.log('something went wrong during the process', e)
  }
}
</script>

<template>
  <div class="actions">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
    >
      <div
        class="bg-white max-w-3xl w-full max-h-[90vh] p-4 rounded-lg shadow-lg overflow-y-auto animate-scaleUp"
      >
        <!-- En-tête de la modal -->
        <header
          class="w-full p-4 bg-slate-100 border-b border-slate-300 text-center font-bold text-xl relative"
        >
          <button
            class="absolute top-2 right-2 text-4xl text-slate-700 hover:text-red-600"
            @click="closeModal"
          >
            ×
          </button>
          <h2 class="m-0">Détails de la tâche {{ data.task.title }} !</h2>
        </header>

        <!-- Corps du modal -->
        <div class="modal-body p-4">
          <!-- Description -->
          <h3 class="text-lg font-semibold mb-4">
            <strong>Description:</strong> {{ data.task.description }}
          </h3>

          <!-- Étapes de réalisation (To-Do List) -->
          <div>
            <ul class="list-disc pl-6 space-y-2">
              <li v-for="(todo, index) in data.todos" :key="index" class="flex items-center">
                <input
                  type="checkbox"
                  class="mr-2"
                  :checked="todo.isCompled"
                  @click="
                    () => {
                      handleTodoCheck(todo.idTodo)
                    }
                  "
                />
                {{ todo.title }}
              </li>
            </ul>
          </div>

          <div class="flex justify-center mt-10">
            <button
              :disabled="!canUpdate"
              type="button"
              :class="canUpdate ? blueBtn : grayBtn"
              @click="handleUpdate"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
