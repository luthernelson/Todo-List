<template>
  <div class="auth-container">
    <!-- Partie Gauche: Formulaire de connexion -->
    <div class="auth-form-section">
      <div class="auth-form-wrapper">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 class="app-name">{{ $t('auth.appName') }}</h1>
          <p class="tagline">{{ $t('auth.tagline') }}</p>
        </div>

        <!-- Sélecteur de langue -->
        <div class="language-selector">
          <button
            @click="changeLanguage('fr')"
            :class="['lang-btn', { active: $i18n.locale === 'fr' }]"
          >
            🇫🇷 FR
          </button>
          <button
            @click="changeLanguage('en')"
            :class="['lang-btn', { active: $i18n.locale === 'en' }]"
          >
            🇬🇧 EN
          </button>
        </div>



        <!-- Login Form -->
        <form v-if="!showTwoFactor" @submit.prevent="handleLogin" class="auth-form">
          <!-- Titre de la page de connexion -->
          <div class="form-title">
            <h2>{{ $t('auth.loginTitle') || 'Connexion' }}</h2>
          </div>

          <div v-if="errorMessage" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="email">{{ $t('auth.email') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                placeholder="votre@email.com"
                required
                @keydown.enter="handleLogin"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">{{ $t('auth.password') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                @keydown.enter="handleLogin"
              />
              <button @click="showPassword = !showPassword" class="toggle-password" type="button">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8 8-11 8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a15.55 15.55 0 0 1 4.28-9.47M15 11l5-5m-5 5l-5-5"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="loginForm.remember" type="checkbox" />
              <span class="checkbox-custom"></span>
              <span>{{ $t('auth.rememberMe') }}</span>
            </label>
            <a href="#" class="forgot-password">{{ $t('auth.forgotPassword') }}</a>
          </div>

          <LoadingButton
            type="submit"
            :text="$t('auth.loginButton')"
            :loading-text="$t('auth.loginInProgress')"
            :loading="loading"
            variant="primary"
            size="large"
            style="width: 100%"
          />
        </form>

        <!-- Two Factor Verification -->
        <div v-if="showTwoFactor" class="two-factor-section">
          <TwoFactorVerify @verified="handleTwoFactorVerified" @backupCode="handleBackupCode" />
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p>Vous n'avez pas de compte ? <a @click="goToRegister" class="link">Créer un compte</a></p>
        </div>
      </div>
    </div>

    <!-- Partie Droite: Présentation narrative -->
    <div class="auth-presentation-section">
      <div class="presentation-content">
        <!-- Scène 1: Personne surchargée -->
        <div class="problem-scene" :class="{ active: currentScene === 1 }">
          <div class="scene-illustration">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <!-- Person stressée -->
              <circle cx="100" cy="60" r="30" fill="#CBD5E1"/>
              <rect x="70" y="95" width="60" height="70" rx="10" fill="#94A3B8"/>
              <!-- Documents volants -->
              <rect x="40" y="40" width="30" height="40" fill="#F59E0B" transform="rotate(-15 55 60)"/>
              <rect x="130" y="50" width="30" height="40" fill="#EF4444" transform="rotate(15 145 70)"/>
              <rect x="35" y="120" width="30" height="40" fill="#8B5CF6" transform="rotate(-10 50 140)"/>
              <rect x="135" y="110" width="30" height="40" fill="#10B981" transform="rotate(10 150 130)"/>
              <!-- Points d'interrogation -->
              <text x="30" y="30" font-size="24" fill="#EF4444">?</text>
              <text x="160" y="35" font-size="24" fill="#EF4444">?</text>
            </svg>
          </div>
          <h2 class="scene-title">Submergé par vos projets ?</h2>
          <p class="scene-description">
            Trop de tâches, pas assez de temps, et des échéances qui s'accumulent...
            Vous ne savez plus par où commencer pour vous en sortir.
          </p>
        </div>

        <!-- Scène 2: La solution Workstream -->
        <div class="solution-scene" :class="{ active: currentScene === 2 }">
          <div class="scene-illustration">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <!-- Interface organisée -->
              <rect x="20" y="30" width="160" height="140" rx="10" fill="#293848"/>
              <!-- Sidebar -->
              <rect x="20" y="30" width="40" height="140" rx="10" fill="#1E3A5F"/>
              <!-- Barre de progression -->
              <rect x="75" y="50" width="90" height="12" rx="6" fill="#374151"/>
              <rect x="75" y="50" width="60" height="12" rx="6" fill="#10B981"/>
              <!-- Tâches organisées -->
              <rect x="75" y="75" width="90" height="20" rx="4" fill="#475569"/>
              <rect x="75" y="105" width="90" height="20" rx="4" fill="#475569"/>
              <rect x="75" y="135" width="90" height="20" rx="4" fill="#475569"/>
              <!-- Checkmarks -->
              <circle cx="145" cy="85" r="6" fill="#10B981"/>
              <circle cx="145" cy="115" r="6" fill="#10B981"/>
              <circle cx="145" cy="145" r="6" fill="#6B7280"/>
            </svg>
          </div>
          <h2 class="scene-title">Workstream s'occupe de tout</h2>
          <p class="scene-description">
            Une interface intuitive pour organiser vos projets, collaborer avec votre équipe,
            et suivre votre progression en temps réel.
          </p>
          <div class="solution-features">
            <div class="solution-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Organisation automatique</span>
            </div>
            <div class="solution-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Collaboration en temps réel</span>
            </div>
            <div class="solution-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Rapports détaillés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTwoFactorStore } from '@/stores/twoFactorStore'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
import TwoFactorVerify from '@/components/twoFactor/TwoFactorVerify.vue'
import LoadingButton from '@/components/ui/LoadingButton.vue'

const router = useRouter()
const userStore = useUserStore()
const twoFactorStore = useTwoFactorStore()
const toastStore = useToastStore()
const { locale } = useI18n()

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const showTwoFactor = ref(false)
const currentScene = ref(1)
let autoSwitchInterval = null

const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    toastStore.error('Veuillez remplir tous les champs')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await userStore.login(loginForm.value.email, loginForm.value.password)

    // En mode mock, désactiver le 2FA pour simplifier les tests
    if (userStore.useMockMode) {
      // Vérifier si c'est la première connexion
      if (result.user.isFirstLogin) {
        toastStore.success('Bienvenue sur Workstream !')
        setTimeout(() => {
          router.push('/onboarding')
        }, 500)
      } else {
        toastStore.success('Connexion réussie ! Redirection vers le dashboard...')
        setTimeout(() => {
          router.push(result.lastRoute || '/')
        }, 500)
      }
    } else {
      // Vérifier si le 2FA est activé pour cet utilisateur
      if (twoFactorStore.isTwoFactorEnabled) {
        showTwoFactor.value = true
        loading.value = false
      } else {
        // Vérifier si c'est la première connexion
        if (result.user.isFirstLogin) {
          toastStore.success('Bienvenue sur Workstream !')
          router.push('/onboarding')
        } else {
          toastStore.success('Connexion réussie ! Redirection vers le dashboard...')
          router.push(result.lastRoute || '/')
        }
      }
    }
  } catch (error) {
    errorMessage.value = error.message || 'Erreur de connexion'
    toastStore.error(error.message || 'Erreur de connexion')
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}

const handleTwoFactorVerified = () => {
  toastStore.success('Connexion réussie ! Redirection vers le dashboard...')
  router.push('/')
}

const handleBackupCode = () => {
  // Implémenter la vérification par code de récupération
  alert('Fonctionnalité de code de récupération à implémenter')
}

const goToRegister = () => {
  router.push('/register')
}

const nextScene = () => {
  currentScene.value = 2
  // Arrêter l'auto-switch si l'utilisateur clique manuellement
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval)
    autoSwitchInterval = null
  }
}

