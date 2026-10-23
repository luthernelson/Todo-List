<template>
  <div class="communities-page">
    <div class="page-header">
      <div>
        <h1>Communautés</h1>
        <p>Créez et gérez les communautés de vos projets</p>
      </div>
      <button @click="showCreateModal = true" class="btn-create">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Créer une communauté
      </button>
    </div>

    <div v-if="isLoading" class="communities-table">
      <TableSkeleton :columns="6" :rows="5" />
    </div>

    <div v-else class="communities-table">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Projet associé</th>
            <th>Membres</th>
            <th>Messages</th>
            <th>Créée le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="community in communities" :key="community.id">
            <td>
              <div class="community-name">
                <div class="community-icon">{{ community.name.charAt(0).toUpperCase() }}</div>
                <span>{{ community.name }}</span>
              </div>
            </td>
            <td>
              <span class="project-badge">{{ community.projectName }}</span>
            </td>
            <td>
              <div class="members-list">
                <div class="member-avatars">
                  <div
                    v-for="(member, index) in community.members.slice(0, 4)"
                    :key="index"
                    class="avatar"
                    :title="member.name"
                  >
                    {{ member.name.charAt(0).toUpperCase() }}
                  </div>
                  <div v-if="community.members.length > 4" class="avatar more">
                    +{{ community.members.length - 4 }}
                  </div>
                </div>
                <span class="member-count">{{ community.members.length }} membres</span>
              </div>
            </td>
            <td>
              <span class="message-count">{{ community.messageCount }}</span>
            </td>
            <td>
              <span class="date">{{ formatDate(community.createdAt) }}</span>
            </td>
            <td>
              <div class="actions">
                <button @click="openCommunity(community)" class="action-btn" title="Ouvrir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </button>
                <button @click="editCommunity(community)" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="deleteCommunity(community.id)" class="action-btn delete" title="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de création de communauté -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Créer une communauté</h3>
          <button @click="showCreateModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom de la communauté</label>
            <input v-model="newCommunity.name" type="text" placeholder="Ex: Équipe Alpha" />
          </div>
          <div class="form-group">
            <label>Projet associé</label>
            <select v-model="newCommunity.projectId" @change="onProjectChange">
              <option value="">Sélectionner un projet</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div v-if="newCommunity.projectId" class="form-group">
            <label>Membres (automatiquement ajoutés depuis le projet)</label>
            <div class="members-preview">
              <div v-for="member in projectMembers" :key="member.id" class="member-preview">
                <div class="avatar">{{ member.name.charAt(0).toUpperCase() }}</div>
                <span>{{ member.name }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Description (optionnel)</label>
            <textarea v-model="newCommunity.description" rows="3" placeholder="Description de la communauté..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn-cancel">Annuler</button>
          <button @click="createCommunity" class="btn-confirm">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TableSkeleton from '@/components/ui/TableSkeleton.vue'

const router = useRouter()
const showCreateModal = ref(false)
const isLoading = ref(true)

const projects = ref([
  { id: 1, name: 'Projet Alpha' },
  { id: 2, name: 'Projet Beta' },
  { id: 3, name: 'Projet Gamma' },
  { id: 4, name: 'Projet Delta' },
])

const newCommunity = ref({
  name: '',
  projectId: '',
  description: '',
})

const communities = ref([
  {
    id: 1,
    name: 'Équipe Alpha',
    projectName: 'Projet Alpha',
    members: [
      { id: 1, name: 'Marie Dupont' },
      { id: 2, name: 'Jean Martin' },
      { id: 3, name: 'Sophie Bernard' },
      { id: 4, name: 'Pierre Leroy' },
      { id: 5, name: 'Claire Moreau' },
    ],
    messageCount: 147,
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    name: 'Équipe Beta',
    projectName: 'Projet Beta',
    members: [
      { id: 6, name: 'Lucas Petit' },
      { id: 7, name: 'Emma Roux' },
      { id: 8, name: 'Thomas Dubois' },
    ],
    messageCount: 89,
    createdAt: '2024-01-20T14:45:00',
  },
  {
    id: 3,
    name: 'Développeurs Gamma',
    projectName: 'Projet Gamma',
    members: [
      { id: 9, name: 'Hugo Michel' },
      { id: 10, name: 'Léa Garcia' },
      { id: 11, name: 'Adam Thomas' },
      { id: 12, name: 'Chloé Robert' },
    ],
    messageCount: 234,
    createdAt: '2024-02-01T09:15:00',
  },
])

const projectMembers = computed(() => {
  if (!newCommunity.value.projectId) return []
  const project = projects.value.find(p => p.id === newCommunity.value.projectId)
  if (!project) return []
  
  // Simuler les membres du projet
  const mockMembers = [
    { id: 100, name: 'Marie Dupont' },
    { id: 101, name: 'Jean Martin' },
    { id: 102, name: 'Sophie Bernard' },
    { id: 103, name: 'Pierre Leroy' },
  ]
  return mockMembers
})

const onProjectChange = () => {
  // Les membres sont automatiquement chargés via computed
}

const createCommunity = () => {
  if (newCommunity.value.name && newCommunity.value.projectId) {
    const project = projects.value.find(p => p.id === newCommunity.value.projectId)
    communities.value.push({
      id: Date.now(),
      name: newCommunity.value.name,
      projectName: project.name,
      members: [...projectMembers.value],
      messageCount: 0,
      createdAt: new Date().toISOString(),
    })
    newCommunity.value = { name: '', projectId: '', description: '' }
    showCreateModal.value = false
  }
}

const openCommunity = (community) => {
  router.push(`/community/${community.id}`)
}

const editCommunity = (community) => {
  console.log('Edit community:', community)
}

const deleteCommunity = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cette communauté ?')) {
    communities.value = communities.value.filter(c => c.id !== id)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<style scoped>
.communities-page {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6B7280;
  margin: 0;
  font-size: 0.9rem;
}

.btn-create {
  padding: 0.625rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-create:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.communities-table {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s ease;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #f9fafb;
}

td {
  padding: 0.875rem 1.25rem;
  vertical-align: middle;
  font-size: 0.875rem;
}

.community-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.community-icon {
  width: 36px;
  height: 36px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
}

.project-badge {
  padding: 0.25rem 0.625rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.member-avatars {
  display: flex;
  gap: -0.125rem;
}

.avatar {
  width: 28px;
  height: 28px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 500;
  border: 2px solid white;
}

.avatar.more {
  background: #f3f4f6;
  color: #9ca3af;
}

.member-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.message-count {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
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
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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
  color: #6b7280;
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
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  font-family: inherit;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #374151;
  box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.05);
}

.members-preview {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 180px;
  overflow-y: auto;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.member-preview {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.member-preview .avatar {
  width: 28px;
  height: 28px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 500;
}

.member-preview span {
  flex: 1;
  font-size: 0.8125rem;
  color: #374151;
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
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-confirm {
  background: #374151;
  color: white;
}

.btn-confirm:hover {
  background: #1f2937;
}

@media (max-width: 768px) {
  .communities-page {
    padding: 1rem;
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

  .communities-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>
