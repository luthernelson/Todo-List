<script setup>

  import { defineEmits } from 'vue';

  
  const emit = defineEmits(['remove-tasks', 'open-modal']);

  const props = defineProps({
    data: Object,
    
  });
  console.log(props.data)
// ------------------------------------ fonctions -------------------

  const toggleTaskState = (task) => {
    task.etat = task.etat === 'Terminé' ? 'En cours' : 'Terminé';// fonction gerant le statuts d'une tache
  };

  const removeTask = (index) => { // fonction de suppression d'une tache
    emit('remove-tasks', index)
  }; 
  </script>

  <template>
    <div>
      <div class="tasks-grid">
          <div class="task-card">
            <div class="task-image">
              <img v-if="data.file" :src="data.file" alt="Task Image" style="width:80px; height: 80px; border-radius:100%;" />
            </div>
            <div class="task-info">
              <h2 @click.self="$emit('open-modal', data)"> {{ data.title }}</h2>
              <p>{{ data.description }}</p>
              <span class="task-state" :class="{ completed: data.etat === 'Terminé' }">
              {{ data.etat || 'En cours' }}
              </span>
              <label>
                <input type="checkbox" :checked="data.etat" @change="toggleTaskState(data)" />
              </label>
              <button class="btn btn-primary" @click="removeTask(index)">
                <i class="fa-solid fa-trash-can fa-2x" style="color: #ff0000;"></i>
              </button>
            </div>
         </div>
        </div>
      </div>
  </template>

  <style scoped>
 
  /* Carte individuelle représentant une tâche */
  .task-card {
    background-color: #f3eded; /* Fond blanc pour contraste */
    border-radius: 10px; /* Coins arrondis */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre douce */
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 15px;
    position: relative; /* Positionnement pour les enfants absolus */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Animation hover */
  }
  
  /* Animation au survol */
  .task-card:hover {
    transform: translateY(-5px); /* Légère élévation */
    box-shadow: 0 8px 12px rgb(0, 0, 0); /* Ombre plus prononcée */
    cursor:auto;
  }
  
  /* Image ou icône représentant une tâche */
  .task-image {
    width: 80px;
    height: 80px;
    background-color: #d54c4c; /* Rouge vif */
    border-radius:100%;
    color: #ffffff; /* Texte blanc */
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1rem;
      top: 10px; 
  }
  
  /* Conteneur des informations sur la tâche */
  .task-info {
    flex: 1; /* Occupe tout l'espace disponible */
  }
  
  /* Titre de la tâche */
  .task-info h2 {
    margin: 0;
    color: #333333; /* Texte noir doux */
    font-size: 1.2rem;
    font-weight: bold;
    cursor:pointer;
  }
  
  /* Description de la tâche */
  .task-info p {
    margin: 10px 0;
    font-size: 1rem;
    color: #666666; /* Texte gris doux */
    line-height: 1.5;
  }
  
  /* Badge d'état */
  .task-state {
    background-color: #6b5b95; /* Couleur violet doux */
    color: #fdfdfd;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8rem;
    text-transform: uppercase;
    position: absolute;
    top: 10px; /* En haut */
    right: 10px; /* À droite */
  }
  
  /* Bouton pour supprimer une tâche */
  .task-card button {
    background-color: transparent; /* Fond transparent */
    border: none; /* Pas de bordure */
    position: absolute;
    bottom: 10px; /* En bas */
    right: 10px; /* À droite */
    cursor: pointer;
    transition: transform 0.2s ease; /* Animation au survol */
  }
  
  /* Icône de suppression */
  .task-card button i {
    font-size: 1.5rem;
    color: #ff0000; /* Rouge vif */
  }
  
  /* Animation au survol du bouton */
  .task-card button:hover i {
    transform: scale(1.2); /* Grossissement */
  }
    
  
    div {
      margin-top: 20px;
    }
    
    div ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    
    div ul li {
      color: #555;
      font-size: 1rem;
      margin-bottom: 5px;
      position: relative;
    }
    
    div ul li::before {
      content: "•";
      color: #4caf50;
      position: absolute;
      left: -20px;
    }
    
    div ul li:hover {
      color: #333;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 10px; /* Espacement entre la barre de recherche et le bouton */
    }
    
    .search-bar {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      flex: 1; /* Permet à la barre de recherche de s'étendre */
      max-width: 300px; /* Largeur maximale */
    }
    
  </style>
