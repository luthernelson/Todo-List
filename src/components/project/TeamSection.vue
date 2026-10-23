<template>
  <div class="team-section">
    <div class="section-header">
      <h2>Gestion des équipes</h2>
      <button @click="showAddCompany = true" class="btn-add">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouvelle entreprise
      </button>
    </div>

    <!-- Liste des entreprises -->
    <div class="companies-list">
      <div v-for="company in companies" :key="company.id" class="company-card">
        <div class="company-header">
          <div class="company-info">
            <h3>{{ company.name }}</h3>
            <p>{{ company.description }}</p>
          </div>
          <div class="company-stats">
            <span class="stat-badge">{{ company.projects.length }} projets</span>
            <span class="stat-badge">{{ getTotalMembers(company) }} membres</span>
          </div>
        </div>

        <!-- Projets de l'entreprise -->
        <div class="projects-section">
          <h4>Projets</h4>
          <div class="projects-grid">
            <div v-for="project in company.projects" :key="project.id" class="project-item">
              <div class="project-dot" :style="{ background: project.color }"></div>
              <div class="project-details">
                <h5>{{ project.name }}</h5>
                <p>{{ project.members.length }} membres</p>
              </div>
              <button @click="showProjectMembers(project)" class="btn-view-members">
                Voir l'équipe
              </button>
            </div>
          </div>
        </div>

        <!-- Membres de l'entreprise -->
        <div class="members-section">
          <h4>Tous les membres</h4>
          <div class="members-grid">
            <div v-for="member in company.members" :key="member.id" class="member-card">
              <div class="member-avatar">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div class="member-info">
                <h5>{{ member.name }}</h5>
                <p class="member-role">{{ member.role }}</p>
                <p class="member-projects">{{ getMemberProjects(member, company) }}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout Entreprise -->
    <div v-if="showAddCompany" class="modal-overlay" @click="showAddCompany = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter une entreprise</h3>
          <button @click="showAddCompany = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input v-model="newCompany.name" type="text" placeholder="Ex: TechCorp Inc." />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newCompany.description" placeholder="Description de l'entreprise..." rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddCompany = false" class="btn-cancel">Annuler</button>
          <button @click="addCompany" class="btn-confirm">Ajouter</button>
        </div>
      </div>
    </div>

    <!-- Modal Voir Équipe Projet -->
    <div v-if="showProjectModal" class="modal-overlay" @click="showProjectModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Équipe: {{ selectedProject?.name }}</h3>
          <button @click="showProjectModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="project-members-list">
            <div v-for="member in selectedProject?.members" :key="member.id" class="project-member-item">
              <div class="member-avatar">{{ member.name.charAt(0).toUpperCase() }}</div>
              <div class="member-info">
                <h4>{{ member.name }}</h4>
                <p>{{ member.role }}</p>
              </div>
              <div class="member-badge">{{ member.companyRole }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAddCompany = ref(false)
const showProjectModal = ref(false)
const selectedProject = ref(null)

const newCompany = ref({
  name: '',
  description: '',
})

// Structure multi-entreprises avec projets et membres
const companies = ref([
  {
    id: 1,
    name: 'TechCorp Solutions',
    description: 'Entreprise spécialisée dans le développement logiciel',
    members: [
      {
        id: 1,
        name: 'Marie Dupont',
        role: 'Directrice Technique',
        companyRole: 'Admin',
        tasksCompleted: 124,
        hoursWorked: 856,
        projectIds: [1, 2],
      },
      {
        id: 2,
        name: 'Jean Martin',
        role: 'Lead Developer',
        companyRole: 'Développeur',
        tasksCompleted: 156,
        hoursWorked: 1080,
        projectIds: [1, 2, 3],
      },
      {
        id: 3,
        name: 'Sophie Bernard',
        role: 'UX Designer',
        companyRole: 'Designer',
        tasksCompleted: 89,
        hoursWorked: 620,
        projectIds: [1],
      },
    ],
    projects: [
      {
        id: 1,
        name: 'Refonte E-commerce',
        color: '#10B981',
        members: [
          { id: 1, name: 'Marie Dupont', role: 'Chef de projet', companyRole: 'Admin' },
          { id: 2, name: 'Jean Martin', role: 'Développeur', companyRole: 'Développeur' },
          { id: 3, name: 'Sophie Bernard', role: 'Designer', companyRole: 'Designer' },
        ],
      },
      {
        id: 2,
        name: 'Application Mobile',
        color: '#293848',
        members: [
          { id: 1, name: 'Marie Dupont', role: 'Chef de projet', companyRole: 'Admin' },
          { id: 2, name: 'Jean Martin', role: 'Développeur', companyRole: 'Développeur' },
        ],
      },
      {
        id: 3,
        name: 'Dashboard Analytics',
        color: '#8B5CF6',
        members: [
          { id: 2, name: 'Jean Martin', role: 'Lead Developer', companyRole: 'Développeur' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Marketing Pro',
    description: 'Agence de marketing digital',
    members: [
      {
        id: 4,
        name: 'Pierre Leroy',
        role: 'Chef Marketing',
        companyRole: 'Admin',
        tasksCompleted: 78,
        hoursWorked: 540,
        projectIds: [4, 5],
      },
      {
        id: 5,
        name: 'Claire Moreau',
        role: 'Content Manager',
        companyRole: 'Rédacteur',
        tasksCompleted: 145,
        hoursWorked: 980,
        projectIds: [4],
      },
      {
        id: 6,
        name: 'Lucas Petit',
        role: 'SEO Specialist',
        companyRole: 'SEO',
        tasksCompleted: 92,
        hoursWorked: 680,
        projectIds: [5],
      },
    ],
    projects: [
      {
        id: 4,
        name: 'Campagne Social Media',
        color: '#F59E0B',
        members: [
          { id: 4, name: 'Pierre Leroy', role: 'Chef de projet', companyRole: 'Admin' },
          { id: 5, name: 'Claire Moreau', role: 'Content', companyRole: 'Rédacteur' },
        ],
      },
      {
        id: 5,
        name: 'SEO Audit',
        color: '#EF4444',
        members: [
          { id: 4, name: 'Pierre Leroy', role: 'Chef de projet', companyRole: 'Admin' },
          { id: 6, name: 'Lucas Petit', role: 'SEO Expert', companyRole: 'SEO' },
        ],
      },
    ],
  },
])

const getTotalMembers = (company) => {
  return company.members.length
}

const getMemberProjects = (member, company) => {
  const memberProjects = company.projects.filter(p =>
    p.members.some(m => m.id === member.id)
  )
  return memberProjects.map(p => p.name).join(', ') || 'Aucun projet'
}

const addCompany = () => {
  if (newCompany.value.name) {
    companies.value.push({
      id: Date.now(),
      name: newCompany.value.name,
      description: newCompany.value.description,
      members: [],
      projects: [],
    })
    newCompany.value = { name: '', description: '' }
    showAddCompany.value = false
  }
}

const showProjectMembers = (project) => {
  selectedProject.value = project
  showProjectModal.value = true
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
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.btn-add {
  padding: 0.625rem 1.25rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-add:hover {
  background: #1f2937;
}

/* Companies List */
.companies-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.company-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.15s ease;
}

.company-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.company-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.375rem 0;
}

.company-info p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.company-stats {
  display: flex;
  gap: 0.5rem;
}

.stat-badge {
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Projects Section */
.projects-section {
  margin-bottom: 1.5rem;
}

.projects-section h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.75rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.project-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.project-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-details {
  flex: 1;
}

.project-details h5 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.125rem 0;
}

.project-details p {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
}

.btn-view-members {
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-view-members:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* Members Section */
.members-section h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.75rem 0;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.75rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.member-card:hover {
  background: white;
  border-color: #d1d5db;
}

.member-avatar {
  width: 40px;
  height: 40px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-info h5 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.125rem 0;
}

.member-role {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0 0 0.125rem 0;
}

.member-projects {
  font-size: 0.6875rem;
  color: #9CA3AF;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-stats {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1F2937;
}

.stat-label {
  font-size: 0.625rem;
  color: #6B7280;
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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 15 -3px rgba(0, 0, 0, 0.1);
}

.modal-content.large {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
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
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 0.875rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #374151;
  box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.05);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  padding: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
  padding: 0.625rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
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

/* Project Members List */
.project-members-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-member-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.project-member-item .member-avatar {
  width: 36px;
  height: 36px;
  font-size: 0.875rem;
}

.project-member-item .member-info h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.125rem 0;
}

.project-member-item .member-info p {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
}

.member-badge {
  padding: 0.25rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .company-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .projects-grid,
  .members-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>
