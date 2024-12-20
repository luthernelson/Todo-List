<script setup>
import { useTaskStore } from './stores/taskStore'
import Task from './components/Task.vue'
import Modal from './components/Modal.vue'

const taskStore = useTaskStore()
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 bg-white"
  >
    <h1
      class="font-bold text-3xl sm:text-4xl md:text-5xl font-serif text-center text-gray-800 mb-6"
    >
      LISTE DES TACHES
    </h1>
    <div class="w-full max-w-4xl pt-10">
      <div v-if="!taskStore.showForm" class="flex flex-col mb-20">
        <!-- Bouton de création de tâche -->
        <div class="flex justify-end mb-4">
          <button
            @click="taskStore.toggleForm"
            class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Créer une nouvelle tâche
          </button>
        </div>

        <!-- Filtre (input + bouton rechercher collés) -->
        <div class="flex items-center space-x-0">
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
        </div>
      </div>
    </div>

    <!-- Formulaire de création de tâche -->
    <div v-if="taskStore.showForm">
      <div class="flex justify-end mb-4">
        <button
          @click="taskStore.toggleForm"
          class="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-all"
        >
          Revenir en arrière
        </button>
      </div>
      <form
        @submit.prevent="taskStore.addTask"
        class="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 w-full max-w-4xl"
      >
        <div>
          <h1 class="text-3xl text-gray-700 font-bold">AJOUTER UNE NOUVELLE TACHE</h1>
        </div>
        <div class="mt-8">
          <label class="text-lg text-gray-700 font-bold">Titre de la tâche</label>
          <input
            type="text"
            @keydown.enter.prevent
            v-model="taskStore.task.title"
            placeholder="Titre de la tâche"
            required
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          />

          <label class="text-lg text-gray-700 font-bold">Sélectionner une image</label>
          <input
            type="file"
            @change="(e) => taskStore.handleFileUpload(e.target.files[0])"
            required
            class="w-full mt-2 mb-4"
          />

          <label class="text-lg text-gray-700 font-bold">Description</label>
          <textarea
            v-model="taskStore.task.description"
            required
            placeholder="Description....."
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          ></textarea>

          <label class="text-lg text-gray-700 font-bold">Étape de réalisation de la tâche</label>
          <div
            v-for="(subTask, index) in taskStore.task.subTodoLists"
            :key="index"
            class="flex mb-2"
          >
            <input
              v-model="subTask.name"
              type="text"
              required
              class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              @click.prevent="taskStore.removeSubTask(index)"
              type="button"
              class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
            >
              Supprimer
            </button>
          </div>
          <div>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all mt-4"
              @click.prevent="taskStore.addSubTask"
            >
              Ajouter une étape
            </button>
          </div>
          <div class="flex justify-center mt-6">
            <button
              type="submit"
              class="w-full mt-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
            >
              ENREGISTRER
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
      <img src="@/assets/animations/alarme.gif" alt="Animation GIF" class="w-32 h-32 mb-4" />
      <p class="text-xl">Aucune tâche disponible :(</p>
    </div>

    <!-- Liste des tâches -->
    <div
      v-if="!taskStore.showForm && taskStore.taskList.length > 0"
      class="w-full max-w-6xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-1 ju"
    >
      <Task
        v-for="(list, index) in taskStore.taskList"
        :key="index"
        :data="list"
        @open-modal="taskStore.openModal"
        @remove-tasks="taskStore.removeTask(index)"
      />
      <Modal
        :isVisible="taskStore.showModal"
        :data="taskStore.selectedTask"
        @close="taskStore.showModal = false"
      >
        <ul>
          <li v-for="(subTask, index) in taskStore.selectedTask?.subTodoLists" :key="index">
            {{ subTask.name }}
          </li>
        </ul>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