const previousScene = () => {
  currentScene.value = 1
  // Arrêter l'auto-switch si l'utilisateur clique manuellement
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval)
    autoSwitchInterval = null
  }
}

// Auto-switch après 5 secondes
onMounted(() => {
  autoSwitchInterval = setInterval(() => {
    if (currentScene.value === 1) {
      currentScene.value = 2
    } else {
      currentScene.value = 1
    }
  }, 5000)
})

onUnmounted(() => {
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval)
  }
})
</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* ===== PARTIE GAUCHE: FORMULAIRE ===== */
.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 420px;
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.app-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #293848;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.tagline {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
}

/* Sélecteur de langue */
.language-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #E5E7EB;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: #293848;
  color: #293848;
}

.lang-btn.active {
  background: #293848;
  border-color: transparent;
  color: white;
}

/* Formulaire */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1rem;
}

.form-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

.two-factor-section {
  width: 100%;
  margin-top: 1rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #FEF2F2;
  border: 2px solid #FECACA;
  border-radius: 12px;
  color: #991B1B;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  color: #9CA3AF;
  pointer-events: none;
  width: 18px;
  height: 18px;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 3rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  min-height: 42px;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper input::placeholder {
  color: #9CA3AF;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #374151;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748B;
  cursor: pointer;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #D1D5DB;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #293848;
  border-color: transparent;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.forgot-password {
  font-size: 0.85rem;
  color: #293848;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #1E40AF;
  text-decoration: underline;
}

.submit-btn {
  padding: 1rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Footer */
.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1rem;
  border-top: 2px solid #E5E7EB;
}

.auth-footer p {
  color: #64748B;
  font-size: 0.85rem;
  margin: 0;
}

.auth-footer .link {
  color: #293848;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.auth-footer .link:hover {
  text-decoration: underline;
}

/* ===== PARTIE DROITE: PRÉSENTATION NARRATIVE ===== */
.auth-presentation-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #293848 0%, #1E3A5F 100%);
  position: relative;
  overflow: hidden;
}

.presentation-content {
  width: 100%;
  max-width: 400px;
  position: relative;
  text-align: center;
}

/* Scènes */
.problem-scene,
.solution-scene {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
  pointer-events: none;
}

.problem-scene.active,
.solution-scene.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: all;
}

