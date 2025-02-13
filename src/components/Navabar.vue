<template>
  <nav class="bg-blue-500 py-4 shadow-lg flex items-center justify-between px-4">
    <!-- Logo -->
    <div class="flex items-center">
      <img src="../assets/images/logoApp4.png" alt="logoApp" class="h-12 border-none" />
    </div>

    <!-- Menu principal (desktop) -->
    <ul class="hidden md:flex space-x-6">
      <RouterLink
        to="/"
        class="text-white hover:text-blue-200 transition duration-300"
        :class="{ 'text-blue-200 font-bold': activeLink === '/' }"
        @click="setActiveLink('/')"
      >
        Accueil
      </RouterLink>
      <RouterLink
        to="/community"
        class="text-white hover:text-blue-200 transition duration-300"
        :class="{ 'text-blue-200 font-bold': activeLink === '/community' }"
        @click="setActiveLink('/community')"
      >
        Communauté
      </RouterLink>
    </ul>

    <!-- Icône utilisateur et bouton de déconnexion (desktop) -->
    <div class="hidden md:flex items-center space-x-6">
      <RouterLink to="/login">
        <button
          class="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 flex items-center"
        >
          <i class="fa-solid fa-sign-out-alt mr-2"></i> Déconnexion
        </button>
      </RouterLink>

      <div class="flex flex-col items-center">
        <i class="fa-solid fa-circle-user text-4xl text-white"></i>
        <h6 class="text-white mt-1 text-sm">
          {{ userStore.username ? userStore.username : 'Utilisateur' }}
        </h6>
      </div>
    </div>

    <!-- Bouton menu burger (mobile) -->
    <button
      class="md:hidden text-white text-2xl focus:outline-none"
      @click="isMenuOpen = !isMenuOpen"
    >
      <i :class="isMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
    </button>
  </nav>

  <!-- Menu mobile vertical -->
  <transition name="slide-right">
    <div v-if="isMenuOpen" class="menu-sidebar md:hidden">
      <div class="flex justify-between items-center px-6 py-4">
        <!-- Bouton pour fermer le menu (aligné avec les liens) -->
        <button class="text-white text-3xl hover:text-gray-300 transition" @click="toggleMenu">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <ul class="flex flex-col space-y-2 mt-16">
        <RouterLink
          to="/"
          class="text-white text-lg hover:text-blue-200 transition duration-300 px-4 py-2 flex items-center"
          @click="setActiveLink('/')"
        >
          <i class="fa-solid fa-house text-white mr-2"></i> Accueil
        </RouterLink>

        <RouterLink
          to="/community"
          class="text-white text-lg hover:text-blue-200 transition duration-300 px-4 py-2"
          @click="setActiveLink('/community')"
        >
          <i class="fa-solid fa-people-group mr-2"></i>Communauté
        </RouterLink>
      </ul>

      <!-- Bouton de déconnexion (mobile) : Icône au lieu du texte -->
      <button @click="userStore.logout()" class="mt-8 text-white text-lg px-4 text-left">
        <i class="fa-solid fa-sign-out-alt mr-2"></i>Déconnexion
      </button>
    </div>
  </transition>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const userStore = useUserStore()
const isMenuOpen = ref(false)
const activeLink = ref('/')

function setActiveLink(link) {
  activeLink.value = link
  isMenuOpen.value = false // Ferme le menu après sélection
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Animation pour le menu mobile */
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* Sidebar (Menu mobile aligné à droite) */
.menu-sidebar {
  background: linear-gradient(135deg, #3b82f6, #1e40af); /* Bleu dégradé */
  position: fixed;
  top: 0;
  right: 0; /* Aligné à droite */
  width: 45%; /* Largeur ajustable */
  height: 100vh; /* Pleine hauteur */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 20px;
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
}
</style>
