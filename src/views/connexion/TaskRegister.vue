<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'
import router from '../../router'
import { apiService } from '@/service/apiServices'
import LoadingButton from '@/components/ui/LoadingButton.vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordVisible = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const userStore = useUserStore()
const toastStore = useToastStore()

const suggestedUsername = computed(() => {
  if (!email.value) return ''
  return email.value.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
})

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  if (!suggestedUsername.value) {
    errorMessage.value = 'Email invalide'
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
        username: suggestedUsername.value,
        email: email.value,
        password: password.value,
        role: 'user',
        isFirstLogin: true,
        token: 'demo-token-' + suggestedUsername.value + '-' + Date.now(),
      }
      
      // Ajouter au localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers))
      
      toastStore.success('Inscription réussie ! Connectez-vous maintenant.')
      router.push('/login')
    } else {
      // Mode avec backend
      await apiService.addUser({
        email: email.value,
        username: suggestedUsername.value,
        password: password.value,
      })
      router.push('/login')
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'inscription."
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Masquer la barre de navigation
onMounted(() => {
  const navbar = document.querySelector('.navbar')
  if (navbar) navbar.style.display = 'none'
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="flex flex-col md:flex-row bg-white w-full max-w-md sm:max-w-lg md:max-w-5xl p-6 md:p-8 shadow-2xl rounded-lg"
    >
      <!-- Section Formulaire -->
      <div class="w-full md:w-1/2 p-6">
        <form @submit.prevent="registerUser">
          <div class="mb-4 text-center text-2xl font-bold">
            <h2>INSCRIPTION</h2>
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
              type="email"
              v-model="email"
              placeholder="Email"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
          </div>
          <div v-if="suggestedUsername" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Nom d'utilisateur suggéré:</strong> {{ suggestedUsername }}
            </p>
            <p class="text-xs text-blue-600 mt-1">Vous pourrez le modifier dans vos paramètres</p>
          </div>
          <div class="mb-4 relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              placeholder="Mot de passe"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
          </div>
          <div class="mb-4 relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirmez le mot de passe"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
          </div>
          <div class="mb-4 flex items-center">
            <input
              type="checkbox"
              id="toggle-password"
              @click="togglePasswordVisibility"
              class="mr-2"
            />
            <label for="toggle-password" class="text-sm">Afficher les mots de passe</label>
          </div>
          <div class="text-center">
            <LoadingButton
              type="submit"
              text="S'inscrire"
              loading-text="Inscription en cours..."
              :loading="loading"
              variant="primary"
              size="large"
              style="width: 100%"
            />
          </div>
          <div class="flex items-center justify-between pt-4">
            <p>Déjà un compte ?</p>
            <p
              class="text-blue-500 cursor-pointer hover:text-blue-700"
              @click="router.push('/login')"
            >
              Connexion
            </p>
          </div>
        </form>
      </div>

      <!-- Section Image uniquement pour grands écrans -->
      <div class="hidden md:block md:w-1/2">
        <img
          src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg?t=st=1738948261~exp=1738951861~hmac=34699d2ec8dc5d51634bdb33a865cce9f2324eecd4bb469c1059bb7ff5bd9dfe&w=740"
          alt="Illustration Inscription"
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
