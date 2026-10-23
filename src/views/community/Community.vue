<template>
  <div class="communities-list-page">
    <div class="page-header">
      <h1>Mes Communautés</h1>
      <p>Communautés auxquelles vous appartenez</p>
    </div>

    <div v-if="loading" class="skeleton-loader">
      <div class="skeleton-card" v-for="i in 6" :key="i"></div>
    </div>

    <div v-else class="communities-grid">
      <div
        v-for="community in communities"
        :key="community.id"
        class="community-card"
        @click="openCommunity(community)"
      >
        <div class="community-header">
          <div class="community-icon">{{ community.name.charAt(0).toUpperCase() }}</div>
          <div class="community-info">
            <h3>{{ community.name }}</h3>
            <p>{{ community.description }}</p>
          </div>
        </div>
        <div class="community-stats">
          <div class="stat">
            <span class="stat-value">{{ community.members.length }}</span>
            <span class="stat-label">Membres</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ community.messageCount }}</span>
            <span class="stat-label">Messages</span>
          </div>
        </div>
        <div class="community-members">
          <div
            v-for="(member, index) in community.members.slice(0, 4)"
            :key="index"
            class="member-avatar"
            :title="member.name"
          >
            {{ member.name.charAt(0).toUpperCase() }}
          </div>
          <div v-if="community.members.length > 4" class="member-avatar more">
            +{{ community.members.length - 4 }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && communities.length === 0" class="empty-state">
      <p>Vous n'appartenez à aucune communauté</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)

const communities = ref([
  {
    id: 1,
    name: 'Équipe Alpha',
    description: 'Équipe de développement du projet Alpha',
    members: [
      { id: 1, name: 'Marie Dupont' },
      { id: 2, name: 'Jean Martin' },
      { id: 3, name: 'Sophie Bernard' },
      { id: 4, name: 'Pierre Leroy' },
      { id: 5, name: 'Claire Moreau' },
    ],
    messageCount: 147,
  },
  {
    id: 2,
    name: 'Équipe Beta',
    description: 'Équipe marketing et communication',
    members: [
      { id: 6, name: 'Lucas Petit' },
      { id: 7, name: 'Emma Roux' },
      { id: 8, name: 'Thomas Dubois' },
    ],
    messageCount: 89,
  },
  {
    id: 3,
    name: 'Développeurs Gamma',
    description: 'Équipe technique backend',
    members: [
      { id: 9, name: 'Hugo Michel' },
      { id: 10, name: 'Léa Garcia' },
      { id: 11, name: 'Adam Thomas' },
      { id: 12, name: 'Chloé Robert' },
    ],
    messageCount: 234,
  },
])

const openCommunity = (community) => {
  router.push(`/community/${community.id}`)
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<style scoped>
.communities-list-page {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6B7280;
  font-size: 0.875rem;
  margin: 0;
}

.skeleton-loader {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
}

.skeleton-card {
  height: 180px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.community-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.community-card:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.community-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.community-icon {
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 500;
}

.community-info {
  flex: 1;
}

.community-info h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.community-info p {
  font-size: 0.8125rem;
  color: #6B7280;
  margin: 0;
}

.community-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
}

.community-members {
  display: flex;
  gap: -0.125rem;
}

.member-avatar {
  width: 32px;
  height: 32px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  border: 2px solid white;
}

.member-avatar.more {
  background: #f3f4f6;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6B7280;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .communities-list-page {
    padding: 1rem;
  }

  .skeleton-loader {
    grid-template-columns: repeat(2, 1fr);
  }

  .communities-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .skeleton-loader {
    grid-template-columns: 1fr;
  }
}
</style>
