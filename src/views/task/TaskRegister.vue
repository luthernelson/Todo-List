<script setup>
import { useTaskStore } from '../../stores/taskStore'
import Task from '../../components/Task.vue'
import Modal from '../../components/Modal.vue'
import UserModal from '../../components/ModalUser.vue'
import { onBeforeMount, ref, onMounted } from 'vue'
import { apiService } from '@/service/apiServices'

const taskStore = useTaskStore()
const newTask = ref({
  title: '',
  description: '',
  isCompled: false,
  todos: [],
})

const addNewTask = async () => {
  const newTaskData = {
    title: newTask.value.title,
    description: newTask.value.description,
    isCompled: newTask.value.isCompled,
    todos: newTask.value.todos.map((todo) => ({
      title: todo.title,
      isCompled: todo.isCompled || false,
    })),
  }

  try {
    if (taskStore.selectedTask) {
      const currentTask = taskStore.selectedTask
      console.log('Current Task:', currentTask) // Vérifiez la tâche sélectionnée
      const existingTodosMap = new Map(currentTask.todos.map((todo) => [todo.idTodo, todo]))

      // Identifier les nouveaux todos et les mettre à jour
      const finalTodos = newTask.value.todos.map((newTodo) => {
        const existingTodo = existingTodosMap.get(newTodo.idTodo)
        if (existingTodo) {
          // Si le todo existe, mettre à jour ses propriétés
          return { ...existingTodo, title: newTodo.title, isCompled: newTodo.isCompled }
        }
        // Sinon, c'est un nouveau todo
        return { title: newTodo.title, isCompled: newTodo.isCompled, idTodo: newTodo.idTodo }
      })

      // Identifier les todos supprimés
      const deletedTodos = currentTask.todos.filter(
        (todo) => !newTask.value.todos.some((newTodo) => newTodo.idTodo === todo.idTodo),
      )

      // Supprimer les todos supprimés via l'API
      for (const deletedTodo of deletedTodos) {
        await handleDeleteTodo(currentTask.task.idTask, deletedTodo.idTodo)
      }

      // Mise à jour de la tâche via l'API
      const result = await apiService.updateTask(currentTask.task.idTask, {
        ...newTaskData,
        todos: finalTodos,
      })
      console.log('result.updateTask', result)

      const updatedTask = {
        task: {
          idTask: currentTask.task.idTask,
          title: newTaskData.title,
          description: newTaskData.description,
          isCompled: newTaskData.isCompled,
        },
        todos: finalTodos, // Utiliser la liste finale
      }

      // Mise à jour de la tâche dans le store
      taskStore.updatedSelecteTask(updatedTask) // Assurez-vous que la méthode est bien nommée
    } else {
      // Création d'une nouvelle tâche
      const createdTask = await apiService.addTask(newTaskData)
      console.log('newTaskData', newTaskData)
      taskStore.addTask(createdTask)
    }

    resetForm()
    taskStore.showForm = false // Fermer le formulaire pour afficher la liste
    await getAllTask() // Récupérer toutes les tâches
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error)
  }
}

const handleUpdateTask = (task) => {
  console.log('Tâche à modifier:', task)
  newTask.value = {
    title: task.task.title,
    description: task.task.description,
    isCompled: task.task.isCompled,
    todos: task.todos.map((todo) => ({ title: todo.title, isCompled: todo.isCompled })),
  }
  console.log("Valeurs de newTask avant d'afficher le formulaire:", newTask.value)

  taskStore.setSelectedTask(task)
  console.log('Tâche sélectionnée dans le store:', taskStore.selectedTask)
  taskStore.showForm = true
}
const resetForm = () => {
  newTask.value = {
    title: '',
    description: '',
    isCompled: false,
    todos: [],
  }
  taskStore.selectedTask = null // Réinitialiser la tâche sélectionnée
}

const handleDeleteTask = async (id) => {
  console.log('ID reçu pour suppression:', id) // Vérifiez ici
  try {
    const taskId = Number(id)
    if (isNaN(taskId)) {
      throw new Error("L'ID de la tâche n'est pas un nombre valide.")
    }

    // Appeler l'API pour supprimer la tâche
    await apiService.removeTask(taskId)
    taskStore.removeTask(taskId) // Supprime la tâche du store
    console.log(`La tâche avec l'ID ${taskId} a été supprimée avec succès.`)
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error.message)
  }
}
const handleDeleteTodo = async (taskId, todoId) => {
  console.log('ID reçu pour suppression:', taskId, todoId) // Vérifiez ici
  console.log('Structure de todos avant suppression:', taskStore.selectedTask.todos)
  try {
    const TaskId = Number(taskId)
    const TodoId = Number(todoId)
    if (isNaN(TaskId) || isNaN(TodoId)) {
      throw new Error("L'ID de la tâche ou du Todo n'est pas un nombre valide.")
    }

    // Appeler l'API pour supprimer le Todo
    await apiService.removeTodo(TaskId, TodoId)

    console.log(`Le Todo avec l'ID ${TodoId} a été supprimé avec succès.`)
  } catch (error) {
    console.error('Erreur lors de la suppression du Todo:', error.message)
  }
}
const removeSubTasks = async (index) => {
  if (index >= 0 && index < newTask.value.todos.length) {
    const todoToDelete = newTask.value.todos[index]

    // Supprimer le todo de l'interface
    newTask.value.todos.splice(index, 1)

    // Si la tâche sélectionnée existe, supprimer le todo via l'API
    if (taskStore.selectedTask) {
      await handleDeleteTodo(taskStore.selectedTask.task.idTask, todoToDelete.idTodo)
    }
  } else {
    console.error('todo introuvable')
  }
}
const removeSubTask = (index) => {
  if (index >= 0 && index < newTask.value.todos.length) {
    // Supprime le todo à l'index spécifié
    newTask.value.todos.splice(index, 1)
  } else {
    console.error('todo introuvable')
  }
}

