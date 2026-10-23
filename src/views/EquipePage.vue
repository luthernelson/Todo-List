<template>
  <div class="equipe-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Équipe du projet</h1>
        <p>{{ project?.name || 'Sélectionnez un projet' }}</p>
      </div>
      <div class="header-actions">
        <select v-model="selectedProjectId" class="project-select" @change="loadProjectTeam">
          <option value="">Sélectionner un projet</option>
          <option v-for="project in allProjects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
        <button @click="showAddMember = true" class="btn-add" :disabled="!selectedProjectId">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter un membre
        </button>
      </div>
    </div>

    <div v-if="!selectedProjectId" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3>Sélectionnez un projet</h3>
      <p>Choisissez un projet pour voir et gérer son équipe</p>
    </div>

    <div v-else class="team-content">
      <!-- Statistiques de l'équipe -->
      <div class="team-stats">
        <div class="stat-card">
          <div class="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ teamMembers.length }}</h3>
            <p>Membres</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon tasks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalTasksCompleted }}</h3>
            <p>Tâches terminées</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon hours">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalHoursWorked }}h</h3>
            <p>Heures travaillées</p>
          </div>
        </div>
      </div>

      <!-- Liste des membres -->
      <div class="members-section">
        <div class="section-header">
          <h2>Membres de l'équipe</h2>
          <div class="filter-actions">
            <select v-model="roleFilter" class="role-filter">
              <option value="">Tous les rôles</option>
              <option value="Chef de projet">Chef de projet</option>
              <option value="Développeur">Développeur</option>
              <option value="Designer">Designer</option>
              <option value="Analyste">Analyste</option>
            </select>
          </div>
        </div>

        <div class="members-grid">
          <div v-for="member in filteredMembers" :key="member.id" class="member-card">
            <div class="member-header">
              <div class="member-avatar" :style="{ background: getMemberColor(member.role) }">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div class="member-info">
                <h3>{{ member.name }}</h3>
                <span class="member-role-badge">{{ member.role }}</span>
              </div>
              <div class="member-actions">
                <button @click="editMember(member)" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="removeMember(member.id)" class="action-btn delete" title="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="member-stats">
              <div class="stat-item">
                <span class="stat-label">Tâches</span>
                <span class="stat-value">{{ member.tasksCompleted }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Heures</span>
                <span class="stat-value">{{ member.hoursWorked }}h</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Performance</span>
                <span class="stat-value">{{ calculatePerformance(member) }}%</span>
              </div>
            </div>

            <div class="member-tasks">
              <h4>Tâches en cours</h4>
              <div class="task-list">
                <div v-for="task in member.currentTasks.slice(0, 3)" :key="task.id" class="task-item">
                  <span class="task-name">{{ task.name }}</span>
                  <span class="task-status" :class="task.status">{{ task.status }}</span>
                </div>
                <div v-if="member.currentTasks.length === 0" class="no-tasks">
                  Aucune tâche en cours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout/Modification Membre -->
    <div v-if="showAddMember" class="modal-overlay" @click="showAddMember = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingMember ? 'Modifier' : 'Ajouter' }} un membre</h3>
          <button @click="closeMemberModal" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom</label>
            <input v-model="memberForm.name" type="text" placeholder="Nom du membre" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="memberForm.email" type="email" placeholder="email@exemple.com" />
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <select v-model="memberForm.role">
              <option value="Chef de projet">Chef de projet</option>
              <option value="Développeur">Développeur</option>
              <option value="Designer">Designer</option>
              <option value="Analyste">Analyste</option>
              <option value="Testeur">Testeur</option>
            </select>
          </div>
          <div class="form-group">
            <label>Taux horaire (€/h)</label>
            <input v-model="memberForm.hourlyRate" type="number" placeholder="50" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeMemberModal" class="btn-cancel">Annuler</button>
          <button @click="saveMember" class="btn-confirm">{{ editingMember ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedProjectId = ref('')
const roleFilter = ref('')
const showAddMember = ref(false)
const editingMember = ref(null)

const memberForm = ref({
  name: '',
  email: '',
  role: 'Développeur',
  hourlyRate: 50,
})

const allProjects = ref([
  { id: 1, name: 'Refonte E-commerce' },
  { id: 2, name: 'Application Mobile' },
  { id: 3, name: 'Dashboard Analytics' },
  { id: 4, name: 'Campagne Social Media' },
  { id: 5, name: 'SEO Audit' },
])

const teamMembers = ref([
  {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@workstream.com',
    role: 'Chef de projet',
    hourlyRate: 75,
    tasksCompleted: 45,
    hoursWorked: 320,
    currentTasks: [
      { id: 1, name: 'Planification sprint', status: 'in_progress' },
      { id: 2, name: 'Revue code', status: 'todo' },
    ],
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@workstream.com',
    role: 'Développeur',
    hourlyRate: 65,
    tasksCompleted: 68,
    hoursWorked: 480,
    currentTasks: [
      { id: 3, name: 'API authentification', status: 'in_progress' },
      { id: 4, name: 'Tests unitaires', status: 'todo' },
      { id: 5, name: 'Documentation', status: 'todo' },
    ],
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@workstream.com',
    role: 'Designer',
    hourlyRate: 55,
    tasksCompleted: 32,
    hoursWorked: 210,
    currentTasks: [
      { id: 6, name: 'Maquettes dashboard', status: 'in_progress' },
    ],
  },
  {
    id: 4,
    name: 'Pierre Leroy',
    email: 'pierre.leroy@workstream.com',
    role: 'Analyste',
    hourlyRate: 60,
    tasksCompleted: 28,
    hoursWorked: 190,
    currentTasks: [
      { id: 7, name: 'Analyse besoins', status: 'done' },
    ],
  },
  {
    id: 5,
    name: 'Claire Moreau',
    email: 'claire.moreau@workstream.com',
    role: 'Développeur',
    hourlyRate: 65,
    tasksCompleted: 54,
    hoursWorked: 380,
    currentTasks: [
      { id: 8, name: 'Intégration frontend', status: 'in_progress' },
      { id: 9, name: 'Optimisation performance', status: 'todo' },
    ],
  },
])

const project = computed(() => {
  return allProjects.value.find(p => p.id === parseInt(selectedProjectId.value))
})

const filteredMembers = computed(() => {
  if (!roleFilter.value) return teamMembers.value
  return teamMembers.value.filter(m => m.role === roleFilter.value)
})

const totalTasksCompleted = computed(() => {
  return teamMembers.value.reduce((sum, m) => sum + m.tasksCompleted, 0)
})

const totalHoursWorked = computed(() => {
  return teamMembers.value.reduce((sum, m) => sum + m.hoursWorked, 0)
})

const getMemberColor = (role) => {
  const colors = {
    'Chef de projet': '#293848',
    'Développeur': '#10B981',
    'Designer': '#8B5CF6',
    'Analyste': '#F59E0B',
    'Testeur': '#EF4444',
  }
  return colors[role] || '#6B7280'
}

const calculatePerformance = (member) => {
  if (member.hoursWorked === 0) return 0
  const efficiency = (member.tasksCompleted / member.hoursWorked) * 100
  return Math.round(efficiency * 10) / 10
}

const loadProjectTeam = () => {
  // Charger l'équipe du projet sélectionné
  console.log('Loading team for project:', selectedProjectId.value)
}

const editMember = (member) => {
  editingMember.value = member
  memberForm.value = {
    name: member.name,
    email: member.email,
    role: member.role,
    hourlyRate: member.hourlyRate,
  }
  showAddMember.value = true
}

const removeMember = (id) => {
  if (confirm('Voulez-vous vraiment supprimer ce membre de l\'équipe ?')) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  }
}

const closeMemberModal = () => {
  showAddMember.value = false
  editingMember.value = null
  memberForm.value = { name: '', email: '', role: 'Développeur', hourlyRate: 50 }
}

const saveMember = () => {
  if (memberForm.value.name && memberForm.value.email) {
    if (editingMember.value) {
      // Modification
      const index = teamMembers.value.findIndex(m => m.id === editingMember.value.id)
      if (index !== -1) {
        teamMembers.value[index] = {
          ...teamMembers.value[index],
          ...memberForm.value,
        }
      }
    } else {
      // Création
      teamMembers.value.push({
        id: Date.now(),
        ...memberForm.value,
        tasksCompleted: 0,
        hoursWorked: 0,
        currentTasks: [],
      })
    }
    closeMemberModal()
  }
}
</script>

<style scoped>
.equipe-page {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
  gap: 1rem;
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.375rem 0;
}

.header-content p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.project-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-add:hover:not(:disabled) {
  background: #1f2937;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6B7280;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.users {
  background: linear-gradient(135deg, #293848 0%, #4a5568 100%);
}

.stat-icon.tasks {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.stat-icon.hours {
  background: linear-gradient(135deg, #F59E0B 0%, #d97706 100%);
}

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.stat-info p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0.25rem 0 0 0;
}

.members-section {
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.role-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.member-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.member-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-info h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.member-role-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #6B7280;
  border-radius: 4px;
  font-weight: 500;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.member-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.6875rem;
  color: #6B7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
}

.member-tasks h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 0.75rem;
}

.task-name {
  color: #374151;
  font-weight: 500;
}

.task-status {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
}

.task-status.in_progress {
  background: #dbeafe;
  color: #1e40af;
}

.task-status.todo {
  background: #fef3c7;
  color: #92400e;
}

.task-status.done {
  background: #d1fae5;
  color: #065f46;
}

.no-tasks {
  font-size: 0.75rem;
  color: #9CA3AF;
  text-align: center;
  padding: 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
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
  box-shadow: 0 10px 15 -3px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
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
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 2px rgba(41, 56, 72, 0.05);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-cancel {
  background: white;
  color: #6B7280;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-confirm {
  background: #293848;
  color: white;
  border-color: #293848;
}

.btn-confirm:hover {
  background: #1f2937;
  border-color: #1f2937;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .project-select,
  .btn-add {
    width: 100%;
  }

  .team-stats {
    grid-template-columns: 1fr;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .member-stats {
    grid-template-columns: 1fr;
  }
}
</style>
