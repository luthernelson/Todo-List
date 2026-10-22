<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'
import { useActivityStore } from '@/stores/activityStore'
import router from '../../router'
import { RouterLink } from 'vue-router'
import LoadingButton from '@/components/ui/LoadingButton.vue'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const toastStore = useToastStore()
const activityStore = useActivityStore()
const passwordVisible = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const generateUsernameFromEmail = (email) => {
  const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  return username
}

const loginUser = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    toastStore.error('Veuillez remplir tous les champs')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await userStore.login(email.value, password.value)
    
    // Charger les activités mock
    activityStore.loadMockActivities()
    
    toastStore.success('Connexion réussie !')
    
    // Redirection vers le dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (error) {
    errorMessage.value = error.message || "Nom d'utilisateur ou mot de passe incorrect"
    toastStore.error(error.message || "Nom d'utilisateur ou mot de passe incorrect")
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- Conteneur principal -->
    <div
      class="flex flex-col md:flex-row bg-white w-full max-w-md sm:max-w-lg md:max-w-5xl p-6 md:p-8 shadow-2xl rounded-lg"
    >
      <!-- Section Formulaire -->
      <div class="w-full md:w-1/2 p-6">
        <form @submit.prevent="loginUser">
          <div class="mb-4 text-center text-2xl font-bold">
            <h2>LOGIN</h2>
          </div>
          <div class="flex justify-center items-center mb-4">
            <i class="fa-solid fa-circle-user text-5xl text-blue-500"></i>
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <div class="mb-4">
            <input
              type="text"
              v-model="email"
              placeholder="Email"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
          </div>
          <div class="mb-4 relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              placeholder="Password"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
            <!-- Icône pour afficher/cacher le mot de passe -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              @click="togglePasswordVisibility"
              v-if="passwordVisible"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>

            <svg
              @click="togglePasswordVisibility"
              xmlns="http://www.w3.org/2000/svg"
              v-else
              class="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.724 7.758 5 12 5s8.268 2.724 9.542 7c-1.274 4.276-5.3 7-9.542 7-4.242 0-8.268-2.724-9.542-7z"
              />
            </svg>
          </div>
          <div class="text-center">
            <LoadingButton
              type="submit"
              text="Connexion"
              loading-text="Connexion en cours..."
              :loading="loading"
              variant="primary"
              size="large"
              style="width: 100%"
            />
          </div>
          <div class="flex items-center justify-between pt-4">
            <p>Don't have an account?</p>
            <p class="text-blue-500 cursor-pointer hover:text-blue-700">
              <RouterLink to="/register">Register</RouterLink>
            </p>
          </div>
        </form>
      </div>

      <!-- Section Image uniquement pour grands écrans -->
      <div class="hidden md:block md:w-1/2">
        <img
          src="https://www.kiwili.com/wp-content/uploads/2023/07/Logiciel-gestion-de-taches-collaboratif.webp"
          alt="Background"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Suppression de l'image sur petits écrans */
@media (max-width: 768px) {
  .md\\:block {
    display: none !important;
  }
}
</style>