const getAllTask = async () => {
  try {
    return await apiService.getTasks()
  } catch (e) {
    console.log('ERROR :: TaskRegister.getAllTask', e)
    return []
  }
}

onBeforeMount(async () => {
  const taskList = await getAllTask()
  taskStore.taskList =
    !taskList.tasksWithTodos || taskList.tasksWithTodos.length == 0 ? [] : taskList.tasksWithTodos
  console.log('taskStore.taskList ', taskStore.taskList)
  taskStore.setTaskList(taskList)
})
onMounted(async () => {
  await getAllTask()
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 bg-white"
  >
    <div class="w-full max-w-4xl pt-10">
      <div v-if="!taskStore.showForm" class="flex flex-col mb-20">
        <h1
          class="font-bold text-3xl sm:text-4xl md:text-5xl font-serif text-center text-gray-800 mb-6"
        >
          LISTE DES TACHES
        </h1>
        <!-- Bouton de création de tâche -->
        <!--       <div class="flex justify-end mb-4 mt-8">
          <button
            @click="taskStore.toggleForm"
            class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Créer une nouvelle tâche
          </button>
        </div>
 -->
        <!-- Filtre (input + bouton rechercher collés) -->
        <!--         <div class="flex items-center space-x-0">
          <div class="flex-1">
            <input
              type="text"
              placeholder="Rechercher....."
              class="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>
          <button
            class="bg-sky-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition-all"
          >
            Rechercher
          </button>
        </div> -->
      </div>
    </div>

    <!-- Formulaire de création de tâche -->
    <div v-if="taskStore.showForm">
      <div class="flex justify-end mb-4">
        <button
          @click="(resetForm(), taskStore.setSelectedTask(null), taskStore.toggleForm())"
          class="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-all"
        >
          Revenir en arrière
        </button>
      </div>
      <form
        @submit.prevent="addNewTask"
        class="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 w-full overflow-y-auto h-[60vh] max-w-4xl"
      >
        <div>
          <h1 class="text-3xl text-gray-700 font-bold">
            {{ taskStore.selectedTask ? 'MODIFIER LA TÂCHE' : 'AJOUTER UNE NOUVELLE TÂCHE' }}
          </h1>
        </div>
        <div class="mt-8">
          <label class="text-lg text-gray-700 font-bold">Titre de la tâche</label>
          <input
            type="text"
            @keydown.enter.prevent
            v-model="newTask.title"
            placeholder="Titre de la tâche"
            required
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          />

          <!--      <label class="text-lg text-gray-700 font-bold">Sélectionner une image</label>
          <input
            type="file"
            @change="(e) => taskStore.handleFileUpload(e.target.files[0])"
            required
            class="w-full mt-2 mb-4"
          /> -->

          <label class="text-lg text-gray-700 font-bold">Description</label>
          <textarea
            v-model="newTask.description"
            required
            placeholder="Description....."
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          ></textarea>

          <label class="text-lg text-gray-700 font-bold">Étape de réalisation de la tâche</label>
          <div v-for="(todo, index) in newTask.todos" :key="index" class="flex mb-2">
            <input
              v-model="todo.title"
              type="text"
              required
              class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              @click="taskStore.selectedTask ? removeSubTasks(index) : removeSubTask(index)"
              type="button"
              class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
            >
              Supprimer
            </button>
          </div>
          <div>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all mt-4"
              @click.prevent="newTask.todos.push({ title: '', isCompled: false })"
            >
              Ajouter une étape
            </button>
          </div>
          <div class="flex justify-center mt-6">
            <button
              type="submit"
              class="w-full mt-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
            >
              {{ taskStore.selectedTask ? 'SAUVEGARDER' : 'ENREGISTRER' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Message quand aucune tâche n'est disponible -->
    <div
      v-if="taskStore.taskList.length === 0 && !taskStore.showForm"
      class="flex flex-col items-center justify-center text-center text-gray-600 h-60"
    >
      <img
        src="@/assets/animations/task.png"
        alt="Animation GIF"
        class="w-[450px] h-[450px] mt-36 border-none"
      />
    </div>

    <!-- Liste des tâches -->
    <div
      v-if="!taskStore.showForm && taskStore.taskList.length > 0"
      class="w-full max-w-[1800px] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 ju"
    >
      <Task
        v-for="(task, index) in taskStore.taskList"
        :key="index"
        :data="task"
        @open-modal="taskStore.openModal(task)"
        @open-user-modal="taskStore.openUserModal(task)"
        @open-update-modal="handleUpdateTask(task)"
        @remove-tasks="handleDeleteTask(task.task.idTask)"
      />
      <Modal
        :isVisible="taskStore.showModal"
        :data="taskStore.selectedTask"
        @close="taskStore.showModal = false"
      >
      </Modal>
      <UserModal
        :isVisible="taskStore.ismodalvisible"
        :data="taskStore.selectedTask"
        @close="taskStore.ismodalvisible = false"
      >
      </UserModal>
    </div>
  </div>
</template>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
