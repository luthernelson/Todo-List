<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import router from '../../router'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const passwordVisible = ref(false)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const loginUser = async () => {
  try {
    await userStore.login(email.value, password.value) // Appel à la méthode de connexion du store
    router.push('/') // Redirection vers la page d'accueil après connexion
  } catch (error) {
    alert("Nom d'utilisateur ou mot de passe incorrect!", error)
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
          <div class="mb-4 text-center text-3xl font-bold">
            <h2>LOGIN</h2>
          </div>
          <div class="flex justify-center items-center mb-6">
            <i class="fa-solid fa-circle-user text-6xl text-blue-500"></i>
          </div>
          <div class="mb-4">
            <input
              type="text"
              v-model="email"
              placeholder="Username"
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
              @click="togglePasswordVisibility"
              class="h-6 w-6 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12c0 3-3 5-6 5s-6-2-6-5 3-5 6-5 6 2 6 5z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 12c0 2-2 4-4 4s-4-2-4-4 2-4 4-4 4 2 4 4z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
              ></path>
            </svg>
          </div>
          <div class="text-center">
            <button
              type="submit"
              class="w-full px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Connexion
            </button>
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
