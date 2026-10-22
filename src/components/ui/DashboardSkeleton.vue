<template>
  <div class="dashboard-skeleton">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="i in 4" :key="i" class="stat-skeleton">
        <div class="skeleton-icon"></div>
        <div class="skeleton-content">
          <div class="skeleton-value"></div>
          <div class="skeleton-label"></div>
        </div>
      </div>
    </div>

    <!-- Projects Section -->
    <div class="projects-section">
      <div class="skeleton-header"></div>
      <div class="projects-grid">
        <div v-for="i in 3" :key="i" class="project-skeleton">
          <div class="skeleton-project-icon"></div>
          <div class="skeleton-project-content">
            <div class="skeleton-project-title"></div>
            <div class="skeleton-project-desc"></div>
            <div class="skeleton-project-meta"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="activity-section">
      <div class="skeleton-header"></div>
      <div class="activity-list">
        <div v-for="i in 5" :key="i" class="activity-skeleton">
          <div class="skeleton-activity-icon"></div>
          <div class="skeleton-activity-content">
            <div class="skeleton-activity-user"></div>
            <div class="skeleton-activity-action"></div>
            <div class="skeleton-activity-time"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-skeleton {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-skeleton {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-value {
  height: 28px;
  width: 50%;
  border-radius: 0.25rem;
}

.skeleton-label {
  height: 16px;
  width: 60%;
  border-radius: 0.25rem;
}

.projects-section,
.activity-section {
  margin-bottom: 2rem;
}

.skeleton-header {
  height: 32px;
  width: 200px;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.project-skeleton {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-project-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  flex-shrink: 0;
}

.skeleton-project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-project-title {
  height: 24px;
  width: 70%;
  border-radius: 0.25rem;
}

.skeleton-project-desc {
  height: 16px;
  width: 90%;
  border-radius: 0.25rem;
}

.skeleton-project-meta {
  height: 14px;
  width: 50%;
  border-radius: 0.25rem;
}

.activity-list {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.skeleton-activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.skeleton-activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-activity-user {
  height: 16px;
  width: 30%;
  border-radius: 0.25rem;
}

.skeleton-activity-action {
  height: 16px;
  width: 70%;
  border-radius: 0.25rem;
}

.skeleton-activity-time {
  height: 14px;
  width: 25%;
  border-radius: 0.25rem;
}

.skeleton-icon,
.skeleton-value,
.skeleton-label,
.skeleton-header,
.skeleton-project-icon,
.skeleton-project-title,
.skeleton-project-desc,
.skeleton-project-meta,
.skeleton-activity-icon,
.skeleton-activity-user,
.skeleton-activity-action,
.skeleton-activity-time {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
