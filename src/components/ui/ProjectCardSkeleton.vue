<template>
  <div class="project-card-skeleton">
    <div class="skeleton-icon"></div>
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-description"></div>
      <div class="skeleton-meta">
        <div class="skeleton-meta-item"></div>
        <div class="skeleton-meta-item"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card-skeleton {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  border-radius: 0.25rem;
}

.skeleton-description {
  height: 16px;
  width: 80%;
  border-radius: 0.25rem;
}

.skeleton-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.skeleton-meta-item {
  height: 14px;
  width: 80px;
  border-radius: 0.25rem;
}

.skeleton-icon,
.skeleton-title,
.skeleton-description,
.skeleton-meta-item {
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
</style>
