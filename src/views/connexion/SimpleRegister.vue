<template>
  <div class="auth-container">
    <!-- Partie Gauche: Formulaire d'inscription -->
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
          <h1 class="app-name">Workstream</h1>
          <p class="tagline">Créez votre compte pour commencer</p>
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

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="errorMessage" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="username"
                v-model="registerForm.username"
                type="text"
                placeholder="votre_username"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                v-model="registerForm.email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
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

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
              />
              <button @click="showConfirmPassword = !showConfirmPassword" class="toggle-password" type="button">
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              <input v-model="registerForm.acceptTerms" type="checkbox" required />
              <span class="checkbox-custom"></span>
              <span>J'accepte les conditions d'utilisation</span>
            </label>
          </div>

          <LoadingButton
            type="submit"
            text="Créer mon compte"
            :loading-text="'Création en cours...'"
            :loading="loading"
            variant="primary"
            size="large"
            style="width: 100%"
          />
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p>Déjà un compte ? <a @click="goToLogin" class="link">Se connecter</a></p>
        </div>
      </div>
    </div>

    <!-- Partie Droite: Présentation de l'application -->
    <div class="auth-presentation-section">
      <div class="presentation-content">
        <div class="brand-section">
          <h2>Rejoignez Workstream</h2>
          <p class="brand-description">
            Organisez vos projets, collaborez avec votre équipe et atteignez vos objectifs plus efficacement.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <h3>Organisation</h3>
            <p>Gérez vos tâches et projets facilement</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Collaboration</h3>
            <p>Travaillez en équipe en temps réel</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3>Analyse</h3>
            <p>Suivez votre progression</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Sécurité</h3>
            <p>Vos données sont protégées</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
import LoadingButton from '@/components/ui/LoadingButton.vue'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const { locale } = useI18n()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    toastStore.error('Les mots de passe ne correspondent pas')
    return
  }

  if (!registerForm.value.acceptTerms) {
    errorMessage.value = 'Vous devez accepter les conditions d\'utilisation'
    toastStore.error('Vous devez accepter les conditions d\'utilisation')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Mode mock - création directe
    if (userStore.useMockMode) {
      const newUser = {
        id: Date.now(),
        idUser: Date.now(),
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password,
        role: 'user',
        isFirstLogin: true,
        token: 'demo-token-' + registerForm.value.username + '-' + Date.now(),
      }

      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers))

      toastStore.success('Compte créé avec succès ! Connectez-vous maintenant.')
      router.push('/login')
    } else {
      // Mode avec backend
      await userStore.register({
        email: registerForm.value.email,
        username: registerForm.value.username,
        password: registerForm.value.password,
      })
      router.push('/login')
    }
  } catch (error) {
    errorMessage.value = error.message || "Erreur lors de l'inscription"
    toastStore.error(error.message || "Erreur lors de l'inscription")
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
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
  font-size: 0.9rem;
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
  padding: 0.4rem 0.8rem;
  border: 2px solid #E5E7EB;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
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
  gap: 1.25rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #FEF2F2;
  border: 2px solid #FECACA;
  border-radius: 10px;
  color: #991B1B;
  font-size: 0.85rem;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  min-height: 42px;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 3px rgba(41, 56, 72, 0.1);
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
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
  font-size: 0.75rem;
  font-weight: bold;
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

/* ===== PARTIE DROITE: PRÉSENTATION ===== */
.auth-presentation-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: linear-gradient(135deg, #293848 0%, #1E3A5F 100%);
}

.presentation-content {
  width: 100%;
  max-width: 540px;
}

.brand-section {
  margin-bottom: 3rem;
}

.brand-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.brand-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.5;
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

  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .logo-icon {
    width: 50px;
    height: 50px;
  }

  .app-name {
    font-size: 1.25rem;
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

  .auth-footer p {
    font-size: 0.8rem;
  }
}
</style>
