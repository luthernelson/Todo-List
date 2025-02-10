<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import router from '../../router'
import { apiService } from '@/service/apiServices'

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordVisible = ref(false)
const userStore = useUserStore()

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas.')
    return
  }

  try {
    await apiService.addUser({
      email: email.value,
      username: username.value,
      password: password.value,
    })
    router.push('/login')
  } catch (error) {
    alert("Erreur lors de l'inscription.", error)
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
          <div class="mb-4 text-center text-3xl font-bold">
            <h2>INSCRIPTION</h2>
          </div>
          <div class="flex justify-center items-center mb-6">
            <i class="fa-solid fa-circle-user text-6xl text-blue-500"></i>
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
          <div class="mb-4">
            <input
              type="text"
              v-model="username"
              placeholder="Nom d'utilisateur"
              required
              class="border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
            />
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
            <button
              type="submit"
              class="w-full px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              S'inscrire
            </button>
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