.scene-illustration {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.scene-illustration svg {
  max-width: 100%;
  height: auto;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.scene-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.3;
  text-align: center;
}

.scene-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  text-align: center;
}

.btn-next,
.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-next:hover,
.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-back {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: none;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Solution Features */
.solution-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.solution-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.85rem;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-form-section {
    padding: 2rem;
  }

  .auth-presentation-section {
    padding: 3rem 2rem;
    min-height: 400px;
  }

  .scene-title {
    font-size: 1.5rem;
  }

  .scene-description {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .logo-icon {
    width: 60px;
    height: 60px;
  }

  .app-name {
    font-size: 1.75rem;
  }

  .brand-section h2 {
    font-size: 1.75rem;
  }

  /* Cacher la partie de présentation sur mobile */
  .auth-presentation-section {
    display: none;
  }

  .auth-form-section {
    padding: 1.5rem;
  }

  .auth-form-wrapper {
    max-width: 100%;
  }

  .logo-section {
    margin-bottom: 1.5rem;
  }

  .language-selector {
    margin-bottom: 1rem;
  }

  .lang-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .form-group label {
    font-size: 0.8rem;
  }

  .input-wrapper input {
    font-size: 0.9rem;
    padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  }

  .checkbox-label {
    font-size: 0.8rem;
  }

  .forgot-password {
    font-size: 0.8rem;
  }

  .auth-footer p {
    font-size: 0.8rem;
  }
}
</style>