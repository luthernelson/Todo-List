<template>
  <div>
    <!-- Barre de navigation principale -->
    <nav class="bg-blue-500 py-4 shadow-lg flex items-center justify-between px-4">
      <div>
        <img
          src="../assets/images/logoApp4.png"
          alt="logoApp"
          class="h-12 border-none color-white"
        />
      </div>

      <!-- Menu horizontal pour moyens et grands écrans -->
      <ul class="hidden md:flex space-x-6 items-center justify-center flex-1">
        <RouterLink
          to="/"
          class="text-white hover:text-blue-200 transition-colors duration-300"
          :class="{ 'text-blue-200 font-bold': activeLink === '/' }"
          @click="setActiveLink('/')"
        >
          Accueil
        </RouterLink>
        <RouterLink
          to="/community"
          class="text-white hover:text-blue-200 transition-colors duration-300"
          :class="{ 'text-blue-200 font-bold': activeLink === '/community' }"
          @click="setActiveLink('/community')"
        >
          Communauté
        </RouterLink>
      </ul>

      <!-- Bouton hamburger pour petits écrans -->
      <button
        class="text-white text-2xl focus:outline-none md:hidden"
        @click="isMenuOpen = !isMenuOpen"
      >
        <i :class="isMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
      </button>

      <!-- Icône utilisateur et bouton de déconnexion -->
      <div class="flex items-center space-x-6">
        <!-- Bouton de déconnexion -->
        <RouterLink to="/login">
          <button
            class="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"
            @click="userStore.logout()"
          >
            Déconnexion
          </button>
        </RouterLink>

        <!-- Icône utilisateur avec nom -->
        <div class="flex flex-col items-center">
          <button class="px-4 py-2 rounded-full">
            <i class="fa-solid fa-circle-user text-4xl text-white"></i>
          </button>
          <h6 class="text-white mt-0 text-sm">
            {{ userStore.username ? userStore.username : 'Utilisateur' }}
          </h6>
        </div>
      </div>
    </nav>

    <!-- Menu déroulant vertical pour petits écrans -->
    <div
      v-if="isMenuOpen"
      class="absolute bg-blue-500 bg-opacity-90 text-white w-48 mt-[0px] h-full shadow-md"
    >
      <ul class="space-y-0 text-center">
        <RouterLink to="/" class="text-white hover:text-blue-200 transition-colors duration-300">
          Accueil
        </RouterLink>
        <li>
          <a href="#" class="block py-2 hover:bg-blue-700 transition-colors duration-300">
            A Propos
          </a>
        </li>
        <li>
          <RouterLink
            to="/community"
            class="text-white hover:text-blue-200 transition-colors duration-300"
          >
            Communauté
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

// Accès au store utilisateur
const userStore = useUserStore()
const isMenuOpen = ref(false) // État pour afficher/masquer le menu vertical
const activeLink = ref('/')
function setActiveLink(link) {
  activeLink.value = link // Met à jour le lien actif
}
</script>

<style scoped>
/* Ajout de styles si nécessaire */
</style>
