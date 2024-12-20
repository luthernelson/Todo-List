import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTaskStore = defineStore('taskStore', () => {
  // Liste des tâches
  const taskList = ref([]);
  const showForm = ref(false);
  const showModal = ref(false);
  const selectedTask = ref(null);

  // Objet contenant les informations d'une tâche
  const task = ref({
    title: '',
    description: '',
    file: '',
    subTodoLists: [],
  });

  // Actions
  const addTask = () => {
    const newTask = { ...task.value, subTodoLists: [...task.value.subTodoLists] };
    taskList.value.push(newTask);
    resetForm();
  };

  const resetForm = () => {
    showForm.value = false;
    task.value = { title: '', description: '', file: '', subTodoLists: [] };
  };

  const removeTask = (index) => {
    taskList.value.splice(index, 1);
  };
  const removeSubTask = (index) => {
    if (task.value.subTodoLists && index >= 0 && index < task.value.subTodoLists.length) {
      task.value.subTodoLists.splice(index, 1);
    }
  };
  const toggleForm = () => {
    showForm.value = !showForm.value;
    if (showForm.value && task.value.subTodoLists.length === 0) {
      task.value.subTodoLists.push({ name: '' });
    }
  };

  const openModal = (task) => {
    selectedTask.value = task;
    showModal.value = true;
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      task.value.file = reader.result;
    };
    if (file) reader.readAsDataURL(file);
  };

  const addSubTask = () => {
    task.value.subTodoLists.push({ name: '' });
  };

  return {
    taskList,
    showForm,
    showModal,
    selectedTask,
    task,
    addTask,
    resetForm,
    removeTask,
    toggleForm,
    openModal,
    handleFileUpload,
    addSubTask,
    removeSubTask,
  };
});
