<script setup>
import { useTaskStore } from './stores/taskStore';
import Task from './components/Task.vue';
import Modal from './components/Modal.vue';

const taskStore = useTaskStore();
</script>

<template>
  <div class="container">
    <h1>LISTE DES TACHES</h1>
    <button @click="taskStore.toggleForm" class="add-button">Créer une nouvelle tâche</button>

    <form v-if="taskStore.showForm" @submit.prevent="taskStore.addTask">
      <label style="color:black;">Titre de la Tache</label>
      <br /><input type="text" v-model="taskStore.task.title" placeholder="Titre de la tache" required />
      <br /><label style="color:black;">Sélectionner une image</label>
      <br /><input type="file" @change="e => taskStore.handleFileUpload(e.target.files[0])" required />
      <br /><label style="color:black;">Description</label>
      <br /><textarea v-model="taskStore.task.description" required></textarea>

      <label style="color:black;">Étape de réalisation de la tâche</label>
      <div v-for="(subTask, index) in taskStore.task.subTodoLists" :key="index">
        <br /><input v-model="subTask.name" type="text" required />
      </div>
      <button class="btn btn-secondary" @click.prevent="taskStore.addSubTask">
        Ajouter une étape
      </button>

      <br /><button type="submit">ENREGISTRER</button>
    </form>

    <div v-if="taskStore.taskList.length === 0" style="display: flex; justify-content: center; align-items: center; color:black; height: 60vh; font-size: 60px;">
      <img src="@/assets/animations/alarme.gif" alt="Animation GIF" style="width: 150px; height: 150px;" />
      <br />Aucune Tâches disponible :(
    </div>
    <div v-else class="tasks-grid">
      <Task
        v-for="(list, index) in taskStore.taskList"
        :key="index"
        :data="list"
        @open-modal="taskStore.openModal"
        @remove-tasks="taskStore.removeTask(index)"
      />
      <Modal :isVisible="taskStore.showModal" :data="taskStore.selectedTask" @close="taskStore.showModal = false">
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
 form {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  form label {
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    display: block;
  }
  
  form input[type="text"],
  form input[type="file"],
  form textarea {
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  
  form input:focus,
  form textarea:focus {
    border-color: #4caf50;
    outline: none;
  }
  
  form button[type="submit"],
  form .btn {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  form button[type="submit"]:hover,
  form .btn:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  form button[type="submit"]:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  form .btn {
    display:flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #024d99;
    color: white;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.3s ease;
  }
  
  form .btn:hover {
    background-color: #0056b3;
  }
  
  form .btn i {
    margin-right: 5px;
  }
  

  h1 {
      font-size: 24px;
      text-transform: uppercase;
      color: black;
      font-weight: bold;
      margin-bottom: 20px;
  }
  
  .add-button {
    width: 300px;
      background-color: #059211;
      color: #ffffff;
      border: none;
      padding: 10px 50px;
      border-radius: 5px;
      cursor: pointer;
      float: right;
      margin-bottom: 20px;
  }
    /* Bloc contenant toutes les tâches */
    .tasks-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr)); /* Colonnes responsives */
  gap: 20px; /* Espacement entre les colonnes */
}
 
</style>
