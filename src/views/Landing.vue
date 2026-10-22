<template>
  <div class="landing-container">
    <div class="landing-content">
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="80" height="80" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" fill="url(#gradient1)"/>
            <path d="M18 30L26 38L42 22" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#293848"/>
                <stop offset="100%" style="stop-color:#10B981"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="app-name">Workstream</h1>
      </div>

      <h2 class="welcome-title">Bienvenue sur Workstream</h2>

      <div class="action-buttons">
        <button @click="goToRegister" class="btn-primary">
          Créer un compte
        </button>
        <button @click="goToLogin" class="btn-secondary">
          Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}

const goToLogin = () => {
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.landing-content {
  max-width: 500px;
  text-align: center;
  color: white;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.app-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .app-name {
    font-size: 2rem;
  }

  .welcome-title {
    font-size: 1.25rem;
  }
}
</style>
