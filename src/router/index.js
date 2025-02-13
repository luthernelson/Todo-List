import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/task/TaskRegister.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community/Community.vue'),
    },
    {
      path: '/community/:id',
      name: 'CommunityChat',
      component: () => import('@/components/Community.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/connexion/TaskRegister.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/connexion/TaskLogin.vue'),
      meta: { requiresAuth: false },
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useUserStore()

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Rediriger vers la page de login
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    // Si l'utilisateur est authentifié et que la route ne nécessite pas d'authentification,
    // rediriger vers la dernière route visitée
    if (authStore.isLoggedIn && from.path === '/login') {
      next({ path: authStore.lastRoute })
    } else {
      // Enregistrer la dernière route visitée
      authStore.lastRoute = to.fullPath
      next()
    }
  }
})
export default router
