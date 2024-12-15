<script setup>
import { defineProps, defineEmits } from "vue";

//Definition des props du modal

defineProps({

    isVisible: {
        type: Boolean,
        required: true,
    }, 
    data: {
      require: true,
      type: Object
    }
})

//Definition des evenements
const emit = defineEmits(["close"]);

//Methode pour fermer le Modal
const closeModal = () =>{ 
    emit("close")
};
</script>


<template>
    <div class="actions">
      <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <header class="modal-header">
            <button class="close-button" @click="closeModal">×</button>
            <h2 style="margin: 0; padding: 45px;"> Details de la tache {{ data.title }} !</h2>
         
          </header>
            <!-- Corps du Modal -->
          <div class="modal-body"   >
            <!-- Description -->
            <h3>
              <strong>Description:</strong>  {{ data.description }}
            </h3>

            <!-- Étapes de Réalisation (To-Do List) -->
            <div>   
              <ul>
                <li  v-for="(subTask, index) in data?.subTodoLists" :key="index">
                {{ subTask.name }}<input type="checkbox"/></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

</template>

<style scoped>
/* Arrière-plan semi-transparent */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-in-out;
  overflow: hidden;
}
/* Contenu de la modal */
.modal-content {
  background: #fff;
  width: auto;
  max-width: 900px; /* Limite la largeur maximale */
  height: auto;
  max-height: 90vh;
  padding: 0; /* Supprime le padding global pour plus de contrôle */
  border: 1px solid #ddd;
  position: relative; /* Position relative pour permettre un positionnement absolu des enfants */
  animation: scaleUp 0.3s ease-in-out;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* En-tête de la modal */
.modal-header {
  width: 100%; /* Prend toute la largeur de la modal-content */
  padding: 20px; /* Ajuste l'espace interne */
  background: #f4f4f4;
  border-bottom: 1px solid #ddd;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center; /* Centre le titre horizontalement */
  box-sizing: border-box; /* Assure que le padding est inclus dans la largeur */
  position: relative; /* Nécessaire pour positionner la croix par rapport à cet élément */
}

/* Bouton de fermeture "X" */
.close-button {
  position: absolute; /* Position absolue par rapport au parent (modal-header) */
  top: 10px; /* Place la croix en haut */
  right: 10px; /* Place la croix à droite */
  background: none;
  border: none;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
  z-index: 1; /* S'assure que la croix est toujours visible */
}

.close-button:hover {
  color: #ff0000;
}


/* Corps de la modal */
.modal-body {
  padding: 20px;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

/* Pied de la modal */
.modal-footer {
  padding: 20px;
  text-align: right;
  background: #f4f4f4;
  border-top: 1px solid #ddd;
}

/* Animations */
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

