<template>
  <div class="entreprises-page">
    <div class="page-header">
      <h1>Mes Entreprises</h1>
      <button @click="showAddCompany = true" class="btn-create">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouvelle entreprise
      </button>
    </div>

    <div class="companies-grid">
      <div v-for="company in companies" :key="company.id" class="company-card">
        <div class="company-header">
          <div class="company-icon">{{ company.name.charAt(0).toUpperCase() }}</div>
          <div class="company-info">
            <h3>{{ company.name }}</h3>
            <p>{{ company.description }}</p>
          </div>
          <div class="company-actions">
            <button @click="editCompany(company)" class="action-btn" title="Modifier">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button @click="deleteCompany(company.id)" class="action-btn delete" title="Supprimer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="company-stats">
          <div class="stat">
            <span class="stat-value">{{ company.projects.length }}</span>
            <span class="stat-label">Projets</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ getTotalMembers(company) }}</span>
            <span class="stat-label">Membres</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ getTotalBudget(company).toLocaleString() }}€</span>
            <span class="stat-label">Budget</span>
          </div>
        </div>

        <div class="projects-section">
          <h4>Projets</h4>
          <div class="projects-list">
            <div
              v-for="project in company.projects"
              :key="project.id"
              class="project-item"
              @click="goToProject(project)"
            >
              <div class="project-dot" :style="{ background: project.color }"></div>
              <div class="project-details">
                <h5>{{ project.name }}</h5>
                <p>{{ project.members.length }} membres</p>
              </div>
              <div class="project-budget">{{ project.budget.toLocaleString() }}€</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout/Modification Entreprise -->
    <div v-if="showAddCompany" class="modal-overlay" @click="showAddCompany = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCompany ? 'Modifier' : 'Ajouter' }} une entreprise</h3>
          <button @click="closeModal" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input v-model="companyForm.name" type="text" placeholder="Ex: TechCorp Inc." />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="companyForm.description" placeholder="Description de l'entreprise..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Secteur d'activité</label>
            <select v-model="companyForm.sector">
              <option value="tech">Technologie</option>
              <option value="marketing">Marketing</option>
              <option value="consulting">Consulting</option>
              <option value="finance">Finance</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">Annuler</button>
          <button @click="saveCompany" class="btn-confirm">{{ editingCompany ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showAddCompany = ref(false)
const editingCompany = ref(null)

const companyForm = ref({
  name: '',
  description: '',
  sector: 'tech',
})

const companies = ref([
  {
    id: 1,
    name: 'TechCorp Solutions',
    description: 'Entreprise spécialisée dans le développement logiciel et les solutions digitales',
    sector: 'tech',
    projects: [
      {
        id: 1,
        name: 'Refonte E-commerce',
        color: '#10B981',
        budget: 25000,
        members: [
          { id: 1, name: 'Marie Dupont', role: 'Chef de projet' },
          { id: 2, name: 'Jean Martin', role: 'Développeur' },
          { id: 3, name: 'Sophie Bernard', role: 'Designer' },
        ],
      },
      {
        id: 2,
        name: 'Application Mobile',
        color: '#293848',
        budget: 35000,
        members: [
          { id: 1, name: 'Marie Dupont', role: 'Chef de projet' },
          { id: 2, name: 'Jean Martin', role: 'Développeur' },
        ],
      },
      {
        id: 3,
        name: 'Dashboard Analytics',
        color: '#8B5CF6',
        budget: 15000,
        members: [
          { id: 2, name: 'Jean Martin', role: 'Lead Developer' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Marketing Pro',
    description: 'Agence de marketing digital et communication',
    sector: 'marketing',
    projects: [
      {
        id: 4,
        name: 'Campagne Social Media',
        color: '#F59E0B',
        budget: 8000,
        members: [
          { id: 4, name: 'Pierre Leroy', role: 'Chef de projet' },
          { id: 5, name: 'Claire Moreau', role: 'Content Manager' },
        ],
      },
      {
        id: 5,
        name: 'SEO Audit',
        color: '#EF4444',
        budget: 5000,
        members: [
          { id: 4, name: 'Pierre Leroy', role: 'Chef de projet' },
          { id: 6, name: 'Lucas Petit', role: 'SEO Specialist' },
        ],
      },
    ],
  },
])

const getTotalMembers = (company) => {
  const allMemberIds = new Set()
  company.projects.forEach(project => {
    project.members.forEach(member => allMemberIds.add(member.id))
  })
  return allMemberIds.size
}

const getTotalBudget = (company) => {
  return company.projects.reduce((sum, project) => sum + project.budget, 0)
}

const editCompany = (company) => {
  editingCompany.value = company
  companyForm.value = {
    name: company.name,
    description: company.description,
    sector: company.sector,
  }
  showAddCompany.value = true
}

const deleteCompany = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cette entreprise et tous ses projets ?')) {
    companies.value = companies.value.filter(c => c.id !== id)
  }
}

const closeModal = () => {
  showAddCompany.value = false
  editingCompany.value = null
  companyForm.value = { name: '', description: '', sector: 'tech' }
}

const saveCompany = () => {
  if (companyForm.value.name) {
    if (editingCompany.value) {
      // Modification
      const index = companies.value.findIndex(c => c.id === editingCompany.value.id)
      if (index !== -1) {
        companies.value[index] = {
          ...companies.value[index],
          ...companyForm.value,
        }
      }
    } else {
      // Création
      companies.value.push({
        id: Date.now(),
        ...companyForm.value,
        projects: [],
      })
    }
    closeModal()
  }
}

const goToProject = (project) => {
  router.push(`/projects/${project.id}`)
}
</script>

<style scoped>
.entreprises-page {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.btn-create {
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

.btn-create:hover {
  background: #1f2937;
  transform: translateY(-2px);
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 0 1.5rem;
}

.company-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.company-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.company-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.company-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #293848 0%, #10B981 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.company-info {
  flex: 1;
}

.company-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.375rem 0;
}

.company-info p {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.company-actions {
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

.company-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
  font-weight: 500;
}

.projects-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 1rem 0;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
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

.project-budget {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #059669;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
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
  .companies-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .company-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
