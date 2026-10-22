<template>
  <div class="team-section">
    <div class="section-header">
      <h2>Équipe du projet</h2>
      <button @click="showAddMember = true" class="btn-add">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter un membre
      </button>
    </div>

    <div class="team-grid">
      <div v-for="member in teamMembers" :key="member.id" class="member-card">
        <div class="member-avatar">
          {{ member.name.charAt(0).toUpperCase() }}
        </div>
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <p class="member-email">{{ member.email }}</p>
        </div>
        <div class="member-stats">
          <div class="stat">
            <span class="stat-value">{{ member.tasksCompleted }}</span>
            <span class="stat-label">Tâches</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ member.hoursWorked }}h</span>
            <span class="stat-label">Heures</span>
          </div>
        </div>
        <div class="member-actions">
          <button @click="editMember(member)" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button @click="removeMember(member.id)" class="action-btn delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout de membre -->
    <div v-if="showAddMember" class="modal-overlay" @click="showAddMember = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter un membre</h3>
          <button @click="showAddMember = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom</label>
            <input v-model="newMember.name" type="text" placeholder="Nom du membre" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newMember.email" type="email" placeholder="email@exemple.com" />
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <select v-model="newMember.role">
              <option value="Développeur">Développeur</option>
              <option value="Designer">Designer</option>
              <option value="Chef de projet">Chef de projet</option>
              <option value="Analyste">Analyste</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddMember = false" class="btn-cancel">Annuler</button>
          <button @click="addMember" class="btn-confirm">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAddMember = ref(false)

const newMember = ref({
  name: '',
  email: '',
  role: 'Développeur',
})

const teamMembers = ref([
  {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@workstream.com',
    role: 'Chef de projet',
    tasksCompleted: 24,
    hoursWorked: 156,
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@workstream.com',
    role: 'Développeur',
    tasksCompleted: 32,
    hoursWorked: 208,
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@workstream.com',
    role: 'Designer',
    tasksCompleted: 18,
    hoursWorked: 124,
  },
  {
    id: 4,
    name: 'Pierre Leroy',
    email: 'pierre.leroy@workstream.com',
    role: 'Analyste',
    tasksCompleted: 15,
    hoursWorked: 98,
  },
  {
    id: 5,
    name: 'Claire Moreau',
    email: 'claire.moreau@workstream.com',
    role: 'Développeur',
    tasksCompleted: 28,
    hoursWorked: 192,
  },
])

const addMember = () => {
  if (newMember.value.name && newMember.value.email) {
    teamMembers.value.push({
      id: Date.now(),
      ...newMember.value,
      tasksCompleted: 0,
      hoursWorked: 0,
    })
    newMember.value = { name: '', email: '', role: 'Développeur' }
    showAddMember.value = false
  }
}

const editMember = (member) => {
  console.log('Edit member:', member)
}

const removeMember = (id) => {
  if (confirm('Voulez-vous vraiment supprimer ce membre ?')) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  }
}
</script>

<style scoped>
.team-section {
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #374151;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.member-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.member-card:hover {
  border-color: #1F2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.member-avatar {
  width: 56px;
  height: 56px;
  background: #1F2937;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.member-role {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.25rem 0;
}

.member-email {
  font-size: 0.8rem;
  color: #9CA3AF;
  margin: 0 0 1rem 0;
}

.member-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  background: #F3F4F6;
  border: none;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #E5E7EB;
  color: #1F2937;
}

.action-btn.delete:hover {
  background: #FEF2F2;
  color: #DC2626;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1F2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.btn-cancel:hover {
  background: #F3F4F6;
}

.btn-confirm {
  background: #1F2937;
  color: white;
}

.btn-confirm:hover {
  background: #374151;
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>
